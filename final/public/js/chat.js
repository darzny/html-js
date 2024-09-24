(function () {
	'use strict';

	class ChatClient {
		constructor(chatWindow, messageInput, sendButton) {
			this.chatWindow = chatWindow;
			this.messageInput = messageInput;
			this.sendButton = sendButton;

			this.loader = document.createElement('div');

			this.loader.className = 'loader';
			this.loader.textContent = 'Ожидание ответа...';

			this.init();
		}

		init() {
			this.setupWebSocket();
			this.addEventListeners();
		}

		setupWebSocket() {
			this.socket = new WebSocket(`ws://${window.location.host}`);

			if (!this.socket) {
				return;
			}

			this.socket.addEventListener('open', () => {
				console.log('Соединение установлено');
			});

			this.socket.addEventListener('message', (event) => {
				this.hideLoader();
				this.enableSendButton();
				this.displayMessage('Тест', event.data);
			});

			this.socket.addEventListener('close', () => {
				console.log('Соединение закрыто');
				this.disableSendButton();
			});

			this.socket.addEventListener('error', (error) => {
				console.error('Ошибка WebSocket:', error);
				this.disableSendButton();
			});
		}

		addEventListeners() {
			this.sendButton.addEventListener('click', (event) => {
				event.preventDefault();
				this.handleSendMessage();
			});
		}

		handleSendMessage() {
			const message = this.messageInput.value.trim();
			if (!message) return;

			this.displayMessage('Вы', message);
			this.socket.send(message);

			this.messageInput.value = '';
			this.showLoader();
			this.disableSendButton();
		}

		displayMessage(sender, message) {
			const messageElement = document.createElement('div');
			messageElement.classList.add('message');

			const senderElement = document.createElement('b');
			senderElement.textContent = `${sender}: `;

			const messageText = document.createTextNode(message);

			messageElement.append(senderElement, messageText);
			this.chatWindow.appendChild(messageElement);
			this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
		}

		showLoader() {
			this.chatWindow.appendChild(this.loader);
			this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
		}

		hideLoader() {
			if (this.loader.parentNode) {
				this.chatWindow.removeChild(this.loader);
			}
		}

		disableSendButton() {
			this.sendButton.classList.add('disabled');

			this.sendButton.disabled = true;
		}

		enableSendButton() {
			this.sendButton.classList.remove('disabled');

			this.sendButton.disabled = false;
		}
	}

	document.addEventListener('DOMContentLoaded', () => {
		const chatWindow = document.getElementById('chat-window');
		const messageInput = document.getElementById('message-input');
		const sendButton = document.getElementById('send-button');

		if (!sendButton || !messageInput || !sendButton) {
			return;
		}

		new ChatClient(chatWindow, messageInput, sendButton);
	});
})();
