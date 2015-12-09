/**
 * Created by rus on 23.09.2015.
 * @global mimic, fabric
 */

(function(global) {
	"use strict";

	var mimic  = global.mimic,
		rightPanel  = global.rightPanel;

	mimic.init();
	rightPanel.init(function() {

		mimic.canvas.on('mouse:dblclick', function(event){
			if (event.target) {
				console.log('mouse:dblclick');
				rightPanel.render(event.target);
			}
		});
		mimic.canvas.on('selection:cleared', function(){
			rightPanel.hide();
		});
	});

})(typeof exports !== 'undefined' ? exports : this);