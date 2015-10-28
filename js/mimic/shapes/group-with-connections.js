/**
 * Created by rus on 27.10.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;




	mimic.GroupWithConnections = fabric.util.createClass(fabric.Group, {
		type: 'group-with-connections',

		initialize: function (objects, options, params) {

			options = options || {};
			params =  params || { width: 60, height: 40 };

			objects = this._createObjects(params, objects);

			this.callSuper('initialize', objects, options);
			this._initEvents();
		}

	});
})(window);