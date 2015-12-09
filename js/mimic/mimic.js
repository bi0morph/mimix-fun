/**
 * Created by rus on 23.09.2015.
 */
(function(global) {
  'use strict';

  var mimic  = global.mimic || (global.mimic = {
				canvas: null,
				init: _init,
				resizeCanvas: _resizeCanvas,
				startEdit: _startEdit,
				stopEdit: _stopEdit
			});

	function _startEdit() {
		this.canvas.getObjects().forEach(function(obj) {
			if (obj.type != 'left-panel') {
				obj.showConnections && obj.showConnections();
				obj.selectable = true;
			}
		});
		this.canvas.deactivateAll();
		this.canvas.renderAll();
	}
	function _stopEdit() {
		this.canvas.getObjects().forEach(function(obj) {
			if (obj.type != 'left-panel') {
				obj.hideConnections && obj.hideConnections();
				obj.selectable = false;
			}
		});
		this.canvas.deactivateAll();
		this.canvas.renderAll();
	}
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

		canvas.renderAll();

		// TODO: remove connection from group. make them separate

		// TODO: fix connection lines start position

		// TODO: fix connection lines end position

		// TODO: create types of connection lines

		// TODO: add build process (concotanate, minimaze, source map, eslint)
	}


})(typeof exports !== 'undefined' ? exports : this);