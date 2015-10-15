/**
 * Created by rus on 13.10.2015.
 */
(function(global) {

	'use strict';

	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	if (mimic.LeftPanel) {
		fabric.warn('mimic.LeftPanel is already defined');
		return;
	}


	var __containtsPoint = function(obj, point) {
		return obj.originalLeft < point.x && point.x < (obj.originalLeft + obj.width) &&
			obj.originalTop < point.y && point.y < (obj.originalTop + obj.height);
	};

	mimic.LeftPanel = fabric.util.createClass(fabric.Group,{

		/**
		 * Type of an object
		 * @type String
		 * @default
		 */
		type: 'left-panel',

		initialize: function(options) {
			options = options || { };
			var objects = this._createObjects(options);

			this.callSuper('initialize', objects, options);

			this._initEvents();
		},
		_initEvents: function() {
			this._objects.forEach(function(obj) {
				obj.on('panel:mousedown', function(event) {
					if(this.type !== 'rect') {
						var temp = this.clone();
						temp._originalLeft = this._originalLeft;
						temp._originalTop = this._originalTop;
						temp.set({
							left: this._originalLeft + 1,
							top: this._originalTop + 1,
							hasBorders: false,
							hasControls: false
						});

						this.canvas.add(temp);
						this.canvas.__onMouseDown(event.e);
					}
				});
			});

			this.on('mousedown', function(event) {
				var point = {
					x: event.e.x - this.left,
					y: event.e.y - this.top
				};
				this._objects.forEach(function(obj) {
					if (__containtsPoint(obj, point)) {
						obj.trigger('panel:mousedown', event);
					}
				});
			});
		},
		_createObjects: function(options) {
			var _objects = [];
			console.log('_createObjects', options);
			_objects.push( new fabric.Rect({
				top: 0,
				left: 0,
				width: options.width,
				height: options.height,
				fill: 'rgb(200, 225, 200)',
				hasControls: false,
				hasBorders: false,
				selectable: false
			}) );
			_objects.push( new mimic.SimpleGroupConnections({
				top: 15,
				left: 15,
				hasControls: false,
				hasBorders: false,
				selectable: false
			}) );
			return _objects;
		},
		complexity: function() {
			return 1;
		}
	});

})(typeof exports !== 'undefined' ? exports : this);
