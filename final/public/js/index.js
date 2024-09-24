(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', () => {
		const menuToggle = document.querySelector('.menu-toggle');
		const nav = document.querySelector('.nav');

		if (!menuToggle || !nav) {
			return;
		}

		menuToggle.addEventListener('click', () => {
			nav.classList.toggle('active');
			document.body.classList.toggle('no-scroll');
		});
	});
})();
