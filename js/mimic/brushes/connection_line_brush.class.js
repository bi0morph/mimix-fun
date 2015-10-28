/**
 * Created by rus on 14.10.2015.
 */
(function() {

	mimic.ConnectingLineBrush = fabric.util.createClass(fabric.BaseBrush, {
		type: 'connecting-line-brush',
		initialize: function(canvas, first) {
			this.canvas = canvas;
			this._points = [ ];
			this._connectors = {
				first: first,
				second: null
			};
			this._start = first.getCenter();
			this._end = null;
		},

		/**
		 * Inovoked on mouse down
		 * @param {Object} pointer
		 */
		onMouseDown: function() {

			this._prepareForDrawing(this._start);
			// capture coordinates immediately
			// this allows to draw dots (when movement never occurs)
			this._captureDrawingPath(this._start);
			this._render();
		},

		/**
		 * Inovoked on mouse move
		 * @param {Object} pointer
		 */
		onMouseMove: function(pointer) {
			this._captureDrawingPath(pointer);
			// redraw curve
			// clear top canvas
			this.canvas.clearContext(this.canvas.contextTop);
			this._render();
		},

		/**
		 * Invoked on mouse up
		 */
		onMouseUp: function(target) {
			if (target && target.type === 'connector' &&
				this._connectors.first !== target &&
					!target.connectedTo
			) {
				this._connectors.second = target;
				this._end = target.getCenter();
				this._finalizeAndAddPath();
			} else {
				this._reset();
				this.canvas.clearContext(this.canvas.contextTop);
				this.canvas.trigger('connection_line:chanceled');
			}
		},

		/**
		 * @private
		 * @param {Object} pointer Actual mouse position related to the canvas.
		 */
		_prepareForDrawing: function(pointer) {

			var p = new fabric.Point(pointer.x, pointer.y);

			this._reset();
			this._addPoint(p);
			this._start = p;

			this.canvas.contextTop.moveTo(p.x, p.y);
		},

		/**
		 * @private
		 * @param {fabric.Point} point Point to be added to points array
		 */
		_addPoint: function(point) {
			this._points.push(point);
		},

		/**
		 * Clear points array and set contextTop canvas style.
		 * @private
		 */
		_reset: function() {
			this._points.length = 0;
			this._setBrushStyles();
			this._setShadow();
		},

		/**
		 * @private
		 * @param {Object} pointer Actual mouse position related to the canvas.
		 */
		_captureDrawingPath: function(pointer) {
			var pointerPoint = new fabric.Point(pointer.x, pointer.y);
			this._addPoint(pointerPoint);
			this._end = pointerPoint;
		},

		/**
		 * Draw a smooth path on the topCanvas using quadraticCurveTo
		 * @private
		 */
		_render: function() {
			var ctx  = this.canvas.contextTop,
				v = this.canvas.viewportTransform,
				p1 = this._start,
				p2 = this._end;

			ctx.save();
			ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
			ctx.beginPath();

			//if we only have 2 points in the path and they are the same
			//it means that the user only clicked the canvas without moving the mouse
			//then we should be drawing a dot. A path isn't drawn between two identical dots
			//that's why we set them apart a bit
			if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
				p1.x -= 0.5;
				p2.x += 0.5;
			}
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);

			ctx.stroke();
			ctx.restore();
		},

		/**
		 * Converts points to SVG path
		 * @param {Array} points Array of points
		 * @param {Number} minX
		 * @param {Number} minY
		 * @return {String} SVG path
		 */
		convertPointsToSVGPath: function(points) {
			var path = [],
				p1 = new fabric.Point(points[0].x, points[0].y),
				p2 = new fabric.Point(points[1].x, points[1].y);

			path.push('M ', points[0].x, ' ', points[0].y, ' ');
			for (var i = 1, len = points.length; i < len; i++) {
				var midPoint = p1.midPointFrom(p2);
				// p1 is our bezier control point
				// midpoint is our endpoint
				// start point is p(i-1) value.
				path.push('Q ', p1.x, ' ', p1.y, ' ', midPoint.x, ' ', midPoint.y, ' ');
				p1 = new fabric.Point(points[i].x, points[i].y);
				if ((i + 1) < points.length) {
					p2 = new fabric.Point(points[i + 1].x, points[i + 1].y);
				}
			}
			path.push('L ', p1.x, ' ', p1.y, ' ');
			return path;
		},

		createLine: function(start, end) {
			var line = new mimic.Connection([this._connectors.first, this._connectors.second], [start.x, start.y, end.x, end.y], {
				fill: null,
				stroke: this.color,
				strokeWidth: this.width,
				strokeLineCap: this.strokeLineCap,
				strokeLineJoin: this.strokeLineJoin,
				strokeDashArray: this.strokeDashArray,
				originX: 'center',
				originY: 'center',
				selectable: false
			});

			if (this.shadow) {
				this.shadow.affectStroke = true;
				line.setShadow(this.shadow);
			}

			return line;
		},

		/**
		 * On mouseup after drawing the path on contextTop canvas
		 * we use the points captured to create an new fabric path object
		 * and add it to the fabric canvas.
		 */
		_finalizeAndAddPath: function() {
			var ctx = this.canvas.contextTop;
			ctx.closePath();

			var pathData = this.convertPointsToSVGPath(this._points).join('');
			if (pathData === 'M 0 0 Q 0 0 0 0 L 0 0') {
				// do not create 0 width/height paths, as they are
				// rendered inconsistently across browsers
				// Firefox 4, for example, renders a dot,
				// whereas Chrome 10 renders nothing
				this.canvas.renderAll();
				return;
			}

			var line = this.createLine(this._start, this._end);
			this._connectors.first.connectedTo = {
				line: line,
				point: this._end,
				position: 1
			};
			this._connectors.second.connectedTo = {
				line: line,
				point: this._start,
				position: 2
			};

			this.canvas.add(line);
			line.setCoords();

			this.canvas.clearContext(this.canvas.contextTop);
			this._resetShadow();
			this.canvas.renderAll();

			// fire event 'line' created
			this.canvas.fire('connection_line:created', {
				connection: line,
				connectors: [
					this._connectors.first,
					this._connectors.second
					]
			});

		}
	});
})();
