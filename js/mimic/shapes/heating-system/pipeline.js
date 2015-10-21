/**
 * Created by rus on 21.10.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	mimic.PipeLine = fabric.util.createClass(fabric.Group, {
		type: 'pipe-line',
		_line: null,
		_triangle: null,
		_createLine: function(total) {
			this._line = new fabric.Line([0, total.height/2 - 2, total.width, total.height/2  - 2], {
				fill: total.color,
				stroke: total.color,
				strokeWidth: 4
			});
			return this._line;
		},
		_createTreangle: function(total) {
			this._triangle = new fabric.Triangle({
				width: total.width/2,
				height: total.height/2,
				fill: total.color,
				left: total.width/2,
				top: total.height/2,
				angle: 90,
				originX: 'center',
				originY: 'center'
			});

			return this._triangle;
		},
		_createObjects: function(total) {
			var objects = [];
			objects.push( this._createTreangle(total) );
			objects.push( this._createLine(total) );

			return objects;
		},
		initialize: function (color, options) {
			var objects;
			options = options || {};
			var total = {
				width: 40,
				height: 40,
				color: color || 'black'
			};

			this.collor = total.color;
			objects = this._createObjects(total);

			this.callSuper('initialize', objects, options);
		},
		clone: function () {
			var newGroup = new mimic.PipeLine(this.collor, {
				left: this.left,
				top: this.top
			});
			return newGroup;
		}
	});
})(window);