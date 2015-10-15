/**
 * Created by rus on 14.10.2015.
 */

(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric;

	mimic.Connection = fabric.util.createClass(fabric.Line, {
		type: 'connection',
		connectors: [],
		initialize: function (connectors, points, options) {
			options = options || {};
			this.connectors = connectors || [];
			this.callSuper('initialize', points, options);
		}
	});
})(typeof exports !== 'undefined' ? exports : this);