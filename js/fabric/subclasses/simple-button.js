/**
 * Created by rus on 23.09.2015.
 * @global mimic, fabric
 */
(function() {
	'use strict';

	fabric.SimpleButton = fabric.util.createClass( fabric.Object,  {
			type: 'simple-button',
			objectPrototype: null,
			initialize: function(object) {
				this.objectPrototype = object;
				this.callSuper('initialize', {
					selectable: false
				});
			},
			toJSON: function() {
				return false;
			},
			toObject: function() {
				return false;
			},
			render: function() {
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

});