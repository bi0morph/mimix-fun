/**
 * Created by rus on 10.10.2015.
 */

(function(global) {
	"use strict";
	var _optionPanel = {
			left:  null,
			top: 0,
			width: 200,
			height: 50,
			padding: 15
		},
		_hoverCollor = 'rgb(200,200,200)',
		_normalCollor = 'rgb(200,0,0)',
		_activeCollor = 'rgb(0,200,0)',
		_activeButton = null;

	_optionPanel.left = mimic.canvas.width - _optionPanel.width*3;
	var _panelBackground = new fabric.Rect({
		left: _optionPanel.left,
		top: _optionPanel.top,
		fill: 'white',
		width: _optionPanel.width,
		height: _optionPanel.height,
		selectable: false
	});
	_panelBackground.setShadow({
		color: 'rgba(0,0,0,0.6)',
		blur: 3,
		offsetX: -1,
		offsetY: 1,
		opacity: 0.6,
		fillShadow: true,
		strokeShadow: true
	});

	var move = new fabric.Text('move', {
		fontFamily: 'Arial',
		left: _optionPanel.left + _optionPanel.padding,
		top: _optionPanel.top + _optionPanel.padding,
		textBackgroundColor: 'rgb(0,200,0)',
		selectable: false,
		fontSize: 20
	});

	_activeButton = move;

	var _setUpEvents = function(button, _canvas) {
		var _onMouseOver = function() {
				if (_activeButton !== this) {
					this.set('textBackgroundColor', _hoverCollor);
					_canvas.renderAll();
				}
			},
			_onMouseOut = function() {
				if (_activeButton !== this) {
					this.set('textBackgroundColor', _normalCollor);
					_canvas.renderAll();
				}
			},
			_onMouseDown = function() {
				if (_activeButton !== this) {
					this.set('textBackgroundColor', _activeCollor);
					_activeButton.set('textBackgroundColor', _normalCollor);
					_activeButton = this;
					mimic.cursor.trigger('cursor:change', this.text);
					_canvas.renderAll();
				}
			};
		button.on('mouseover', _onMouseOver);
		button.on('mouseout', _onMouseOut);
		button.on('mousedown', _onMouseDown);
	};

	var connect = move.clone();
	connect.set({
		text: 'connect',
		left: _optionPanel.left + _optionPanel.width/2 + _optionPanel.padding,
		textBackgroundColor: 'rgb(200,0,0)',
		selectable: false
	});


	function _init(canvas) {
		_setUpEvents(move, canvas);
		_setUpEvents(connect, canvas);
		_panelBackground.isPanel = true;
		move.isButton = connect.isButton = true;
		canvas.add(_panelBackground, move, connect);
		canvas.renderAll();

		return this;
	}
	function _show() {
		_panelBackground.set('visible', true);
		move.set('visible', true);
		connect.set('visible', true);
		_panelBackground.canvas.renderAll();
		return this;
	}
	function _hide() {
		_panelBackground.set('visible', false);
		move.set('visible', false);
		connect.set('visible', false);

		_panelBackground.canvas.renderAll();
		return this;
	}
	global.mimic = global.mimic || {};
	global.mimic.rightPanel = {
		init: _init,
		show: _show,
		hide: _hide
	};

})(window);
