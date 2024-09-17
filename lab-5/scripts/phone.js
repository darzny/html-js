(function () {
	"use strict";

	const supportsLocalStorage = Modernizr.localstorage;
	const supportsSessionStorage = Modernizr.sessionstorage;

	const supportsInputRequired = Modernizr.input.required;
	const supportsInputTypeTel = Modernizr.inputtypes.tel;

	document.addEventListener("DOMContentLoaded", () => {
		const formElement = document.getElementById("phoneBookForm");
		const isLocalStorage = formElement.dataset.useLocalStorage === "true";

		if (!supportsLocalStorage || !supportsSessionStorage) {
			alert(
				"Ваш браузер не поддерживает веб-хранилища. Данные не будут сохраняться после перезагрузки."
			);
		}

		createPhoneBook(isLocalStorage);
	});

	function createPhoneBook(useLocalStorage) {
		let phoneBookData = [];

		const isSupportsStorage =
			(useLocalStorage && supportsLocalStorage) ||
			(!useLocalStorage && supportsSessionStorage);

		const storage = useLocalStorage ? localStorage : sessionStorage;

		function getPhoneBook() {
			if (isSupportsStorage) {
				const phoneBook = storage.getItem("phoneBook");
				return phoneBook ? JSON.parse(phoneBook) : [];
			} else {
				return phoneBookData;
			}
		}

		function savePhoneBook(phoneBook) {
			if (isSupportsStorage) {
				storage.setItem("phoneBook", JSON.stringify(phoneBook));
			} else {
				phoneBookData = phoneBook;
			}
		}

		function getListItem(entry, index) {
			const listItem = document.createElement("li");
			listItem.innerHTML = `
                <b>${entry.name}:</b> <span>${entry.phone}</span> 
                <div class="actions"><span class="delete-btn" data-index="${index}">Удалить</span></div>
            `;
			return listItem;
		}

		function renderPhoneBook() {
			const phoneBookList = document.getElementById("phoneBookList");
			phoneBookList.innerHTML = "";

			const phoneBook = getPhoneBook();

			phoneBook.forEach((entry, index) => {
				const listItem = getListItem(entry, index);
				phoneBookList.appendChild(listItem);
			});
		}

		function isFormValid({ name, phone }) {
			let isFormValid = true;

			if (!supportsInputRequired) {
				if (!name) {
					alert("Поле 'Имя' обязательно для заполнения.");
					isFormValid = false;
				}
				if (!phone) {
					alert("Поле 'Телефон' обязательно для заполнения.");
					isFormValid = false;
				}
			}

			if (!supportsInputTypeTel) {
				const phonePattern = /^[0-9\-\+\s\(\)]+$/;
				if (!phonePattern.test(phone)) {
					alert("Пожалуйста, введите корректный номер телефона.");
					isFormValid = false;
				}
			}

			return isFormValid;
		}

		function addEntry(event) {
			event.preventDefault();

			const name = document.getElementById("name").value.trim();
			const phone = document.getElementById("phone").value.trim();

			if (isFormValid({ name, phone }) && name && phone) {
				const phoneBook = getPhoneBook();
				phoneBook.push({ name, phone });

				savePhoneBook(phoneBook);
				renderPhoneBook();

				document.getElementById("name").value = "";
				document.getElementById("phone").value = "";
			}
		}

		function deleteEntry(event) {
			if (event.target.classList.contains("delete-btn")) {
				const index = event.target.getAttribute("data-index");
				const phoneBook = getPhoneBook();

				phoneBook.splice(index, 1);
				savePhoneBook(phoneBook);
				renderPhoneBook();
			}
		}

		document
			.getElementById("phoneBookForm")
			.addEventListener("submit", addEntry);
		document
			.getElementById("phoneBookList")
			.addEventListener("click", deleteEntry);

		window.addEventListener("load", renderPhoneBook);
	}
})();
