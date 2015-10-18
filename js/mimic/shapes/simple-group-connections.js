/**
 * Created by rus on 11.10.2015.
 */

(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	var _default = {
		circle: new mimic.Connector(),
		line: new fabric.Line(
			[0, 0, 15, 0], {
				stroke: 'black',
				strokeWidth: 1,
				selectable: false
			}),
		rectangle: new fabric.Rect({
			stroke : 'black',
			fill: 'transparent',
			width: 50,
			height: 50,
			top: 0,
			left: 0,
			selectable: false
		})
	};

	var __containtsPoint = function(obj, point) {
		return obj.originalLeft < point.x && point.x < (obj.originalLeft + obj.width) &&
			obj.originalTop < point.y && point.y < (obj.originalTop + obj.height);
	};

	mimic.SimpleGroupConnections = fabric.util.createClass(fabric.Group, {
		type: 'simple-group-connections',
		fireToObjects: true,
		initialize: function (options, objects) {
			options = options || {};

			options.width = _default.rectangle.width + _default.line.width * 2 + _default.circle.radius * 4;
			options.height = _default.rectangle.height;

			if (!objects) {
				var circleLeft = _default.circle.clone().set({
						top: options.height / 2 - _default.circle.radius,
						left: 0,
						selectable: false
					}),
					circleRight = _default.circle.clone().set({
						top: options.height / 2 - _default.circle.radius,
						left: _default.line.width * 2 + _default.circle.radius * 2 + _default.rectangle.width,
						selectable: false
					}),
					lineLeft = _default.line.clone().set({
						x1: _default.circle.radius * 2,
						x2: _default.circle.radius * 2 + _default.line.width,
						y1: options.height / 2,
						y2: options.height / 2,
						selectable: false
					}),
					lineRight = _default.line.clone().set({
						x1: _default.circle.radius * 2 + _default.line.width + _default.rectangle.width,
						x2: _default.circle.radius * 2 + _default.line.width * 2 + _default.rectangle.width,
						y1: options.height / 2,
						y2: options.height / 2,
						selectable: false
					}),
					rectangle = _default.rectangle.clone().set({
						left: _default.circle.radius * 2 + _default.line.width,
						selectable: false,
						width: _default.rectangle.width,
						height: options.height
					});
				objects = [circleLeft, circleRight, lineLeft, lineRight, rectangle];
			}

			this.callSuper('initialize', objects, options);

			this._initEvents();
		},
		_checkEventInObjects: function(event) {
			var point = {
				x: event.e.x - this.left,
				y: event.e.y - this.top
			};
			if (this.fireToObjects) {
				this._objects.forEach(function(obj) {
					if (__containtsPoint(obj, point)) {
						obj.trigger(event.e.type, event, obj);
					}
				});
			}
		},
		_onMoving: function(e) {
			if (this.fireToObjects) {
				this._objects.forEach(function(obj) {
					if (obj.type === 'connector') {
						obj.trigger('group:move', e, obj);
					}
				});
			}
		},
		_initEvents: function() {
			this.on('mousedown', this._checkEventInObjects);
			this.on('mouseup', this._checkEventInObjects);
			this.on('mousemove', this._checkEventInObjects);
			this.on('moving', this._onMoving);
		},
		clone: function () {
			var newGroup = new mimic.SimpleGroupConnections({
				left: this.left,
				top: this.top
			});
			return newGroup;
		}
	});
})(window);