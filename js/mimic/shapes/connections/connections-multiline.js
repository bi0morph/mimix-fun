/**
 * Created by rus on 28.10.2015.
 */

(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric;

	mimic.ConnectionMultiLine = fabric.util.createClass(fabric.Line, {
		type: 'connection-multi-line',
		_lineType: 'cabel',
		connectors: [],
		getOtherConnector: function(currnetConnector) {
			if (this.connectors[0].connectedTo === currnetConnector) {
				return this.connectors[0];
			} else {
				return this.connectors[1];
			}
		},
		_removeLine: function() {
			this.connectors[0].connectedTo = null;
			this.connectors[1].connectedTo = null;
			this.remove();
		},
		_initDpendencies: function() {
			var removeLine = this._removeLine.bind(this);
			this.connectors.forEach(function(connector) {
				var group = connector.group || connector._group;
				group.on('removed', removeLine);
			});
		},
		initialize: function (connectors, points, options) {
			options = options || {};
			this.connectors = connectors || [];
			this._points = [];

			this._changeType(options.type);

			this.callSuper('initialize', points, options);
			this._initDpendencies();
			this.remoteControl = true;
			this._actions = this._createActions();
		},
		getActions: function() {
			return this.remoteControl ? this._actions : false;
		},
		_changeType: function(type) {
			switch (type) {
				case 'hot-pipe':
					this.set({strokeWidth: 6, stroke: 'red'});
					break;
				case 'cold-pipe':
					this.set({strokeWidth: 6, stroke: 'blue'});
					break;
				default:
					this.set({strokeWidth: 4, stroke: 'black'});
			}
		},
		setLineType: function(type) {
			this._lineType = type;
			this._changeType(type);
			if (this.canvas) {
				this.canvas.renderAll();
			}
		},
		_createActions: function() {
			var actions = [];
			actions.push({
				title: 'Тип',
				isSelected: function(value) {
					return value === this._lineType;
				}.bind(this),
				values: [
					{
						title: 'Труба горячей воды',
						value: 'hot-pipe'
					},
					{
						title: 'Труба холодной воды',
						value: 'cold-pipe'
					},
					{
						title: 'Кабель',
						value: 'cabel'
					}
				],
				run: function(value) {
					this.setLineType(value)
				}.bind(this)
			});

			actions.push({
				title: 'Удалить',
				button: {
					title: 'Удалить',
					value: 'delete'
				},
				run: function() {
					this._removeLine()
				}.bind(this)
			});
			return actions;
		},
		actions: null,
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
				var p = this.calcLinePoints(),
					pNear = {
						x1: p.x1,
						y1: p.y1,
						x2: p.x2,
						y2: p.y2
					},
					first = this.connectors[0],
					second = this.connectors[1],
					firstGroupBox = first._group.getBoundingRect(),
					secondGroupBox = second._group.getBoundingRect(),
					currentPoint, nextPoint, middleX, middleY;

				this._points = [];
				// start point in connector
				currentPoint = new fabric.Point(p.x1, p.y1);

				this._points.push(currentPoint);

				// point out of bounding box
				pNear.x1 = pNear.x1 + (first.position === 'left' ? -2 : 2) * first.radius;
				pNear.x2 = pNear.x2 + (second.position === 'left' ? -2 : 2) * second.radius;
				currentPoint = new fabric.Point(pNear.x1, pNear.y1);
				nextPoint = new fabric.Point(pNear.x2, pNear.y2);

				this._points.push(currentPoint);

				if ((first.position === 'left' && second.position === 'right' &&
					currentPoint.x < nextPoint.x) && (first.position === 'right' && second.position === 'left' &&
				currentPoint.x > nextPoint.x)) {
					// middle by y
					middleY = currentPoint.y + (nextPoint.y - currentPoint.y)/2;

					currentPoint = new fabric.Point(currentPoint.x, middleY);
					this._points.push(currentPoint);

					currentPoint = new fabric.Point(nextPoint.x, middleY);
					this._points.push(currentPoint);

				} else if (first.position === second.position &&
					currentPoint.x != nextPoint.x) {
					if (first.position === 'left' ) {
						if (nextPoint.x > currentPoint.x) {
							currentPoint = new fabric.Point(currentPoint.x, nextPoint.y)
						} else {
							currentPoint = new fabric.Point(nextPoint.x, currentPoint.y)
						}
					} else {
						if (nextPoint.x < currentPoint.x) {
							currentPoint = new fabric.Point(currentPoint.x, nextPoint.y)
						} else {
							currentPoint = new fabric.Point(nextPoint.x, currentPoint.y)
						}
					}
					this._points.push(currentPoint);
				} else {
					if (pNear.x1 !== pNear.x2) {
						middleX = pNear.x1 + (pNear.x2 - pNear.x1)/2;

						currentPoint = new fabric.Point(middleX, currentPoint.y);
						this._points.push(currentPoint);

						currentPoint = new fabric.Point(middleX, nextPoint.y);
						this._points.push(currentPoint);
					}
				}

				currentPoint = nextPoint;
				this._points.push(currentPoint);

				currentPoint = new fabric.Point(p.x2, p.y2);
				this._points.push(currentPoint);

				this._points.forEach(function(point, index) {
					switch (index) {
						case 0:
							ctx.moveTo(point.x, point.y);
							break;
						default:
							ctx.lineTo(point.x, point.y);
					}
				});
			}

			ctx.lineWidth = this.strokeWidth;

			var origStrokeStyle = ctx.strokeStyle;
			ctx.strokeStyle = this.stroke || ctx.fillStyle;
			this.stroke && this._renderStroke(ctx);
			ctx.strokeStyle = origStrokeStyle;
		}
	});
})(typeof exports !== 'undefined' ? exports : this);