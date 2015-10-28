/**
 * Created by rus on 28.10.2015.
 */

(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric;

	mimic.ConnectionMultiLine = fabric.util.createClass(fabric.Line, {
		type: 'connection-multi-line',
		connectors: [],
		initialize: function (connectors, points, options) {
			options = options || {};
			this.connectors = connectors || [];
			this.callSuper('initialize', points, options);
		},
		_render: function(ctx, noTransform) {
			ctx.beginPath();

			if (noTransform) {
				//  Line coords are distances from left-top of canvas to origin of line.
				//  To render line in a path-group, we need to translate them to
				//  distances from center of path-group to center of line.
				var cp = this.getCenterPoint();
				ctx.translate(
					cp.x - this.strokeWidth / 2,
					cp.y - this.strokeWidth / 2
				);
			}

			if (!this.strokeDashArray || this.strokeDashArray && supportsLineDash) {
				// move from center (of virtual box) to its left/top corner
				// we can't assume x1, y1 is top left and x2, y2 is bottom right
				var p = this.calcLinePoints();
				ctx.moveTo(p.x1, p.y1);
				ctx.lineTo(p.x2, p.y2);
			}

			ctx.lineWidth = this.strokeWidth;

			var origStrokeStyle = ctx.strokeStyle;
			ctx.strokeStyle = this.stroke || ctx.fillStyle;
			this.stroke && this._renderStroke(ctx);
			ctx.strokeStyle = origStrokeStyle;
		},
	});
})(typeof exports !== 'undefined' ? exports : this);