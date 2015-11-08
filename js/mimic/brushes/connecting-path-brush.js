/**
 * Created by rus on 28.10.2015.
 */

(function() {

	mimic.ConnectingPathBrush = fabric.util.createClass(mimic.ConnectingLineBrush, {
		type: 'connecting-path-brush',
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
				p2 = this._end,
				pNear1 = {
					x: p1.x,
					y: p1.y,
				},
				firstGroupBox = {
					width: this._connectors.first.group.width,
					height: this._connectors.first.group.height,
					top: this._connectors.first.group.top,
					left: this._connectors.first.group.left
				};

			pNear1.x = pNear1.x + (this._connectors.first.position === 'left' ? -2 : 2) * this._connectors.first.radius;

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

			var additionalPoints = [],
				firstBox = {
					top: this._connectors.first.group.top - this._connectors.first.radius,
					left: this._connectors.first.group.left - this._connectors.first.radius,
					bottom: this._connectors.first.group.top + this._connectors.first.group.height + this._connectors.first.radius,
					right: this._connectors.first.group.top + this._connectors.first.group.width + this._connectors.first.radius
				},
				middleX, tmpPoint;
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(pNear1.x, pNear1.y);
			if (pNear1.y !== p2.y || pNear1.x !== p2.x) {
				middleX = pNear1.x + (p2.x - pNear1.x) / 2;

				if (this._connectors.first.position === 'left' && middleX > pNear1.x ||
					this._connectors.first.position === 'right' && middleX < pNear1.x
				) {
					middleX = pNear1.x;
				}
				additionalPoints.push({
					x: middleX,
					y: pNear1.y
				});
				tmpPoint = {
					x: middleX,
					y: p2.y
				};

				if (firstBox.top <= p2.y && firstBox.bottom >= p2.y && (this._connectors.first.position === 'left' && p2.x > firstBox.right ||
					this._connectors.first.position === 'right'  && p2.x < firstBox.left)) {
					if (p2.y < pNear1.y) {
						tmpPoint.y = firstBox.top;
					} else {
						tmpPoint.y = firstBox.bottom;
					}
					additionalPoints.push({
						x: middleX,
						y: tmpPoint.y
					});
					additionalPoints.push({
						x: p2.x,
						y: tmpPoint.y
					});
				} else {
					additionalPoints.push({
						x: middleX,
						y: p2.y
					});
				}
			}
			additionalPoints.push({
				x: p2.x,
				y: p2.y
			});

			additionalPoints.forEach(function(point) {
				ctx.lineTo(point.x, point.y);
			});

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
			var line = new mimic.ConnectionMultiLine([this._connectors.first, this._connectors.second], [start.x, start.y, end.x, end.y], {
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
