/**
 * Created by rus on 14.10.2015.
 */

(function(global) {
	var mimic  = global.mimic || (global.mimic = {}),
		fabric  = global.fabric;
	mimic.Canvas = fabric.util.createClass(fabric.Canvas, {

		initialize: function (el, options) {
			options || (options = {});

			this.callSuper('initialize', el, options);

			fabric.Canvas.activeInstance = this;
		}
	});

	mimic.Element = mimic.Canvas;
})(typeof exports !== 'undefined' ? exports : this);
