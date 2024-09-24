(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', () => {
		const form = document.querySelector('form');
		const formElements = document.querySelectorAll('input, textarea');

		if (!form) {
			return;
		}

		formElements.forEach((element) => {
			if (localStorage.getItem(element.id)) {
				element.value = localStorage.getItem(element.id);
			}

			element.addEventListener('input', () => {
				localStorage.setItem(element.id, element.value);
			});
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			formElements.forEach((element) => {
				localStorage.removeItem(element.id);
			});

			alert('Форма успешно отправлена!');

			form.reset();
		});
	});
})();
