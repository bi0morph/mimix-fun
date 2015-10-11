/**
 * Created by rus on 23.09.2015.
 * @global mimic, fabric
 */
(function() {
	'use strict';
	function draggable(object) {
		object.on('mousedown', function() {

			var temp = this.clone();
			temp.set({
				hasControls: false,
				hasBorders: false
			});

			mimic.canvas.add(temp);

			draggable(temp);
		});
		object.on('mouseup', function() {
			this.off('mousedown');

			// Comment this will let the clone object able to be removed by drag it to menu bar
			// this.off('mouseup');

			// Remove the object if its position is in menu bar
			if(this.left <= 200) {
				mimic.canvas.remove(this);
			}

			if(mimic.cursor.state !== 'move') {
				this.set('selectable', false);
			}
		});
	}

	fabric.SimpleButton = fabric.util.createClass( fabric.Object,  {
			type: 'simple-button',
			objectPrototype: null,
			initialize: function(object) {
				this.objectPrototype = object;
				object.set({
					hasControls: false,
					hasBorders: false
				});

				draggable(this.objectPrototype);

				this.callSuper('initialize', {
					selectable: false
				});
			},
			toJSON: function() {
				return false;
			},
			toObject: function() {
				return false;
			},
			setPosition: function(buttonSide, top, left) {
				this.objectPrototype.set('width', buttonSide);
				this.objectPrototype.set('height', buttonSide);
				this.objectPrototype.set('top', top);
				this.objectPrototype.set('left', left);

			}
		});
})();