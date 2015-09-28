/**
 * Created by rus on 28.09.2015.
 */
/**
 * Created by rus on 23.09.2015.
 * @global mimic, fabric
 */
(function() {
	'use strict';


	fabric.SimpleImage = fabric.util.createClass( fabric.Object, fabric.Observable,  {
		type: 'simple-image',
		hasControls: false,
		hasBorders: false,
		initialize: function(src, options) {
			this.callSuper('initialize', options);
			this.image = new Image();
			this.image.src = src;
			this.image.onload = (function() {
				this.width = this.image.width;
				this.height = this.image.height;
				this.loaded = true;
				this.setCoords();
				this.fire('image:loaded');
			}).bind(this);
		},
		_render: function(ctx) {
			if (this.loaded) {
				ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
			}
		},
		toObject: function(propertiesToInclude) {
			return fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), this.getSrc());
		},
		getSrc: function() {
			return {
				src: this.image.src
			}
		}
	});
	fabric.SimpleImage.fromObject = function(object) {
		return new fabric.SimpleImage(object.src, object);
	}
})();