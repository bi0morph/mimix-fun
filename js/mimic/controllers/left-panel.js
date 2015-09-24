/**
 * Created by rus on 23.09.2015.
 */
(function(global) {
	"use strict";
	var _options = {
			left: 0,
			top: 0,
			fill: 'grey',
			width: 200,
			height: mimic.canvas.height,
			selectable: false
		},
		_panel = new fabric.SiplePanel(_options),
		_shadow = {
			color: 'rgba(0,0,0,0.6)',
			blur: 3,
			offsetX: 2,
			offsetY: 0,
			opacity: 0.6,
			fillShadow: true,
			strokeShadow: true
		};

	function drawButtons(button) {
		canvas.add(button);
	}
	function _drawPanelTo(canvas) {
		canvas.add(_panel);
		_panel.setShadow(_shadow);
		_panel.drawButtonsTo(canvas);
	}
	function _removePanel() {
		mimic.canvas.remove(_panel);
		_panel.buttons.forEach(function drawButtons(button) {
			canvas.remove(button);
		});
	}
	function _addButton(button) {
		_panel.addButton(button);
	}

	global.mimic = global.mimic || {};
	global.mimic.leftPanel = {
		addButton: _addButton,
		drawTo: _drawPanelTo,
		remove: _removePanel
	};

})(window);
