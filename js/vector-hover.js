// Единый диспетчер указателя для векторных панелей
// (vectorControl 405 / vectorPoly 410 / vectorLines 420).
//
// canvas'ы этих панелей имеют pointer-events:none (см. js/map.js), поэтому штатная
// mouse-обработка Canvas-рендерера их не получает: верхний canvas перехватывал бы
// все события, и слои в нижних панелях не получали mouseover (брек тултипов).
//
// Модуль повторяет логику Canvas._handleMouseHover / _handleMouseOut / _onClick
// (Leaflet 1.9.4), но hit-test идёт по всем трём renderer'ам в порядке z-index
// (vectorLines > vectorPoly > vectorControl), а внутри renderer'а — по порядку
// отрисовки сверху вниз. События fire'ятся через map._fireDOMEvent — тот же путь,
// что и в рендерере (в событии формируются latlng, layerPoint, originalEvent —
// это нужно для sticky-тултипов: Tooltip._openTooltip / _moveTooltip).
(function () {
    'use strict';

    var PANE_Z = {
        vectorLines: 420,
        vectorPoly: 410,
        vectorControl: 405
    };
    var THROTTLE_MS = 32; // как в Canvas._handleMouseHover

    var map = window.leafletMap;
    if (!map) return;

    var vectorItems = []; // { layer, z }
    var hovered = null;
    var lastMoveTs = 0;

    function isVectorLayer(layer) {
        var pane = layer && layer.options && layer.options.pane;
        return pane !== undefined && pane !== null &&
            PANE_Z[pane] !== undefined && !!layer._renderer;
    }

    function collectInto(root) {
        root.eachLayer(function (l) {
            if (l.eachLayer) collectInto(l);
            else if (isVectorLayer(l)) vectorItems.push({ layer: l, z: PANE_Z[l.options.pane] });
        });
    }

    function eachLayerOf(root, cb) {
        root.eachLayer(function (l) {
            if (l.eachLayer) eachLayerOf(l, cb);
            else cb(l);
        });
    }

    map.on('layeradd', function (e) {
        collectInto(e.layer);
    });

    map.on('layerremove', function (e) {
        eachLayerOf(e.layer, function (l) {
            for (var i = vectorItems.length - 1; i >= 0; i--) {
                if (vectorItems[i].layer === l) {
                    vectorItems.splice(i, 1);
                    break;
                }
            }
            if (hovered === l) clearHover(null);
        });
    });

    // Верхний слой в точке: панели по убыванию z; внутри renderer'а —
    // порядок отрисовки сверху вниз (_drawLast → prev)
    function topmostAt(point) {
        var byRenderer = {};
        for (var i = 0; i < vectorItems.length; i++) {
            var layer = vectorItems[i].layer;
            if (layer.options.interactive === false) continue;
            var r = layer._renderer;
            if (!r) continue;
            var key = r._leafletId;
            if (!byRenderer[key]) byRenderer[key] = { z: vectorItems[i].z, renderer: r };
        }
        var list = [];
        for (var key in byRenderer) list.push(byRenderer[key]);
        list.sort(function (a, b) { return b.z - a.z; });
        for (var k = 0; k < list.length; k++) {
            var order = list[k].renderer._drawLast;
            while (order) {
                var l = order.layer;
                if (l.options.interactive !== false && l._containsPoint && l._containsPoint(point)) {
                    return l;
                }
                order = order.prev;
            }
        }
        return null;
    }

    function setCursor(active) {
        L.DomUtil[active ? 'addClass' : 'removeClass'](map.getContainer(), 'leaflet-interactive');
    }

    function clearHover(e) {
        if (!hovered) return;
        if (e) map._fireDOMEvent(e, 'mouseout', [hovered]);
        else hovered.fire('mouseout', {});
        hovered = null;
        lastMoveTs = 0; // как _mouseHoverThrottled = false в _handleMouseOut
        setCursor(false);
    }

    // Маркеры, попапы, тултипы и контролы обрабатывают события сами —
    // для них векторный hover не нужен (как в штатном поведении canvas'ов)
    function overOwnInteractive(e) {
        var t = e && e.target;
        return !!(t && t.closest && t.closest(
            '.leaflet-marker-pane, .leaflet-popup-pane, .leaflet-tooltip-pane, .leaflet-control-container'
        ));
    }

    function onMouseMove(e) {
        if (!map || map.dragging.moving() || map._animatingZoom) return;
        if (overOwnInteractive(e)) {
            clearHover(e);
            return;
        }
        var now = Date.now();
        if (now - lastMoveTs < THROTTLE_MS) return;
        lastMoveTs = now;

        var point = map.mouseEventToLayerPoint(e);
        var layer = topmostAt(point);
        if (layer !== hovered) {
            if (hovered) {
                map._fireDOMEvent(e, 'mouseout', [hovered]);
                hovered = null;
            }
            if (layer) {
                setCursor(true);
                map._fireDOMEvent(e, 'mouseover', [layer]);
                hovered = layer;
            } else {
                setCursor(false);
            }
        }
        // sticky-тултипам нужен mousemove на наведённом слое (Tooltip._moveTooltip)
        if (hovered) {
            map._fireDOMEvent(e, 'mousemove', [hovered]);
        }
    }

    function onMapMouseOut(e) {
        if (hovered) clearHover(e);
    }

    function onClick(e) {
        if (overOwnInteractive(e)) return;
        var point = map.mouseEventToLayerPoint(e);
        var layer = topmostAt(point);
        if (layer) {
            map._fireDOMEvent(e, e.type, [layer]);
        }
    }

    map.on('mousemove', onMouseMove);
    map.on('click dblclick mousedown mouseup contextmenu', onClick);
    map.getContainer().addEventListener('mouseleave', onMapMouseOut);

    // Первичный сбор (на случай, если слои добавлены до инициализации модуля)
    collectInto(map);
})();
