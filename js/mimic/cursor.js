/**
 * Created by rus on 11.10.2015.
 */
(function(global) {
	"use strict";

	var CursorState = fabric.util.createClass( {
		initialize: function () {},
		state: 'move'
	});
	fabric.util.object.extend(CursorState.prototype, fabric.Observable);

	global.mimic = global.mimic || {};
	global.mimic.cursor = new CursorState();
	global.mimic.cursor.on('cursor:change', function(type) {
		if(type) {
			console.log('cursor:change', type);
			this.state = type;
		}
	})
})(window);
