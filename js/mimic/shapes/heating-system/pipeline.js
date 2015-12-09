/**
 * Created by rus on 21.10.2015.
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
			fill: 'transparent',
			top: 0,
			left: 0,
			selectable: false
		})
	};
	var __containtsPoint = function(obj, point) {
		return obj.originalLeft < point.x && point.x < (obj.originalLeft + obj.width) &&
			obj.originalTop < point.y && point.y < (obj.originalTop + obj.height);
	};


	mimic.PipeLine = fabric.util.createClass(fabric.Group, {
		type: 'pipe-line',
		_line: null,
		_triangle: null,
		_wrapper: null,
		padding: 10,
		_createLine: function(params) {
			var strokeWidth = 4,
				top = params.height/4 - strokeWidth/2;
			this._line = new fabric.Line([this.padding, top, params.width + this.padding, top], {
				fill: params.color,
				stroke: params.color,
				strokeWidth: strokeWidth
			});
			return this._line;
		},
		_createTreangle: function(params) {
			this._triangle = new fabric.Triangle({
				width: params.height/2,
				height: params.height/2,
				fill: params.color,
				left: Math.floor(params.width * 3/4)+ this.padding,
				top: 0,
				angle: 90
			});
			return this._triangle;
		},
		_createWrapper: function(params) {
			this._wrapper = _default.rectangle.clone().set({
				width: params.width + 2 * this.padding,
				height: params.height/2
			});

			return this._wrapper;
		},
		_createObjects: function(params) {
			var objects = [];
			objects.push( this._createWrapper(params) );
			objects.push( this._createTreangle(params) );
			objects.push( this._createLine(params) );

			Array.prototype.push.apply(objects, this._createConnections(params));
			return objects;
		},
		initialize: function (color, options) {
			var objects;
			options = options || {};
			var params = {
				width: 60,
				height: 40,
				color: color || 'black'
			};
			this.collor = params.color;
			objects = this._createObjects(params);

			this.callSuper('initialize', objects, options);
			this._initEvents();
		},
		clone: function () {
			var newGroup = new mimic.PipeLine(this.collor, {
				left: this.left,
				top: this.top
			});
			return newGroup;
		},



		findTarget: function(e) {
			var point = {
				x: e.x - this.left,
				y: e.y - this.top
			};
			var target;
			this.getObjects().some(function(obj) {
				if (obj.type === 'connector' && __containtsPoint(obj, point)) {
					target = obj;
					return true;
				}
			});
			return target;
		},
		_createConnections: function(params) {
			var top = params.height/4,
				circleLeft = _default.circle.clone().set({
					top: top,
					left: _default.circle.radius,
					selectable: false,
					visible: false
				}),
				circleRight = _default.circle.clone().set({
					top: top,
					left: params.width + this.padding,
					selectable: false,
					position: 'right',
					visible: false
				});
			this._connections = [ circleLeft, circleRight ];
			return this._connections;
		},
		fireToObjects: true,
		_checkEventInObjects: function(event) {

			var point = {
				x: event.e.x - this.left,
				y: event.e.y - this.top
			};
			if (this.fireToObjects) {
				this._objects.forEach(function(obj) {
					if (obj.type === 'connector') {
						if (__containtsPoint(obj, point)) {
							if(!obj.hovered) {
								obj.trigger('mousein', event);
							}
							obj.trigger(event.e.type, event, obj);
						} else if(obj.hovered) {
							obj.trigger('mouseout', event);
						}
					}
				});
			}
		}
	});
})(window);