/**
 * Created by rus on 13.10.2015.
 */
(function(global) {

	'use strict';

	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend,
		clone = fabric.util.object.clone;

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
			var self = this;
			this._objects.forEach(function(obj) {
				obj.on('panel:mousedown', function(event) {
					if(this.selectable) {
						var temp = this.clone();
						temp._originalLeft = temp.originalLeft = this._originalLeft || this.originalLeft || 0;
						temp._originalTop = temp.originalTop = this._originalTop || this.originalTop || 0;
						temp.set({
							left: temp.originalLeft + 1,
							top: temp.originalTop + 1,
							fireToObjects: false,
							hasControls: false,
							lockUniScaling: true
						});
						temp.showHeader && temp.showHeader();

						var checkPanel = function(e) {
								if(e.e.x < self.left + self.width) {
									if (temp.canvas) {
										temp.canvas.remove(temp);
									}
									return true;
								}
							},
							oneMouseUpHandler = function oneMouseUpHandler(e) {
								if( checkPanel(e) ) {
									return;
								}
								temp.hasControls = true;
								temp.showConnections && temp.showConnections();

								if (!this.fireToObjects) {
									this.fireToObjects = true;
								}
								temp.off('mouseup', oneMouseUpHandler);
								temp.on('mouseup', everyMouseUpHandler);
								this.canvas.renderAll();
							},
							everyMouseUpHandler = function everyMouseUpHandler(e) {
								checkPanel(e)
								this.canvas.renderAll();
						};
						temp.on('mouseup', oneMouseUpHandler);
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
			var pabelBg = new fabric.Rect({
				top: 0,
				left: 0,
				width: options.width,
				height: options.height,
				fill: 'rgb(245, 245, 245)',
				selectable: false
			});
			_objects.push( pabelBg );

			_objects.push( new fabric.Rect({
				top: 15,
				left: 15,
				fill: 'red',
				width: 25,
				height: 25
			}) );


			_objects.push( new fabric.Circle({
				radius: 13, fill: 'green', left: 45, top: 15
			}) );

			_objects.push( new fabric.Triangle({
				width: 25, height: 25, fill: 'blue', left: 75, top: 15
			}) );

			_objects.push( new mimic.ControlValve({
				top: 75,
				left: 20
			}) );

			_objects.push( new mimic.SolenoidValve({
				top: 75,
				left: 85
			}) );

			_objects.push( new mimic.LEDCircularPump({
				top: 130,
				left: 20
			}) );

			_objects.push( new mimic.PipeLineIn({
				top: 125,
				left: 80
			}) );

			_objects.push( new mimic.PipeLineOut({
				top: 150,
				left: 80
			}) );

			return _objects;
		},
		complexity: function() {
			return 1;
		}
	});

})(typeof exports !== 'undefined' ? exports : this);
