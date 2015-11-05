/**
 * Created by rus on 17.10.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	var _states = {
		stoped: 0,
		opens: 1,
		closed: 2,
		faulty: 3,
		notDetermined: 4
	};
	var _lineOptions = {
			fill: 'black',
			stroke: 'black',
			strokeWidth: 1
		};
	mimic.ControlValve = fabric.util.createClass(fabric.Group, {
		type: 'control-valve',
		state: 4,
		stateCode: 'notDetermined',
		_wrap: null,
		_mainCircle: null,
		_leftTriangle: null,
		_rightTriangle: null,
		_centerTriangle: null,
		_crossLines: null,
		_connectLine: null,
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
				radius: total.width/4,
				fill: 'grey',
				left: total.width/4 + this._padding ,
				top: 0,
				stroke: 'black'
			});
			return this._mainCircle;
		},
		_createLRTreangles: function(total) {
			this._leftTriangle = new fabric.Triangle({
				width: total.width/2,
				height: total.height/2,
				fill: 'white',
				left: total.width/4 + this._padding ,
				top: 3 * total.height/4,
				angle: 90,
				stroke: 'black',
				originX: 'center',
				originY: 'center'
			});
			this._rightTriangle = this._leftTriangle.clone().set({
				angle: 270,
				top: 3 * total.height/4,
				left: 3 * total.width/4 + 1 + this._padding
			});
			return {
				left: this._leftTriangle,
				right: this._rightTriangle
			};
		},
		_createConnections: function(params) {
			var top = params.height * 3/4 - this._padding,
				circleLeft = this._createConnection(),
				circleRight = this._createConnection();
			circleLeft.set({
				top: top,
				left: 0,
				selectable: false
			});
			circleRight.set({
				top: top,
				left: params.width,
				selectable: false,
				position: 'right'
			});
			this._connections = [ circleLeft, circleRight ];
			return this._connections;
		},
		_createCenterTriangle: function(total) {
			this._centerTriangle = new fabric.Triangle({
				width: total.width/3,
				height: total.height/3,
				visible: false,
				left: total.width/2 + this._padding,
				top: total.height/4 - 1,
				originX: 'center',
				originY: 'center'
			});
			this._centerTriangle.normalTop = null;
			this._centerTriangle.rotatedTop = null;
			return this._centerTriangle;
		},
		_createConnectLine: function(total) {
			var points = [total.width/2 + this._padding, total.height/2, total.width/2 + this._padding, 3 * total.height/4];
			this._connectLine = new fabric.Line(points, _lineOptions);
			return this._connectLine;
		},
		_createCrossLines: function(total) {
			var crossAllPoints = {
					leftTop : { x: total.width/4 - 3 + this._padding, y: 0 },
					rigthTop : { x: 3 * total.width/4 + 3 + this._padding, y: 0 },
					rigthBottom : { x: 3 * total.width/4 + 3 + this._padding, y: total.height/2},
					leftBottom : { x: total.width/4 - 3 + this._padding, y: total.height/2}
				},
				points;
			this._crossLines = [];

			points = [crossAllPoints.leftTop.x, crossAllPoints.leftTop.y, crossAllPoints.rigthBottom.x, crossAllPoints.rigthBottom.y];
			this._crossLines[0] = new fabric.Line(points, _lineOptions);

			points = [crossAllPoints.leftBottom.x, crossAllPoints.leftBottom.y, crossAllPoints.rigthTop.x, crossAllPoints.rigthTop.y];
			this._crossLines[1] = new fabric.Line(points, _lineOptions);

			return this._crossLines;
		},
		_createObjects: function(total) {
			var objects = [];
			objects.push( this._createWrap(total) );
			objects.push( this._createMainCircle(total) );

			var treangles = this._createLRTreangles(total);
			objects.push( treangles.left );
			objects.push( treangles.right );

			objects.push( this._createConnectLine(total) );

			var crossLines = this._createCrossLines(total);
			objects.push( crossLines[0] );
			objects.push( crossLines[1] );

			objects.push( this._createCenterTriangle(total) );

			Array.prototype.push.apply(objects, this._createConnections(total));

			return objects;
		},
		_createActions: function() {
			var actions = [];
			actions.push({
				title: 'Изменить состояние',
				values: [
					{
						title: 'Клапан остановлен',
						value: 'stoped'
					},
					{
						title: 'Клапан открывается',
						value: 'opens'
					},
					{
						title: 'Клапан закрывается',
						value: 'closed'
					},
					{
						title: 'Клапан неисправен',
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
				case 'stoped':
					this._mainCircle.setFill('rgb(0, 200, 0)');
					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});
					this._centerTriangle.set({
						visible: false
					});
					this.state = _states.stoped;
					break;
				case 'opens':
					this._mainCircle.setFill('white');
					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});

					this._centerTriangle.set({
						visible: true,
						angle: 0,
						fill: 'rgb(0,150,0)'
					});

					var changeColoropens = function(collor) {
						this._centerTriangle.setFill(collor);
						this._centerTriangle.canvas.renderAll();
					}.bind(this);
					var startBlinkopens = function(collor) {
						collor = collor === 'rgb(0,150,0)' ? 'rgb(0,225,0)' : 'rgb(0,150,0)';
						setTimeout(function() {
							if (checkState('opens')) {
								changeColoropens(collor);
								startBlinkopens(collor);
							}
						}, 750);
					}.bind(this)
					startBlinkopens('rgb(0,225,0)');

					this.state = _states.opens;
					break;
				case 'closed':
					this._mainCircle.setFill('white');
					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});

					this._centerTriangle.set({
						visible: true,
						angle: 180,
						fill: 'rgb(0,150,0)'
					});

					var changeColorTriangle = function(collor) {
						this._centerTriangle.setFill(collor);
						this._centerTriangle.canvas.renderAll();
					}.bind(this);
					var startBlinkClosed = function(collor) {
						collor = collor === 'rgb(0,150,0)' ? 'rgb(0,225,0)' : 'rgb(0,150,0)';
						setTimeout(function() {
							if (checkState('closed')) {
								changeColorTriangle(collor);
								startBlinkClosed(collor);
							}
						}, 750);
					}.bind(this);
					startBlinkClosed('rgb(0,225,0)');

					this.state = _states.closed;
					break;
				case 'faulty':
					this._mainCircle.setFill('red');
					var changeColor = function(collor) {
						this._mainCircle.setFill(collor);
						this._mainCircle.canvas.renderAll();
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
					startBlink('yellow');

					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});
					this._centerTriangle.set('visible', false);
					this.state = _states.faulty;
					break;
				default:
					this._mainCircle.setFill('grey');

					this._crossLines.forEach(function(line) {
						line.set('visible', true);
					});
					this._centerTriangle.set('visible', false);
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
			var newGroup = new mimic.ControlValve({
				left: this.left,
				top: this.top
			});
			return newGroup;
		}
	});
})(window);