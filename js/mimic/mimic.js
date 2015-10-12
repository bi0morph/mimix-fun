/**
 * Created by rus on 23.09.2015.
 */
(function(global, fabric) {
  'use strict';

  if (!fabric || !fabric.Canvas) {
    console.error('fabric is not included');
    return;
  }

  var _CANVAS_BACKGROUND = 'rgb(220,255,220)';

  var canvas = new fabric.Canvas('mimic-canvas', {
    backgroundColor: _CANVAS_BACKGROUND
  });
  canvas.selection = false;

  function resizeCanvas() {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
  }
  global.addEventListener('resize', resizeCanvas, false);

  resizeCanvas();

  var _setAllObjectSelectable = function(key) {
    canvas.getObjects().forEach(function(o) {
      o.set('selectable', key && !o.isPanel && !o.isButton);
    });
  };
  var _showAllConnections = function(key) {



    canvas.getObjects().forEach(function(o) {
      if (o.type === 'group-with-connections' && !o.isButton) {

        if (key) {
          var items = o._objects;
          o._restoreObjectsState();
          o.set('visible', false);
          for(var i = 0; i < items.length; i++) {
            canvas.add(items[i]);
          }
        } else {
          var items = o._objects;
          o.set('visible', true);
          for(var i = 0; i < items.length; i++) {
            canvas.remove(items[i]);
          }
        }
      }
    });
  };

  global.mimic = {
    canvas : canvas,
    setAllObjectSelectable: _setAllObjectSelectable,
    showAllConnections: _showAllConnections
  }
})(window, fabric);