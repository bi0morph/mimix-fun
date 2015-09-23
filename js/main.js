/**
 * Created by rus on 23.09.2015.
 * @global mimic, fabric
 */
(function() {
	"use strict";


	function draggable(object) {
		object.on('mousedown', function() {
			var temp = this.clone();
			temp.set({
				hasControls: false,
				hasBorders: false,
			});
			mimic.canvas.add(temp);
			draggable(temp);
		});
		object.on('mouseup', function() {
			// Remove an event handler
			this.off('mousedown');

			// Comment this will let the clone object able to be removed by drag it to menu bar
			// this.off('mouseup');

			// Remove the object if its position is in menu bar
			if(this.left <= 200) {
				mimic.canvas.remove(this);
			}
		});
	}

	var rect = new fabric.Rect({ fill: 'red', hasControls: false, hasBorders: false });
	mimic.leftPanel.addButton(rect);
	draggable(rect);

	var rect = new fabric.Rect({ fill: 'green', hasControls: false, hasBorders: false  });
	mimic.leftPanel.addButton(rect);
	draggable(rect);

	var rect = new fabric.Rect({ fill: 'yellow', hasControls: false, hasBorders: false  });
	mimic.leftPanel.addButton(rect);
	draggable(rect);

	var rect = new fabric.Rect({ fill: 'blue', hasControls: false, hasBorders: false  });
	mimic.leftPanel.addButton(rect);
	draggable(rect);

	mimic.leftPanel.drawTo(mimic.canvas);

})();