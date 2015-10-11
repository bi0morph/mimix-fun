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

  global.mimic = {
    canvas : canvas,
    setAllObjectSelectable: _setAllObjectSelectable
  }
})(window, fabric);