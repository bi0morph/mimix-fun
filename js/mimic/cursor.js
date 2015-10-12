/**
 * Created by rus on 11.10.2015.
 */
(function(global) {
	"use strict";

	var CursorState = fabric.util.createClass( {
		initialize: function () {},
		state: 'move'
	});
	fabric.util.object.extend(CursorState.prototype, fabric.Observable);

	global.mimic = global.mimic || {};
	global.mimic.cursor = new CursorState();
	global.mimic.cursor.on('cursor:change', function(type) {
		if(type) {
			console.log('cursor:change', type);
			this.state = type;
		}
	});

	var cursorConnection = {
		type: 'connection',
		exampleLine: null,
		start: null,
		end: null,
		createLine: function(coords) {
			return new fabric.Line(coords, {
				fill: 'red',
				stroke: 'red',
				strokeWidth: 1,
				selectable: false,
				strokeDashArray: [10, 10]
			})
		},
		'mouse:down': function (e) {
			console.log('mouse:down');
			console.log(e.target.left, e.target.top);
			if (e.target.line) {
				return false;
			}
			var newLine = this.createLine([ e.target.left + e.target.radius,
				e.target.top +  e.target.radius,
				e.target.left +  e.target.radius,
				e.target.top  +  e.target.radius]);
			this.exampleLine  = newLine;
			this.start = e.target;
			mimic.canvas.add(this.exampleLine);
		},
		'mouse:up': function (e) {
			console.log('mouse:up');
			var newLine = this.exampleLine;
			if (!newLine || e.target === this.start) {
				return false;
			}
			mimic.canvas.remove(this.exampleLine);
			this.exampleLine = null;
			this.end = e.target;

			newLine.set({
				'x2': e.target.left + e.target.radius,
				'y2':e.target.top +  e.target.radius,
				'strokeDashArray':null,
				'strokeWidth': 5,
				'stroke': 'green'
			});
			mimic.canvas.add(newLine);

			this.start.line = newLine;
			this.end.line = newLine;
		},
		'mouse:move': function (e) {
			if (!this.exampleLine) {
				return;
			}
			console.log('mouse:move');
			console.log(e.e.x, e.e.y);
			console.log(this.exampleLine);
			this.exampleLine.set({ 'x2': e.e.x, 'y2':e.e.y });
			mimic.canvas.renderAll();
		}
	};

	mimic.canvas.on('mouse:over', function(e) {
		console.log('mouse:over');
		if (mimic.cursor.state === 'connect' && e.target && e.target.type === 'circle' && e.target.hoverOn) {
			e.target.mouseOver();
			mimic.canvas.renderAll();
		};
	});

	mimic.canvas.on('mouse:out', function(e) {
		if (mimic.cursor.state === 'connect' && e.target && e.target.type === 'circle' && e.target.hoverOff) {
			e.target.mouseOut();
			mimic.canvas.renderAll();
		};
	});
	mimic.canvas.on('mouse:down', function(e) {
		if (mimic.cursor.state === 'connect' && e.target && e.target.type === 'circle') {
			cursorConnection['mouse:down'](e);
			mimic.canvas.renderAll();
		};
	});
	mimic.canvas.on('mouse:up', function(e) {
		if (mimic.cursor.state === 'connect' && e.target && e.target.type === 'circle') {
			cursorConnection['mouse:up'](e);
			mimic.canvas.renderAll();
		};
	});
	mimic.canvas.on('mouse:move', function(e) {
		if (mimic.cursor.state === 'connect') {
			cursorConnection['mouse:move'](e);
		};
	});
})(window);
