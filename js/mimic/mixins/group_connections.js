/**
 * Created by rus on 27.10.2015.
 */
/**
 * Created by rus on 14.10.2015.
 */
(function(global) {

	var fabric = global.fabric,
		clone = fabric.util.object.clone,
		mimic = global.mimic;

	var _default = {
		circle: new mimic.Connector(),
		line: new fabric.Line(
			[0, 0, 15, 0], {
				stroke: 'black',
				strokeWidth: 1,
				selectable: false
			}),
		rectangle: new fabric.Rect({
			stroke: 'black',
			fill: 'transparent',
			top: 0,
			left: 0,
			selectable: false
		})
	};
	var _getBoundingBoxFromGroup = function(obj) {
		var objTmp = clone( obj),
			groupTmp = obj.group,
			bound;

		groupTmp._setObjectPosition(objTmp);
		objTmp.setCoords();
		objTmp.hasControls = objTmp.__origHasControls;
		delete objTmp.__origHasControls;
		objTmp.set('active', false);
		objTmp.setCoords();
		delete objTmp.group;

		bound = objTmp.getBoundingRect();

		return bound;
	};

	var __containtsPoint = function(obj, point, e) {
		var bound = _getBoundingBoxFromGroup(obj),
			objPoint = {
			tp: {
				x: obj.originalLeft * point.scaleX,
				y: obj.originalTop * point.scaleY
			},
			rb: {
				x: (obj.originalLeft + obj.width) * point.scaleX,
				y: (obj.originalTop + obj.height) * point.scaleY
			}
		};
		//return objPoint.tp.x < point.x && point.x < objPoint.rb.x &&
		//			objPoint.tp.y < point.y && point.y < objPoint.rb.y;
		return (bound.left < e.x && e.x < (bound.left + bound.width) &&
		bound.top < e.y && e.y < (bound.top + bound.height));
	};

	fabric.util.object.extend(fabric.Group.prototype, {
		_wrapper: null,
		_padding: 6,
		_createWrapper: function(params) {
			this._wrapper = _default.rectangle.clone().set({
				width: params.width + 2 * this._padding,
				height: params.height/2
			});

			return this._wrapper;
		},
		_createObjects: function(params, objects) {
			var objectsTemp = objects || [];

			objectsTemp.push(this._createWrapper(params));

			var concat = Array.prototype.push;
			concat.apply(objectsTemp, this._createConnections(params));

			return objectsTemp;
		},
		findTarget: function(e) {
			var point = {
				x: e.x - this.left,
				y: e.y - this.top,
				scaleX: this.scaleX,
				scaleY: this.scaleY
			};
			var target;
			this.getObjects().some(function(obj) {
				if (obj.type === 'connector' && obj.visible && __containtsPoint(obj, point, e)) {
					target = obj;
					return true;
				}
			});
			return target;
		},
		_connections: [],
		_createConnection: function() {
			return _default.circle.clone();
		},
		_createConnections: function(params) {
			var top = params.height/4 - _default.circle.radius,
				circleLeft = _default.circle.clone().set({
					top: top,
					left: 0,
					selectable: false,
					visible: false
				}),
				circleRight = _default.circle.clone().set({
					top: top,
					left: params.width + this._padding - _default.circle.radius,
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
				y: event.e.y - this.top,
				scaleX: this.scaleX,
				scaleY: this.scaleY
			};
			var self = this;
			if (this.fireToObjects) {
				this._objects.forEach(function(obj) {
					if (obj.type === 'connector' && obj.visible) {
						if (__containtsPoint(obj, point, event.e)) {
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
		},
		_onMoving: function(e) {
			if (this.fireToObjects) {
				this._objects.forEach(function(obj) {
					if (obj.type === 'connector' && obj.visible) {
						obj.trigger('group:move', e, obj);
					}
				});
			}
		},
		hideConnections: function() {
			this._objects.forEach(function(obj) {
				if (obj.type === 'connector') {
					obj.visible = false;
				}
			});
		},
		showConnections: function() {
			this._objects.forEach(function(obj) {
				if (obj.type === 'connector') {
					obj.visible = true;
				}
			});
		},
		_onScaling: function(e) {
			if (this.fireToObjects) {
				this._objects.forEach(function(obj) {
					if (obj.type === 'connector') {
						obj.trigger('group:scaling', e, obj);
					}
				});
			}
		},
		_onMouseOut: function() {
			if (this.fireToObjects) {
				this._objects.forEach(function(obj) {
					if (obj.type === 'connector') {
						obj.trigger('mouseout', event);
					}
				});
			}
		},
		_initEvents: function() {
			this.on('mousedown', this._checkEventInObjects);
			this.on('mouseup', this._checkEventInObjects);
			this.on('mousemove', this._checkEventInObjects);
			this.on('mouseout', this._onMouseOut);
			this.on('moving', this._onMoving);
			this.on('scaling', this._onScaling);
		}
	});
})(typeof exports !== 'undefined' ? exports : this);
