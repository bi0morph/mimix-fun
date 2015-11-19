/**
 * Created by rus on 21.10.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	var _states = {
		on: 0,
		working: 1,
		faulty: 2,
		notDetermined: 3
	};
	var _lineOptions = {
		fill: 'black',
		stroke: 'black',
		strokeWidth: 1
	};
	mimic.LEDCircularPump = fabric.util.createClass(fabric.Group, {
		type: 'led-circular-pump',
		state: 3,
		padding: 10,
		stateCode: 'notDetermined',
		_wrap: null,
		_mainCircle: null,
		_mainTriangle: null,
		_crossLines: null,
		_createWrap: function(total) {
			this._wrap = new fabric.Rect({
				top: 0,
				left: 0,
				fill: 'transparent',
				width: total.width + this._padding * 2,
				height: total.height
			});
			return this._wrap;
		},
		_createMainCircle: function(total) {
			this._mainCircle = new fabric.Circle({
				radius: total.width/2,
				fill: 'transparent',
				left: this._padding,
				top: 0,
				stroke: 'black'
			});
			return this._mainCircle;
		},
		_createTreangle: function(total) {
			this._mainTriangle = new fabric.Triangle({
				width: total.width * 5/8,
				height: total.height * 5/8,
				fill: 'rgb(200, 200, 200)',
				left: total.width * 5/8 + this._padding,
				top: total.height/2,
				angle: 90,
				originX: 'center',
				originY: 'center'
			});

			return this._mainTriangle;
		},
		_createCrossLines: function(total) {
			var crossAllPoints = {
					leftTop : { x: 3 + this._padding, y: 0 },
					rigthTop : { x: total.width - 3 + this._padding, y: 0 },
					rigthBottom : { x: total.width - 3 + this._padding, y: total.height},
					leftBottom : { x: 3 + this._padding, y: total.height}
				},
				points;
			this._crossLines = [];

			points = [crossAllPoints.leftTop.x, crossAllPoints.leftTop.y, crossAllPoints.rigthBottom.x, crossAllPoints.rigthBottom.y];
			this._crossLines[0] = new fabric.Line(points, _lineOptions);

			points = [crossAllPoints.leftBottom.x, crossAllPoints.leftBottom.y, crossAllPoints.rigthTop.x, crossAllPoints.rigthTop.y];
			this._crossLines[1] = new fabric.Line(points, _lineOptions);

			this._crossLines[0].visible = false;
			this._crossLines[1].visible = false;
			return this._crossLines;
		},
		_createObjects: function(total) {
			var objects = [];
			objects.push( this._createWrap(total) );
			objects.push( this._createMainCircle(total) );

			objects.push( this._createTreangle(total) );

			var crossLines = this._createCrossLines(total);
			objects.push( crossLines[0] );
			objects.push( crossLines[1] );

			Array.prototype.push.apply(objects, this._createConnections(total));
			return objects;
		},
		_createConnections: function(params) {
			var top = params.height /2 - this._padding,
				circleLeft = this._createConnection(),
				circleRight = this._createConnection();
			circleLeft.set({
				top: top,
				left: 0,
				selectable: false,
				visible: false
			});
			circleRight.set({
				top: top,
				left: params.width,
				selectable: false,
				position: 'right',
				visible: false
			});
			this._connections = [ circleLeft, circleRight ];
			return this._connections;
		},
		_createActions: function() {
			var actions = [];
			actions.push({
				title: 'Изменить состояние',
				values: [
					{
						title: 'включен',
						value: 'on'
					},
					{
						title: 'включен и работает',
						value: 'working'
					},
					{
						title: 'не исправен',
						value: 'faulty'
					},
					{
						title: 'Состояние не определено',
						value: 'notDetermined'
					}
				],
				run: function(value) {
					this.setState(value)
				}.bind(this)
			});
			return actions;
		},
		actions: null,
		setState: function(key) {
			var checkState = function(stateCode) {
				return this.state === _states[stateCode];
			}.bind(this);

			switch(key) {
				case 'on':
					this._mainTriangle.setFill('rgb(0, 150, 0)');
					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});
					this.state = _states.on;
					break;
				case 'working':
					this._mainTriangle.setFill('rgb(0, 150, 0)');
					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});
					var changeColor = function(collor) {
						this._mainTriangle.setFill(collor);
						this._mainTriangle.canvas.renderAll();
					}.bind(this);
					var startBlink = function(collor) {
						collor = collor === 'rgb(0, 150, 0)' ? 'rgb(0, 200, 0)' : 'rgb(0, 150, 0)';
						setTimeout(function() {
							if (checkState('working')) {
								changeColor(collor);
								startBlink(collor);
							}
						}, 750);
					}.bind(this);
					startBlink('rgb(0, 150, 0)');

					this.state = _states.working;
					break;
				case 'faulty':
					this._mainTriangle.setFill('red');
					var changeColor = function(collor) {
						this._mainTriangle.setFill(collor);
						this._mainTriangle.canvas.renderAll();
					}.bind(this);
					var startBlink = function(collor) {
						collor = collor === 'red' ? 'yellow' : 'red';
						setTimeout(function() {
							if (checkState('faulty')) {
								changeColor(collor);
								startBlink(collor);
							}
						}, 750);
					}.bind(this)
					startBlink('red');

					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});
					this.state = _states.faulty;
					break;
				default:
					this._mainTriangle.setFill('rgb(200, 200, 200)');
					this._crossLines.forEach(function(line) {
						line.set('visible', true);
					});
					this.state = _states.notDetermined;
			}
			if (this._mainCircle.canvas) {
				this._mainCircle.canvas.renderAll();
			}
		},
		initialize: function (options) {
			var objects;
			options = options || {};
			var total = {
				width: 40,
				height: 40
			};
			objects = this._createObjects(total);

			this.actions = this._createActions();
			this.callSuper('initialize', objects, options);
			this._initEvents();
		},
		clone: function () {
			var newGroup = new mimic.LEDCircularPump({
				left: this.left,
				top: this.top
			});
			return newGroup;
		}
	});
})(window);