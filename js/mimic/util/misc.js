(function() {

	var clone = fabric.util.object.clone;

	/**
	 * @namespace mimic.util
	 */
	mimic.util = {
		getBoundingBoxFromGroup: function(obj) {
			var objTmp = clone( obj),
				groupTmp = obj.group;

			if (groupTmp) {
				groupTmp._setObjectPosition(objTmp);
				objTmp.setCoords();
				objTmp.hasControls = objTmp.__origHasControls;
				delete objTmp.__origHasControls;
				objTmp.set('active', false);
				objTmp.setCoords();
				delete objTmp.group;
			}

			return objTmp.getBoundingRect();
		}
	};

})();
