/**
 * Created by rus on 18.10.2015.
 */
(function(global){
	"use strict";

	var _rightPanel;
	var rightPanel = {
		init: function(callback) {
			_rightPanel = document.querySelector('#right-panel');
			callback();
		},
		show: function() {
			_rightPanel.className = 'right-panel';
		},
		hide: function() {
			_rightPanel.className = 'right-panel hidden';
		},
		render: function(actions, stateCode) {

			while (_rightPanel.firstChild) {
				_rightPanel.removeChild(_rightPanel.firstChild);
			}

			if (actions) {
				actions.forEach(function(action) {
					if ( action.values.length) {
						var label = document.createElement('label');
						label.innerHTML = action.title;
						var select = document.createElement('select');
						action.values.forEach(function(value, index) {
							var option = document.createElement('option');
							option.value = value.value;
							option.innerHTML = value.title;
							if (stateCode === value.value) {
								option.selected = true;
								select.selectedIndex = index;
							}
							select.appendChild(option);
						});
						select.onchange = function() {
							action.run(this.options[this.selectedIndex].value);
							console.log('change', this.options[this.selectedIndex].value);
						};
						_rightPanel.appendChild(label);
						_rightPanel.appendChild(select);
					}
				});
			}
		}
	};

	global.rightPanel = rightPanel;
})(this);