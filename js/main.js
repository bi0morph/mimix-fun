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


	var image1 = new fabric.SimpleImage('images/img1.jpg');
	image1.on('image:loaded', mimic.canvas.renderAll.bind(mimic.canvas));
	mimic.leftPanel.addButton( new fabric.SimpleButton(image1));

	var image2 = new fabric.SimpleImage('images/img2.jpg');
	image2.on('image:loaded', mimic.canvas.renderAll.bind(mimic.canvas));

	mimic.leftPanel.addButton( new fabric.SimpleButton(image2));

	mimic.leftPanel.drawTo(mimic.canvas);

	mimic.rightPanel.init(mimic.canvas);
})();