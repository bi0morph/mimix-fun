/**
 * Created by rus on 14.10.2015.
 */

(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend,
		_default = {
			fill: 'transparent',
			stroke: '#444',
			top: 0,
			left: 0,
			radius: 7,
			strokeWidth: 2,
			selectable: false
		};

	mimic.Connector = fabric.util.createClass(fabric.Circle, {
		type: 'connector',
		_initEvents: function() {
			this.on('mousedown', function(event) {
				console.log('circleRight mousedown', event, this);
				var connectionBrush = new mimic.ConnectingBrush(this.canvas);
				this.canvas.setDrawingMode(connectionBrush, event.e);
			});
			this.on('mouseup', function() {
				//console.log('circleRight mouseup', arguments);
			});
			this.on('mousemove', function() {
				console.log('circleRight mousemove', arguments);
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