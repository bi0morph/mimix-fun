/**
 * Created by rus on 14.10.2015.
 */
(function(global) {

	var fabric = global.fabric,
		mimic = global.mimic,
		addListener = fabric.util.addListener,
		removeListener = fabric.util.removeListener;

	var __containtsPoint = function(obj, point) {
		return obj.originalLeft < point.x && point.x < (obj.originalLeft + obj.width) &&
			obj.originalTop < point.y && point.y < (obj.originalTop + obj.height);
	};

	fabric.util.object.extend(mimic.Canvas.prototype, {

		/**
		/**
		 * @private
		 * @param {Event} e Event object fired on mousedown
		 */
		_onMouseDown: function (e) {
			this.__onMouseDown(e);

			addListener(fabric.document, 'touchend', this._onMouseUp);
			addListener(fabric.document, 'touchmove', this._onMouseMove);

			removeListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
			removeListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);

			if (e.type === 'touchstart') {
				// Unbind mousedown to prevent double triggers from touch devices
				removeListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
			}
			else {
				addListener(fabric.document, 'mouseup', this._onMouseUp);
				addListener(fabric.document, 'mousemove', this._onMouseMove);
			}
		},

		/**
		 * @private
		 * @param {Event} e Event object fired on mouseup
		 */
		_onMouseUp: function (e) {
			this.__onMouseUp(e);

			removeListener(fabric.document, 'mouseup', this._onMouseUp);
			removeListener(fabric.document, 'touchend', this._onMouseUp);

			removeListener(fabric.document, 'mousemove', this._onMouseMove);
			removeListener(fabric.document, 'touchmove', this._onMouseMove);

			addListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
			addListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);

			if (e.type === 'touchend') {
				// Wait 400ms before rebinding mousedown to prevent double triggers
				// from touch devices
				var _this = this;
				setTimeout(function() {
					addListener(_this.upperCanvasEl, 'mousedown', _this._onMouseDown);
				}, 400);
			}
		},

		/**
		 * @private
		 * @param {Event} e Event object fired on mousemove
		 */
		_onMouseMove: function (e) {
			!this.allowTouchScrolling && e.preventDefault && e.preventDefault();
			this.__onMouseMove(e);
		},

		/**
		 * Method that defines the actions when mouse is released on canvas.
		 * The method resets the currentTransform parameters, store the image corner
		 * position in the image object and render the canvas on top.
		 * @private
		 * @param {Event} e Event object fired on mouseup
		 */
		__onMouseUp: function (e) {
			var target;

			if (this.isDrawingMode && this._isCurrentlyDrawing) {
				this._onMouseUpInDrawingMode(e);
				return;
			}

			if (this._currentTransform) {
				this._finalizeCurrentTransform();
				target = this._currentTransform.target;
			}
			else {
				target = this.findTarget(e, true);
			}

			var shouldRender = this._shouldRender(target, this.getPointer(e));

			this._maybeGroupObjects(e);

			if (target) {
				target.isMoving = false;
			}

			shouldRender && this.renderAll();

			this._handleCursorAndEvent(e, target);
		},

		_handleCursorAndEvent: function(e, target) {
			this._setCursorFromEvent(e, target);


			var _this = this;
			setTimeout(function () {
				_this._setCursorFromEvent(e, target);
			}, 50);

			this.fire('mouse:up', { target: target, e: e });
			target && target.fire('mouseup', { e: e });
		},

		/**
		 * @private
		 * @param {Event} e Event object fired on mousedown
		 */
		_onMouseDownInDrawingMode: function(e) {
			this._isCurrentlyDrawing = true;
			this.discardActiveObject(e).renderAll();
			if (this.clipTo) {
				fabric.util.clipContext(this, this.contextTop);
			}
			var ivt = fabric.util.invertTransform(this.viewportTransform),
				pointer = fabric.util.transformPoint(this.getPointer(e, true), ivt);
			this.freeDrawingBrush.onMouseDown(pointer);
			this.fire('mouse:down', { e: e });

			var target = this.findTarget(e);
			if (typeof target !== 'undefined') {
				target.fire('mousedown', { e: e, target: target });
			}
		},

		/**
		 * @private
		 * @param {Event} e Event object fired on mousemove
		 */
		_onMouseMoveInDrawingMode: function(e) {
			var target = this.findTarget(e);
			if (this._isCurrentlyDrawing) {
				var ivt = fabric.util.invertTransform(this.viewportTransform),
					pointer = fabric.util.transformPoint(this.getPointer(e, true), ivt);
				this.freeDrawingBrush.onMouseMove(pointer, target);
			}
			this.setCursor(this.freeDrawingCursor);
			this.fire('mouse:move', { e: e });

			if (typeof target !== 'undefined') {
				target.fire('mousemove', { e: e, target: target });
			}
		},

		/**
		 * @private
		 * @param {Event} e Event object fired on mouseup
		 * @param {Object} e Object that was finded on this points
		 */
		_onMouseUpInDrawingMode: function(e) {

			this._isCurrentlyDrawing = false;
			if (this.clipTo) {
				this.contextTop.restore();
			}
			var target = this.findTarget(e);
			if (target && target.fireToObjects && target.findTarget) {
				target = target.findTarget(e);
			}
			this.freeDrawingBrush.onMouseUp(target);
			this.fire('mouse:up', { e: e });

			if (typeof target !== 'undefined') {
				target.fire('mouseup', { e: e, target: target });
			}
		},

		/**
		 * Method that defines the actions when mouse is clic ked on canvas.
		 * The method inits the currentTransform parameters and renders all the
		 * canvas so the current image can be placed on the top canvas and the rest
		 * in on the container one.
		 * @private
		 * @param {Event} e Event object fired on mousedown
		 */
		__onMouseDown: function (e) {

			// accept only left clicks
			var isLeftClick  = 'which' in e ? e.which === 1 : e.button === 0;
			if (!isLeftClick && !fabric.isTouchSupported) {
				return;
			}

			if (this.isDrawingMode) {
				this._onMouseDownInDrawingMode(e);
				return;
			}

			// ignore if some object is being transformed at this moment
			if (this._currentTransform) {
				return;
			}

			var target = this.findTarget(e),
				pointer = this.getPointer(e, true);

			// save pointer for check in __onMouseUp event
			this._previousPointer = pointer;

			var shouldRender = this._shouldRender(target, pointer),
				shouldGroup = this._shouldGroup(e, target);

			if (this._shouldClearSelection(e, target)) {
				this._clearSelection(e, target, pointer);
			}
			else if (shouldGroup) {
				this._handleGrouping(e, target);
				target = this.getActiveGroup();
			}
			if (target && target.selectable && (target.__corner || !shouldGroup)) {
				this._beforeTransform(e, target);
				this._setupCurrentTransform(e, target);
			}
			// we must renderAll so that active image is placed on the top canvas
			shouldRender && this.renderAll();

			this.fire('mouse:down', { target: target, e: e });
			target && target.fire('mousedown', { e: e });
		},

		/**
		 * Method that defines the actions when mouse is hovering the canvas.
		 * The currentTransform parameter will definde whether the user is rotating/scaling/translating
		 * an image or neither of them (only hovering). A group selection is also possible and would cancel
		 * all any other type of action.
		 * In case of an image transformation only the top canvas will be rendered.
		 * @private
		 * @param {Event} e Event object fired on mousemove
		 */
		__onMouseMove: function (e) {

			var target, pointer;

			if (this.isDrawingMode) {
				this._onMouseMoveInDrawingMode(e);
				return;
			}
			if (typeof e.touches !== 'undefined' && e.touches.length > 1) {
				return;
			}

			var groupSelector = this._groupSelector;

			// We initially clicked in an empty area, so we draw a box for multiple selection
			if (groupSelector) {
				pointer = this.getPointer(e, true);

				groupSelector.left = pointer.x - groupSelector.ex;
				groupSelector.top = pointer.y - groupSelector.ey;

				this.renderTop();
			}
			else if (!this._currentTransform) {

				target = this.findTarget(e);

				if (!target || target && !target.selectable) {
					this.setCursor(this.defaultCursor);
				}
				else {
					this._setCursorFromEvent(e, target);
				}
			}
			else {
				this._transformObject(e);
			}

			this.fire('mouse:move', { target: target, e: e });
			target && target.fire('mousemove', { e: e });
		},

		/**
		 * Sets the cursor depending on where the canvas is being hovered.
		 * Note: very buggy in Opera
		 * @param {Event} e Event object
		 * @param {Object} target Object that the mouse is hovering, if so.
		 */
		_setCursorFromEvent: function (e, target) {
			if (!target || !target.selectable) {
				this.setCursor(this.defaultCursor);
				return false;
			}
			else {
				var activeGroup = this.getActiveGroup(),
				// only show proper corner when group selection is not active
					corner = target._findTargetCorner
						&& (!activeGroup || !activeGroup.contains(target))
						&& target._findTargetCorner(this.getPointer(e, true));

				if (!corner) {
					this.setCursor(target.hoverCursor || this.hoverCursor);
				}
				else {
					this._setCornerCursor(corner, target, e);
				}
			}
			return true;
		}


	});
})(typeof exports !== 'undefined' ? exports : this);
