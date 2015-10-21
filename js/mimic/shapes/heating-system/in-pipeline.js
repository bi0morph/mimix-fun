/**
 * Created by rus on 21.10.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	mimic.PipeLineIn = fabric.util.createClass(mimic.PipeLine, {
		type: 'in-pipe-line',
		initialize: function (options) {
			options = options || {};
			this.callSuper('initialize', 'red', options);
		},
		clone: function () {
			var newGroup = new mimic.PipeLineIn({
				left: this.left,
				top: this.top
			});
			return newGroup;
		}
	});
})(window);