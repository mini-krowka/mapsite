// Canvas-слой точек (миграция с L.marker). Подключается ПОСЛЕ js/map.js, ДО js/filters.js и js/script.js.
// Источник данных: window.pointsModel = { points, equipment, attacks }.
// Каждая точка — модель без DOM: { id, layerType, category, iconKey, lat, lng, date, name,
//   formattedName, coordsString, popupHtml, extendedData, visible }
(function () {
    'use strict';

    // Кэш иконок: каждая иконка рисуется в offscreen canvas один раз
    const IconSpriteCache = {
        cache: {},        // iconKey -> { canvas, w, h }
        loading: {},      // защита от дублей загрузки
        _listeners: [],

        get(iconKey) {
            return this.cache[iconKey] || null;
        },

        onChange(fn) {
            this._listeners.push(fn);
        },

        _notify() {
            for (let i = 0; i < this._listeners.length; i++) {
                try { this._listeners[i](); } catch (e) { /* ignore */ }
            }
        },

        _store(key, img, w, h) {
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const ctx = c.getContext('2d');
            if (img) {
                ctx.drawImage(img, 0, 0, w, h);
            }
            this.cache[key] = { canvas: c, w, h };
            this._notify();
        },

        preload(entries) {
            if (!entries || !entries.length) return;
            for (let i = 0; i < entries.length; i++) {
                const { key, url, w, h } = entries[i];
                if (this.cache[key] || this.loading[key]) continue;
                this.loading[key] = true;
                const img = new Image();
                img.onload = () => { this._store(key, img, w, h); };
                img.onerror = () => { this._store(key, null, w, h); };
                img.src = url;
            }
        }
    };

    // Сборка списка иконок из window.ICON_MAPS (js/data.js)
    function collectIconEntries() {
        const entries = [];
        const maps = window.ICON_MAPS || {};
        const sizes = window.ICON_SIZES || {};
        const types = ['points', 'equipment', 'attacks'];
        for (let t = 0; t < types.length; t++) {
            const type = types[t];
            const map = maps[type] || {};
            const size = sizes[type] || [28, 28];
            for (const key in map) {
                entries.push({ key, url: map[key], w: size[0], h: size[1] });
            }
        }
        return entries;
    }

    const CanvasPointsLayer = L.Layer.extend({
        options: {
            pane: 'pointsPane',
            hitRadius: 10,
            maxDrawPoints: 20000,
            minDrawZoom: 1,
            margin: 24
        },

        initialize(options) {
            L.Util.setOptions(this, options);
            this._dirty = false;
            this._rafId = null;
            this._canvas = null;
            this._ctx = null;
            this._pointsOn = true;
            this._drawingActive = false;
            this._highlightId = null;
        },

        onAdd(map) {
            this._map = map;

            let pane = map.getPane(this.options.pane);
            if (!pane) {
                pane = map.createPane(this.options.pane);
                pane.style.zIndex = '500'; // над overlayPane(400), под markerPane(600)
            }

            this._canvas = L.DomUtil.create('canvas', 'leaflet-canvas-points');
            this._canvas.style.pointerEvents = 'none'; // клики обрабатываем на карте
            pane.appendChild(this._canvas);
            this._ctx = this._canvas.getContext('2d');

            // Канвас прижат к вьюпорту (_positionCanvas компенсирует трансляцию панели),
            // точки рисуем в container-координатах (latLngToContainerPoint), перерисовка
            // на move/zoom — точки следуют за картой, без обрезки по границе канваса.
            this._handlers = {
                move: () => this._scheduleRedraw(),
                moveend: () => this._redraw(),
                zoom: () => this._scheduleRedraw(),
                zoomend: () => this._redraw(),
                viewreset: () => this._redraw(),
                resize: () => this._redraw()
            };
            for (const ev in this._handlers) {
                map.on(ev, this._handlers[ev], this);
            }

            map.on('click', this._onMapClick, this);

            IconSpriteCache.onChange(() => this._scheduleRedraw());
            IconSpriteCache.preload(collectIconEntries());

            this._redraw();
        },

        onRemove(map) {
            for (const ev in this._handlers) {
                map.off(ev, this._handlers[ev], this);
            }
            map.off('click', this._onMapClick, this);
            if (this._rafId) {
                cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
            if (this._canvas) {
                L.DomUtil.remove(this._canvas);
                this._canvas = null;
            }
            this._map = null;
        },

        // ===== API =====

        addPoints(points, layerType) {
            if (!Array.isArray(points)) return this;
            if (!window.pointsModel[layerType]) window.pointsModel[layerType] = [];
            window.pointsModel[layerType].push.apply(window.pointsModel[layerType], points);
            this.applyFilter();
            return this;
        },

        setLayerTypeVisible(layerType, visible) {
            if (layerType === 'equipment') {
                window.isMilEquipVisible = visible;
            } else if (layerType === 'attacks') {
                window.isAttacksVisible = visible;
            } else {
                this._pointsOn = visible;
            }
            this.applyFilter();
            return this;
        },

        setDateRange(start, end) {
            window.pointsDateRange = window.pointsDateRange || { start: null, end: null };
            window.pointsDateRange.start = start;
            window.pointsDateRange.end = end;
            this.applyFilter();
            return this;
        },

        // Пересчёт visible по текущему глобальному состоянию фильтров
        applyFilter() {
            const eqSel = window.selectedEquipmentCategories;
            const atkSel = window.selectedAttacksCategories;
            const groupMap = (typeof window.categoryToGroupTag !== 'undefined') ? window.categoryToGroupTag : null;

            const types = ['points', 'equipment', 'attacks'];
            for (let t = 0; t < types.length; t++) {
                const type = types[t];
                const arr = window.pointsModel[type] || [];
                const layerOn = type === 'points' ? this._pointsOn
                             : type === 'equipment' ? !!window.isMilEquipVisible
                             : !!window.isAttacksVisible;

                for (let i = 0; i < arr.length; i++) {
                    const p = arr[i];
                    if (!layerOn) {
                        p.visible = false;
                        continue;
                    }
                    if (type === 'equipment') {
                        p.visible = (eqSel === null || eqSel === undefined) || eqSel.indexOf(p.category) !== -1;
                    } else if (type === 'attacks') {
                        if (atkSel === null || atkSel === undefined) {
                            p.visible = true;
                        } else {
                            const groupTag = groupMap ? groupMap[p.category] : null;
                            p.visible = !!groupTag && atkSel.indexOf(groupTag) !== -1;
                        }
                    } else {
                        p.visible = this._dateAllowed(p);
                    }
                }
            }
            this._scheduleRedraw();
            return this;
        },

        invalidate() {
            this._scheduleRedraw();
            return this;
        },

        highlightPoint(id) {
            this._highlightId = id || null;
            this._scheduleRedraw();
            return this;
        },

        getVisibleCount() {
            let count = 0;
            const types = ['points', 'equipment', 'attacks'];
            for (let t = 0; t < types.length; t++) {
                const arr = window.pointsModel[types[t]] || [];
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].visible) count++;
                }
            }
            return count;
        },

        findPointByName(query) {
            if (!query) return null;
            const q = String(query).toLowerCase();
            const types = ['points', 'equipment', 'attacks'];
            for (let t = 0; t < types.length; t++) {
                const arr = window.pointsModel[types[t]] || [];
                for (let i = 0; i < arr.length; i++) {
                    const p = arr[i];
                    if (p.name && String(p.name).toLowerCase().indexOf(q) !== -1) return p;
                }
            }
            return null;
        },

        // Hit-test в container-координатах (совпадает с отрисовкой); возвращает модель или null
        getPointAt(containerPoint) {
            const map = this._map;
            if (!map) return null;
            const r = this.options.hitRadius;
            // Обратный порядок: точки рисуются последними (сверху) -> приоритет
            const types = ['points', 'equipment', 'attacks'];
            for (let t = 0; t < types.length; t++) {
                const arr = window.pointsModel[types[t]] || [];
                for (let i = arr.length - 1; i >= 0; i--) {
                    const p = arr[i];
                    if (!p.visible) continue;
                    const pt = map.latLngToContainerPoint([p.lat, p.lng]);
                    if (Math.abs(pt.x - containerPoint.x) <= r && Math.abs(pt.y - containerPoint.y) <= r) {
                        return p;
                    }
                }
            }
            return null;
        },

        // ===== Реализация =====

        _dateAllowed(p) {
            if (!p.date) return true;
            const r = window.pointsDateRange;
            if (!r || !r.start || !r.end) return true;
            if (typeof isDateInRange !== 'function') return true;
            return isDateInRange(p.date, r.start, r.end);
        },

        _scheduleRedraw() {
            if (this._rafId) return;
            this._rafId = requestAnimationFrame(() => {
                this._rafId = null;
                this._redraw();
            });
        },

        _redraw() {
            const map = this._map;
            if (!map || !this._canvas || !this._ctx) return;

            const size = map.getSize();
            const dpr = window.devicePixelRatio || 1;
            const w = Math.max(1, Math.round(size.x * dpr));
            const h = Math.max(1, Math.round(size.y * dpr));
            if (this._canvas.width !== w || this._canvas.height !== h) {
                this._canvas.width = w;
                this._canvas.height = h;
            }
            // CSS-размер в пикселях карты (без dpr), чтобы canvas не растягивался
            this._canvas.style.width = size.x + 'px';
            this._canvas.style.height = size.y + 'px';

            // Прижимаем канвас к вьюпорту: компенсируем трансляцию панели (panePos),
            // чтобы рисуемые container-координаты не обрезались границей канваса
            this._positionCanvas();

            const ctx = this._ctx;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, size.x, size.y);

            this._drawFrame(ctx, size);

            if (this._highlightId) {
                this._drawHighlight(ctx, size);
            }
        },

        _positionCanvas() {
            const map = this._map;
            if (!map || !this._canvas) return;
            // Позиция канваса = сдвиг, обратный трансляции панели:
            // containerPointToLayerPoint([0,0]) = -panePos, канвас сеткой оказывается у (0,0) контейнера
            L.DomUtil.setPosition(this._canvas, map.containerPointToLayerPoint([0, 0]));
        },

        _drawFrame(ctx, size) {
            const map = this._map;
            if (!map) return;
            if (map.getZoom() < this.options.minDrawZoom) return;

            const bounds = map.getBounds().pad(0.15);
            const M = this.options.margin;
            let drawn = 0;

            // Порядок: attacks -> equipment -> points (точки сверху)
            const types = ['attacks', 'equipment', 'points'];
            for (let t = 0; t < types.length; t++) {
                const arr = window.pointsModel[types[t]] || [];
                for (let i = 0; i < arr.length; i++) {
                    const p = arr[i];
                    if (!p.visible) continue;

                    // Culling по гео-границам (текущий вьюпорт)
                    if (p.lat < bounds.getSouth() || p.lat > bounds.getNorth() ||
                        p.lng < bounds.getWest() || p.lng > bounds.getEast()) {
                        continue;
                    }
                    // Рисуем в container-координатах (канвас прижат к вьюпорту)
                    const pt = map.latLngToContainerPoint([p.lat, p.lng]);
                    if (pt.x < -M || pt.y < -M || pt.x > size.x + M || pt.y > size.y + M) continue;

                    const icon = IconSpriteCache.get(p.iconKey);
                    if (!icon) continue;

                    ctx.drawImage(icon.canvas, pt.x - icon.w / 2, pt.y - icon.h / 2, icon.w, icon.h);

                    if (++drawn >= this.options.maxDrawPoints) return;
                }
            }
        },

        _drawHighlight(ctx, size) {
            const map = this._map;
            const p = this._findById(this._highlightId);
            if (!p) return;
            const pt = map.latLngToContainerPoint([p.lat, p.lng]);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ff0000';
            ctx.fill();
        },

        _findById(id) {
            const types = ['points', 'equipment', 'attacks'];
            for (let t = 0; t < types.length; t++) {
                const arr = window.pointsModel[types[t]] || [];
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id === id) return arr[i];
                }
            }
            return null;
        },

        _onMapClick(e) {
            if (this._drawingActive) return;

            // Рисование/ластик активны — точки не перехватывают клик
            const dp = window.drawPanel;
            if (dp && (dp.isDrawing || dp.currentTool === 'icon' || dp.isEraserActive)) return;

            const containerPoint = e.containerPoint || (this._map && this._map.latLngToContainerPoint(e.latlng));
            if (!containerPoint) return;
            const p = this.getPointAt(containerPoint);
            if (!p) return;

            L.popup()
                .setLatLng([p.lat, p.lng])
                .setContent(p.popupHtml || '')
                .openOn(this._map);
        }
    });

    window.CanvasPointsLayer = CanvasPointsLayer;
    window.IconSpriteCache = IconSpriteCache;
})();
