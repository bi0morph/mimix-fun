/**
 * Created by rus on 18.10.2015.
 * @global document
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
		render: function(target) {
			var actions, title;
			if (!target) {
				return console.error('rightPanel.render: target is undefined');
			}
			actions = target.getActions && target.getActions();
			title = target.getName && target.getName();

			if (!actions) {
				actions = target.actions;
			}
			console.log(target, actions);
			if (actions && actions.length) {
				while (_rightPanel.firstChild) {
					_rightPanel.removeChild(_rightPanel.firstChild);
				}
				if (title) {
					var h4 = document.createElement('h4');
					h4.innerText = title;
					_rightPanel.appendChild(h4);
				}
				if (actions) {
					var fragment = document.createDocumentFragment();

					var addActionHtml = function addActionHtml(action) {
						var div = document.createElement('div');

						if (action.button) {
							var button = document.createElement('button');
							button.type = 'button';
							button.innerHTML = action.title;
							button.addEventListener('click', function() {
								action.run();
							});
							div.appendChild(button);
						} else if ( action.values && action.values.length) {
							var label = document.createElement('label');
							label.innerHTML = action.title;
							var select = document.createElement('select');
							action.values.forEach(function(value, index) {
								var option = document.createElement('option');
								option.value = value.value ? value.value : '';
								option.innerHTML = value.title;
								if (action.isSelected && action.isSelected(value.value)) {
									option.selected = true;
									select.selectedIndex = index;
								}
								select.appendChild(option);
							});
							select.onchange = function() {
								action.run(this.options[this.selectedIndex].value);
							};
							div.appendChild(label);
							div.appendChild(select);
						} else if (action.value) {
							var form = document.createElement('form'),
								label = document.createElement('label'),
								input = document.createElement('input');

							label.innerHTML = action.title;
							input.value = action.value;
							form.onsubmit = function(e) {
								action.run(input.value);
								e.preventDefault();
							};

							div.appendChild(form);
							form.appendChild(label);
							form.appendChild(input);
						}
						fragment.appendChild(div);
					};

					actions.forEach(addActionHtml);
					_rightPanel.appendChild(fragment);
				}
				this.show();
			}
		}
	};

	global.rightPanel = rightPanel;
})(this);