/**
 * Created by rus on 21.10.2015.
 */
(function(global) {

	'use strict';
	var mimic = global.mimic || (global.mimic = { }),
		fabric = global.fabric,
		extend = fabric.util.object.extend;

	mimic.PipeLineOut = fabric.util.createClass(mimic.PipeLine, {
		type: 'out-pipe-line',
		initialize: function (options) {
			options = options || {};
			this.callSuper('initialize', 'blue', options);
		},
		clone: function () {
			var newGroup = new mimic.PipeLineOut({
				left: this.left,
				top: this.top
			});
			return newGroup;
		}
	});
})(window);