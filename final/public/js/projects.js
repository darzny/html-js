(function () {
	'use strict';

	class ProjectDragAndDrop {
		constructor(projectListId) {
			this.projectList = document.getElementById(projectListId);
			this.draggedElement = null;

			this.init();
		}

		init() {
			this.projectList.addEventListener(
				'dragstart',
				this.handleDragStart.bind(this),
			);

			this.projectList.addEventListener(
				'dragover',
				this.handleDragOver.bind(this),
			);

			this.projectList.addEventListener('drop', this.handleDrop.bind(this));

			this.projectList.addEventListener(
				'dragend',
				this.handleDragEnd.bind(this),
			);
		}

		handleDragStart(event) {
			const target = event.target.closest('.project');
			if (!target) return;

			this.draggedElement = target;
			event.dataTransfer.effectAllowed = 'move';
			target.classList.add('dragging');
		}

		handleDragOver(event) {
			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
		}

		handleDrop(event) {
			event.preventDefault();

			const targetElement = event.target.closest('.project');

			if (!targetElement || this.draggedElement === targetElement) {
				return;
			}

			const allProjects = Array.from(
				this.projectList.querySelectorAll('.project'),
			);
			const draggedIndex = allProjects.indexOf(this.draggedElement);
			const targetIndex = allProjects.indexOf(targetElement);

			if (draggedIndex < targetIndex) {
				this.projectList.insertBefore(
					this.draggedElement,
					targetElement.nextSibling,
				);
				return;
			}

			this.projectList.insertBefore(this.draggedElement, targetElement);
		}

		handleDragEnd() {
			if (!this.draggedElement) {
				return;
			}

			this.draggedElement.classList.remove('dragging');
			this.draggedElement = null;
		}
	}

	document.addEventListener('DOMContentLoaded', () => {
		const isMobile = /Mobi|Android/i.test(navigator.userAgent);

		if (isMobile) {
			return;
		}

		new ProjectDragAndDrop('projectList');
	});
})();
