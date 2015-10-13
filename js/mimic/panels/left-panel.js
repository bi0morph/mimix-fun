/**
 * Created by rus on 13.10.2015.
 */
(function(global) {

	'use strict';

	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	if (mimic.LeftPanel) {
		fabric.warn('mimic.LeftPanel is already defined');
		return;
	}

	mimic.LeftPanel = fabric.util.createClass(fabric.Group,{

		/**
		 * Type of an object
		 * @type String
		 * @default
		 */
		type: 'left-panel',

		initialize: function(objects, options) {
			options = options || { };
			objects = objects || [];

			this.callSuper('initialize', objects, options);
		},

		complexity: function() {
			return 1;
		}
	});

})(typeof exports !== 'undefined' ? exports : this);
