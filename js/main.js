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
		mimic.canvas.on('object:selected', function(event){
			console.log('object:selected', event.target);
			if (event.target.type === "control-valve" ||
				event.target.type === "solenoid-valve") {
				rightPanel.show();
				rightPanel.render(event.target.actions, event.target.stateCode);
			}
		});
		mimic.canvas.on('selection:cleared', function(){
			rightPanel.hide();
		});
	});

})(typeof exports !== 'undefined' ? exports : this);