/**
 * Created by rus on 23.09.2015.
 */
(function(global) {
  'use strict';

  var mimic  = global.mimic || (global.mimic = {
				canvas: null,
				init: _init,
				resizeCanvas: _resizeCanvas
			}),
		fabric  = global.fabric;

  function _resizeCanvas() {
		if (this.canvas) {
			this.canvas.setHeight(window.innerHeight);
			this.canvas.setWidth(window.innerWidth);
			this.canvas.renderAll();
		}
  }

	function _init() {
		var _CANVAS_BACKGROUND = 'rgb(255,255,255)';

		var canvas = this.canvas = new fabric.Canvas('mimic-canvas', {
			backgroundColor: _CANVAS_BACKGROUND,
			selection: false
		});

		global.addEventListener('resize', this.resizeCanvas.bind(this), false);
		this.resizeCanvas();
	}


})(typeof exports !== 'undefined' ? exports : this);