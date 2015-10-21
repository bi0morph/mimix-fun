/**
 * Created by rus on 21.10.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	var _states = {
		opens: 0,
		closed: 1,
		faulty: 2,
		notDetermined: 3
	};
	var _lineOptions = {
			fill: 'black',
			stroke: 'black',
			strokeWidth: 1
		};
	mimic.SolenoidValve = fabric.util.createClass(fabric.Group, {
		type: 'solenoid-valve',
		state: 3,
		stateCode: 'notDetermined',
		_wrap: null,
		_mainSquare: null,
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
				width: total.width,
				height: total.height
			});
			return this._wrap;
		},
		_createMainSquare: function(total) {
			this._mainSquare = new fabric.Rect({
				width: total.width/2,
				height: total.height/2,
				fill: 'grey',
				left: total.width/4,
				top: 0,
				stroke: 'black'
			});
			return this._mainSquare;
		},
		_createLRTreangles: function(total) {
			this._leftTriangle = new fabric.Triangle({
				width: total.width/2,
				height: total.height/2,
				fill: 'white',
				left: total.width/4,
				top: 3 * total.height/4,
				angle: 90,
				stroke: 'black',
				originX: 'center',
				originY: 'center'
			});
			this._rightTriangle = this._leftTriangle.clone().set({
				angle: 270,
				top: 3 * total.height/4,
				left: 3 * total.width/4 + 1
			});
			return {
				left: this._leftTriangle,
				right: this._rightTriangle
			};
		},
		_createCenterTriangle: function(total) {
			this._centerTriangle = new fabric.Triangle({
				width: total.width/3,
				height: total.height/3,
				visible: false,
				left: total.width/2,
				top: total.height/4 - 1,
				originX: 'center',
				originY: 'center'
			});
			this._centerTriangle.normalTop = null;
			this._centerTriangle.rotatedTop = null;
			return this._centerTriangle;
		},
		_createConnectLine: function(total) {
			var points = [total.width/2, total.height/2, total.width/2, 3 * total.height/4];
			this._connectLine = new fabric.Line(points, _lineOptions);
			return this._connectLine;
		},
		_createCrossLines: function(total) {
			var crossAllPoints = {
					leftTop : { x: total.width/4 - 3, y: 0 },
					rigthTop : { x: 3 * total.width/4 + 3, y: 0 },
					rigthBottom : { x: 3 * total.width/4 + 3, y: total.height/2},
					leftBottom : { x: total.width/4 - 3, y: total.height/2}
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
			objects.push( this._createMainSquare(total) );

			var treangles = this._createLRTreangles(total);
			objects.push( treangles.left );
			objects.push( treangles.right );

			objects.push( this._createConnectLine(total) );

			var crossLines = this._createCrossLines(total);
			objects.push( crossLines[0] );
			objects.push( crossLines[1] );

			objects.push( this._createCenterTriangle(total) );
			return objects;
		},
		_createActions: function() {
			var actions = [];
			actions.push({
				title: 'Изменить состояние',
				values: [
					{
						title: 'Клапан открыт',
						value: 'opens'
					},
					{
						title: 'Клапан закрыт',
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
		_timeoutId: null,
		actions: null,
		setState: function(key) {
			var checkState = function(stateCode) {
				return this.state === _states[stateCode];
			}.bind(this);

			console.log('setState' + key);
			switch(key) {
				case 'opens':
					this._mainSquare.setFill('white');
					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});

					this._centerTriangle.set({
						visible: true,
						angle: 0,
						fill: 'rgb(0,200,0)'
					});

					this.state = _states.opens;
					break;
				case 'closed':
					this._mainSquare.setFill('white');
					this._crossLines.forEach(function(line) {
						line.set('visible', false);
					});

					this._centerTriangle.set({
						visible: true,
						angle: 180,
						fill: 'rgb(0,200,0)'
					});

					this.state = _states.closed;
					break;
				case 'faulty':
					this._mainSquare.setFill('red');
					var changeColor = function(collor) {
						this._mainSquare.setFill(collor);
						this._mainSquare.canvas.renderAll();
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
					this._mainSquare.setFill('grey');

					this._crossLines.forEach(function(line) {
						line.set('visible', true);
					});
					this._centerTriangle.set('visible', false);
					this.state = _states.notDetermined;
			}
			if (this._mainSquare.canvas) {
				this._mainSquare.canvas.renderAll();
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
		},
		clone: function () {
			var newGroup = new mimic.SolenoidValve({
				left: this.left,
				top: this.top
			});
			return newGroup;
		}
	});
})(window);