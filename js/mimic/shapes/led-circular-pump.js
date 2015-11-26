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
		notDetermined: 3,
		forPanel: 3,
	};
	var _lineOptions = {
		fill: 'black',
		stroke: 'black',
		strokeWidth: 1
	};
	// Насос
	mimic.LEDCircularPump = fabric.util.createClass(fabric.Group, {
		type: 'led-circular-pump',
		state: 3,
		padding: 10,
		name: 'Насос',
		getName: function() {
			var name = this.name;
			if (this.text) {
				name += ' ' + this.text;
			}
			return  name;
		},
		source: null,
		emergency: {
			//  источник данных источником аварии для элемента мнемосхемы «Насос»
			// может быть отдельный канал или тот же канал, который отвечает за текущее состояние
			source: null,
			state: false // да, нет, красный треугольник и красная рамка/
		},
		status: {
			source: null,// / источник данных не задан, тогда без динамики
			state: false // включен, выключен // зеленый/светлозеленый
		},
		speed: 56, // 0-100%
		task: 75, // 0-100%
		mode: 'Ручной', // режим работы
		text: 'P1', // текст
		remoteСontrol: true, // удаленное управление
		stateCode: 'notDetermined',

		_setEmergency: function(state, source) {
			this.emergency.state = !!state;
			this.emergency.source = source;
			this.fire('changed:emergency', this.emergency);
		},
		_setStatus: function(state, source) {
			this.status.state = !!state;
			this.status.source = source;
			this.fire('changed:status', this.status);
		},
		_setTask: function(task) {
			this.task = task;
			this.fire('changed:task', task);
		},
		_setMode: function(mode) {
			this.mode = mode;
			this.fire('changed:mode', mode);
		},
		_setSpeed: function(speed) {
			this.speed = speed;
			this.fire('changed:speed', speed);
		},

		_wrap: null,
		_mainCircle: null,
		_mainTriangle: null,
		_text: null,
		_textSpeed: null,
		_createWrap: function(total) {
			this._wrap = new fabric.Rect({
				top: total.height * 3/4,
				left: 0,
				fill: 'transparent',
				width: total.width + this._padding * 2,
				height: total.height,
				stroke: 'red'
			});
			this._wrap.visible = false;
			return this._wrap;
		},
		_createMainCircle: function(total) {
			this._mainCircle = new fabric.Circle({
				radius: total.width/2,
				fill: 'transparent',
				left: this._padding,
				top: total.height * 3/4,
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
				top: total.height/2 + total.height * 3/4,
				angle: 90,
				originX: 'center',
				originY: 'center'
			});

			return this._mainTriangle;
		},
		_createText: function(total) {
			this._text = new fabric.Text( this.text, {
				left: 0,
				top: 0,
				fontFamily: 'Arial',
				fontSize: 20
			});
			this._text.visible = false;
			this._text.selectable = false;
			return this._text;
		},
		_createTextSpeed: function(total) {
			this._textSpeed = new mimic.TextBox(this.speed + '%', {
				left: 0,
				top: 0,
				height: 18
			});
			this._textSpeed.visible = false;
			this._textSpeed.selectable = false;
			return this._textSpeed;
		},
		_createTextMode: function(total) {
			this._textMode = new mimic.TextBox( this.mode, {
				left: 0,
				top: 0,
				height: 18
			});
			this._textMode.visible = false;
			this._textMode.selectable = false;
			return this._textMode;
		},
		_createConnections: function(params) {
			var top = params.height /2 - this._padding + params.height * 3/4,
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
		_createObjects: function(total) {
			var objects = [];
			objects.push( this._createWrap(total) );
			objects.push( this._createMainCircle(total) );
			objects.push( this._createTreangle(total) );
			this._createText(total);
			this._createTextSpeed(total);
			this._createTextMode(total);

			Array.prototype.push.apply(objects, this._createConnections(total));
			return objects;
		},
		_createActions: function() {
			var actions = [];
			actions.push({
				title: 'Статус',
				isSelected: function(value) {
					return value === this.status.state;
				}.bind(this),
				values: [
					{
						title: 'Включен',
						value: true
					},
					{
						title: 'Выключен',
						value: false
					}
				],
				run: function(value) {
					this._setStatus(value, this.source);
				}.bind(this)
			});
			actions.push({
				title: 'Авария',
				isSelected: function(value) {
					return value === this.emergency.state;
				}.bind(this),
				values: [
					{
						title: 'Есть авария',
						value: true
					},
					{
						title: 'Нет аварии',
						value: false
					}
				],
				run: function(value) {
					this._setEmergency(value, this.source);
				}.bind(this)
			});
			actions.push({
				title: 'Скорость',
				value: this.speed,
				run: function(value) {
					this._setSpeed(value);
				}.bind(this)
			});
			actions.push({
				title: 'Режим',
				value: this.mode,
				run: function(value) {
					this._setMode(value);
				}.bind(this)
			});
			return actions;
		},
		_actions: null,
		_changeTextPosition: function() {
			this._text.set({
				top: this.top - this._text.height,
				left: this.left + this.width/2 - this._text.width/2
			});

			this._textSpeed.set({
				top: this.top - this._textSpeed.height - 6,
				left: this._text.left + this._text.width + 10
			});
			this._textMode.set({
				top: this.top - this._textSpeed.height - 6,
				left: this._textSpeed.left + this._textSpeed.width + 10
			});
		},
		showHeader: function() {
			this._changeTextPosition();
			this._textSpeed.visible = true;
			this._text.visible = true;
			this._textMode.visible = true;
		},
		checkState: function() {
			var state = 'off';
			if (this.emergency.state) {
				state = 'faulty';
			} else if(this.status.state) {
				if (this.source) {
					state = 'working';
				} else {
					state = 'on';
				}
			} else {
				state = 'off';
			}

			this.setState(state);
		},
		setState: function(key) {
			var checkState = function(stateCode) {
				return this.state === _states[stateCode];
			}.bind(this);
			if (key === this.stateCode) {
				return;
			}
			switch(key) {
				case 'on':
					this._mainTriangle.setFill('rgb(0, 150, 0)');
					this.state = _states.on;
					this._wrap.visible = false;

					break;
				case 'working':
					this._mainTriangle.setFill('rgb(0, 150, 0)');
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

					this._wrap.visible = false;
					this.state = _states.working;
					break;
				case 'faulty':
					this._mainTriangle.setFill('red');
					this._wrap.set({ stroke: 'red' });

					var toggleWrap = function() {
						this._wrap.visible = !this._wrap.visible;
						this._mainTriangle.canvas.renderAll();
					}.bind(this);

					var startBlink = function() {
						setTimeout(function() {
							if (checkState('faulty')) {
								toggleWrap();
								startBlink();
							}
						}, 750);
					}.bind(this)
					startBlink();

					this.state = _states.faulty;
					break;
				default:
					this._mainTriangle.setFill('rgb(200, 200, 200)');
					this.state = _states.notDetermined;
					this._wrap.visible = false;
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
				height: 40,
			};
			objects = this._createObjects(total);

			this._actions = this._createActions();
			this.callSuper('initialize', objects, options);
			this._initEvents();
		},
		_initEvents: function() {
			this.callSuper('_initEvents');

			this.on('changed:status', function() {
				console.log('changed:status');
				this.checkState();
			});
			this.on('changed:emergency', function() {
				console.log('changed:emergency');
				this.checkState();
			});
			this.on('changed:mode', function(mode) {
				console.log('changed:mode');
				this._textMode.changeText(mode);
				this._changeTextPosition();
				this.canvas.renderAll();
			}.bind(this));
			this.on('changed:speed', function(speed) {
				console.log('changed:speed');
				this._textSpeed.changeText(speed +'%');
				this._changeTextPosition();
				this.canvas.renderAll();
			}.bind(this));
			this.on('moving', function() {
				this._changeTextPosition();
			});
			this.on('scaling', function() {
				this._changeTextPosition();
			});
			this.on('removed', function() {
				this.canvas.remove(this._text);
				this.canvas.remove(this._textSpeed);
				this.canvas.remove(this._textMode);
			});
			this.on('added', function() {
				console.log('added', this.canvas);
				this.canvas.add(this._text);
				this.canvas.add(this._textSpeed);
				this.canvas.add(this._textMode);
			});
		},
		getActions: function() {
				return this.remoteСontrol ? this._actions : false;
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