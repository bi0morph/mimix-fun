/**
 * Created by rus on 23.09.2015.
 * @global mimic, fabric
 */

(function() {
	"use strict";

	var rect = new fabric.Rect({ fill: 'red', hasControls: false, hasBorders: false });
	mimic.leftPanel.addButton( new fabric.SimpleButton(rect) );

	var circleButton = new fabric.CircleButton({ fill: 'green' });
	mimic.leftPanel.addButton(circleButton);

	var triangle = new fabric.Triangle({
		width: 20, height: 30, fill: 'blue', left: 50, top: 50
	});
	mimic.leftPanel.addButton( new fabric.SimpleButton(triangle));

	mimic.leftPanel.addButton( new fabric.SimpleButton(triangle));

	var imgElement = document.getElementById('my-image');
	var imgInstance = new fabric.Image(imgElement);
	mimic.leftPanel.addButton( new fabric.SimpleButton(imgInstance));

	mimic.leftPanel.drawTo(mimic.canvas);

})();