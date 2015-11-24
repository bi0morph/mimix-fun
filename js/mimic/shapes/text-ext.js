/**
 * Created by rus on 22.11.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend,
		clone = fabric.util.object.clone,
		degreesToRadians = fabric.util.degreesToRadians;

	mimic.TextBox = fabric.util.createClass(fabric.Group, {
		_createObjects: function(text, options) {

			this._text = new fabric.Text( text, {
				left: 0,
				top: 0,
				fontFamily: 'Arial',
				fontSize: options.height,
			});

			this._wrap = new fabric.Rect({
				top: -3,
				left: -3,
				fill: 'transparent',
				width: this._text.width + 6,
				height: this._text.height + 3,
				stroke: 'black'
			});

			this._text.on('modified', this._textModified);
			return [this._text, this._wrap];
		},
		_textModified: function() {
			this._wrap.set({
				width: this._text.width + 6,
				height: this._text.height
			});
		},
		_bindMethods: function() {
			this._textModified.bind(this);
		},
		initialize: function (text, options) {
			this._bindMethods();

			var objects = [];
			objects = this._createObjects(text, options);
			this.callSuper('initialize', objects, options);
		}
	});

	mimic.TextBox.fromObject = function(object) {
		return new mimic.TextBox(object._objects, clone(object));
	};
	mimic.TextBox.clone = function () {
		return this.fromObject(this);
	};
})(window);