/**
 * Created by rus on 24.09.2015.
 * @global mimic, fabric
 */
(function() {
	'use strict';

	fabric.CircleButton = fabric.util.createClass( fabric.SimpleButton,  {
		type: 'circle-button',
		initialize: function(options) {
			var circle = new fabric.Circle(options);
			this.callSuper('initialize', circle);
		},
		setPosition: function(buttonSide, top, left) {
			this.objectPrototype.set('radius', Math.floor(buttonSide / 2) );
			this.objectPrototype.set('top', top);
			this.objectPrototype.set('left', left);
		}
	});
})();