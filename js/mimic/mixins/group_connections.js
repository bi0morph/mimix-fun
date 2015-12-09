/**
 * Created by rus on 27.10.2015.
 */
/**
 * Created by rus on 14.10.2015.
 */
(function(global) {

	var fabric = global.fabric,
		mimic = global.mimic,
		clone = fabric.util.object.clone;

	var _default = {
		circle: new mimic.Connector({
			originX: 'center',
			originY: 'center'
		}),
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

	var __containtsPoint = function(obj, point, e) {
		var bound = mimic.util.getBoundingBoxFromGroup(obj);
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
		_setObjectNotActive: function(object) {
			object.group = this;
		},
		addWithUpdate: function(object) {
			this._restoreObjectsState();
			if (object) {
				this._objects.push(object);
				object.group = this;
				object._set('canvas', this.canvas);
			}
			// since _restoreObjectsState set objects inactive
			this.forEachObject(this._setObjectNotActive, this);
			this._calcBounds();
			this._updateObjectsCoords();
			return this;
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
		_connectionsOutSide: [],
		_createConnection: function() {
			return _default.circle.clone();
		},
		_createConnections: function(params) {
			var top = params.height/4 + _default.circle.radius,
				circleLeft = _default.circle.clone().set({
					top: top,
					left: _default.circle.radius,
					selectable: false,
					visible: false,
					originX: 'center',
					originY: 'center'
				}),
				circleRight = _default.circle.clone().set({
					top: top,
					left: params.width + this._padding + _default.circle.radius,
					selectable: false,
					position: 'right',
					visible: false,
					originX: 'center',
					originY: 'center'
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
					if (obj.type === 'connector') {
						obj.trigger('group:move', e, obj);
					}
				});
			}
		},
		hideConnections: function() {
			this._connectionsOutSide.forEach(function(obj) {
				obj.visible = false;
			});
		},
		showConnections: function() {
			this._connections.forEach(function(con) {
				if (con.outSide) {
					con.outSide.visible = true;
					con._positionOutSide();
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
		_onAdded: function() {
			var self = this,
				temp, box;
			this._connections.forEach(function(connection) {
				temp = clone(connection);
				box = mimic.util.getBoundingBoxFromGroup(connection);
				temp.set({
					top: box.top,
					left: box.left
				});
				connection.outSide = temp;

				temp.stroke = 'red';
				temp._group = temp.group;
				temp.group = null;

				self._connectionsOutSide.push(temp);
				connection._positionOutSide();
				self.canvas.add(temp);
			});
			self.canvas.renderAll();
		},
		_onRemoved: function() {
			var self = this;
			this._connections.forEach(function(connection) {
				self.canvas.remove(connection.outSide);
			});
		},
		_initEvents: function() {
			this.on('added', this._onAdded);
			this.on('removed', this._onRemoved);
			this.on('mousedown', this._checkEventInObjects);
			this.on('mouseup', this._checkEventInObjects);
			this.on('mousemove', this._checkEventInObjects);
			this.on('mouseout', this._onMouseOut);
			this.on('moving', this._onMoving);
			this.on('scaling', this._onScaling);
		}
	});
})(typeof exports !== 'undefined' ? exports : this);
