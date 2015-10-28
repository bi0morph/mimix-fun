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

		var canvas = this.canvas = new mimic.Canvas('mimic-canvas', {
			backgroundColor: _CANVAS_BACKGROUND,
			selection: false
		});

		global.addEventListener('resize', this.resizeCanvas.bind(this), false);
		this.resizeCanvas();

		var leftPanel = new mimic.LeftPanel({
			top: 0,
			left: 0,
			width: 160,
			height: canvas.height,
			hasControls: false,
			hasBorders: false,
			selectable: false
		});

		canvas.add(leftPanel);

		//var controlValve = new mimic.GroupWithConnections(false, {
		//	top: 200,
		//	left: 300
		//});
		//
		//canvas.add(controlValve);
		canvas.renderAll();
	}


})(typeof exports !== 'undefined' ? exports : this);