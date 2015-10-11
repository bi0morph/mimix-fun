/**
 * Created by rus on 11.10.2015.
 */
(function() {

	var _connection = {
		cirscle: {
			radius: 6
		},
		line: {
			width: 20
		}
	};
	//var stateProperties = fabric.Object.prototype.stateProperties.concat();

	fabric.RectConnect = fabric.util.createClass(fabric.Object, {
		conenctions: {
			left: null,
			right: null
		},
		type: 'rect-connect',
		initialize: function(src, options) {
			options = options || { };
			this.callSuper('initialize', options);
		},
		_render: function(ctx) {
			// set up rectangle size
			var rectangleLeftX = this.left + _connection.cirscle.radius*2 + _connection.line.width,
				rectangleLeftY = this.top,
				rectangleW = this.width - (_connection.cirscle.radius*2 + _connection.line.width)*2,
				rectangleH = this.height;

			ctx.beginPath();
			ctx.moveTo(rectangleLeftX, rectangleLeftY);
			ctx.lineTo(rectangleLeftX + rectangleW, rectangleLeftY);
			ctx.lineTo(rectangleLeftX + rectangleW, rectangleLeftY + rectangleH);
			ctx.lineTo(rectangleLeftX, rectangleLeftY + rectangleH);
			ctx.closePath();
			this._renderStroke(ctx);
		}

	});

})();