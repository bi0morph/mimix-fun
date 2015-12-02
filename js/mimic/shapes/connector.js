/**
 * Created by rus on 14.10.2015.
 */

(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend,
		_default = {
			fill: 'white',
			stroke: 'black',
			top: 0,
			left: 0,
			radius: 6,
			strokeWidth: 1,
			selectable: false
		};

	mimic.Connector = fabric.util.createClass(fabric.Circle, {
		type: 'connector',
		position: 'left',
		connectedTo: null,
		_initEvents: function() {
			this.on('mousedown', function(event) {
				if (!this.connectedTo) {
					var connectionBrush = new mimic.ConnectingPathBrush(this.canvas, this); // ConnectingLineBrush
					this.canvas.setDrawingMode(connectionBrush, event.e);
				}
			});
			this.on('mouseout', function(event) {
				this.hovered = false;
				this.setFill('white');
				this.canvas.renderAll();
			});
			this.on('mousein', function(event) {
				this.hovered = true;
				this.setFill('gray');
				this.canvas.renderAll();
			});

			this.on('group:move', function() {
				if(this.connectedTo) {
					var newPoint =  mimic.util.getCenterFromGroup(this),
						options = {},
						number = this.connectedTo['position'];
					options['x' + number] = newPoint.x;
					options['y' + number] = newPoint.y;
					this.connectedTo['line'].set(options);
				}
			});
			this.on('group:scaling', function() {
				if(this.connectedTo) {
					var newPoint = mimic.util.getCenterFromGroup(this),
						options = {},
						number = this.connectedTo['position'];
					options['x' + number] = newPoint.x;
					options['y' + number] = newPoint.y;
					this.connectedTo['line'].set(options);
				}
			});
		},
		initialize: function (options) {
			options = options || {};
			extend(_default, options);

			this.callSuper('initialize', _default);

			this._initEvents();
		},
		clone: function () {

			return new mimic.Connector({
				radius: this.radius,
				fill: this.fill,
				stroke: this.stroke,
				strokeWidth: this.strokeWidth,
				left: this.left,
				top: this.top
			});
		}
	});
})(typeof exports !== 'undefined' ? exports : this);