/**
 * Created by rus on 23.09.2015.
 * @global mimic, fabric
 */
(function() {
	'use strict';

	fabric.SiplePanel = fabric.util.createClass( fabric.Rect, {
		type: 'simple-panel',
		buttons: [],
		buttonPadding: 10,
		initialize: function(options) {
			this.callSuper('initialize', options);
			this.maxButtonCnt = Math.floor(options.height / options.width) * 2;
			this.buttonSize = Math.floor(options.width / 2);
		},
		toJSON: function() {
			return false;
		},
		toObject: function() {
			return false;
		},
		addButton: function(button) {

			this.buttons.push(button);
			button.set('selectable', false);
			var buttonLength = this.buttons.length,
				buttonSide = this.buttonSize - this.buttonPadding * 2,
				panelRowNumber = Math.abs( Math.floor( (buttonLength-1) / 2) ),
				top = parseInt(this.top, 10) + panelRowNumber * this.buttonSize + this.buttonPadding,
				left;

			if (buttonLength % 2) {
				left = parseInt(this.left, 10) + this.buttonPadding;
			} else {
				left = parseInt(this.left, 10) + this.buttonPadding*3 + buttonSide;
			}

			button.set('width', buttonSide);
			button.set('height', buttonSide);
			button.set('top', top);
			button.set('left', left);
		}
	});
})();