/**
 * Created by rus on 11.10.2015.
 */

(function(global) {

	'use strict';
	var fabric = global.fabric || (global.fabric = { }),
		extend = fabric.util.object.extend;

	var _default = {
		circle: new fabric.Circle({
			strokeWidth: 2,
			radius: 6,
			fill: 'transparent',
			stroke: '#444',
			top: 0,
			left: 0,
			selectable: false
		}),
		line: new fabric.Line(
			[0, 0, 15, 0], {
				stroke: 'black',
				strokeWidth: 1,
				selectable: false
			}),
		rectangle: new fabric.Rect({
			stroke : 'black',
			fill: 'transparent',
			width: 25,
			height: 25,
			top: 0,
			left: 0,
			selectable: false
		})
	};

	fabric.GroupWithConnections = fabric.util.createClass(fabric.Group, {
		connections: [],
		type: 'group-with-connections',
		initialize: function (options) {
			var objects;
			options = options || {};

			options.width = options.width || _default.rectangle.width;
			options.height = options.height || _default.rectangle.height;

			var mouseOver = function() {
					this.setFill('grey');
				},
				mouseOut = function() {
					this.setFill('transparent');
				};
			var circleLeft = _default.circle.clone().set({
					top: options.height / 2 - _default.circle.radius,
					left: 0,
					selectable: false
				}),
				circleRight = _default.circle.clone().set({
					top: options.height / 2 - _default.circle.radius,
					left: _default.line.width * 2 + _default.circle.radius * 2 + options.width,
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
					x1: _default.circle.radius * 2 + _default.line.width + options.width,
					x2: _default.circle.radius * 2 + _default.line.width * 2 + options.width,
					y1: options.height / 2,
					y2: options.height / 2,
					selectable: false
				}),
				rectangle = _default.rectangle.clone().set({
					left: _default.circle.radius * 2 + _default.line.width,
					selectable: false
				});

			circleLeft.mouseOver = mouseOver;
			circleLeft.mouseOut = mouseOut;
			circleRight.mouseOver = mouseOver;
			circleRight.mouseOut = mouseOut;
			circleLeft.line = null;
			circleRight.line = null;

			this.connections.push(circleLeft, circleRight);
			objects = [circleLeft, circleRight, lineLeft, lineRight, rectangle];
			this.callSuper('initialize', objects, options);
		},
		clone: function () {
			return new fabric.GroupWithConnections({
				left: this.left,
				top: this.top
			});
		}
	});
})(window);