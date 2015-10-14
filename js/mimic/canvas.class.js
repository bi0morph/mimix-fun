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

			function __chancelDrawingMode() {
				this._currentTransform = false;
				this.isDrawingMode = false;
				this._isCurrentlyDrawing = true;
			}
			this.on('connection_line:created', __chancelDrawingMode);
			this.on('connection_line:chanceled', __chancelDrawingMode);
		},
		setDrawingMode: function(brush, e) {
			this.deactivateAll().renderAll();
			if (brush) {
				this.isDrawingMode = true;
				this.freeDrawingBrush = brush;
				this._isCurrentlyDrawing = true;
				this.freeDrawingBrush.onMouseDown(e);
			} else {
				this.isDrawingMode = false;
				this._isCurrentlyDrawing = false;
				this._currentTransform = false;
			}
		}
	});

	mimic.Element = mimic.Canvas;
})(typeof exports !== 'undefined' ? exports : this);
