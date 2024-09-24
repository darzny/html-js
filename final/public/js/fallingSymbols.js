(function () {
	'use strict';

	const button = document.getElementById('magic');
	const canvas = document.getElementById('symbolCanvas');
	const ctx = canvas?.getContext('2d');

	if (!ctx || !Modernizr.canvas) {
		button?.classList.add('hidden');

		return;
	}

	const isMobile = /Mobi|Android/i.test(navigator.userAgent);
	const fontSize = isMobile ? 16 : 48;

	let animationInterval;

	class RandomSymbol {
		constructor(x, y, fontSize, canvasHeight) {
			this.x = x;
			this.y = y;
			this.fontSize = fontSize;
			this.canvasHeight = canvasHeight;
			this.symbols = ['@', '!', '?', '&', '#', '*', '%'];
		}

		draw(ctx) {
			const symbol =
				this.symbols[Math.floor(Math.random() * this.symbols.length)];
			ctx.fillText(symbol, this.x * this.fontSize, this.y * this.fontSize);

			if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.975) {
				this.y = 0;
			}

			this.y++;
		}
	}

	class RandomSymbolRain {
		constructor(canvas, ctx, fontSize) {
			this.canvas = canvas;
			this.ctx = ctx;
			this.fontSize = fontSize;
			this.columns = Math.floor(canvas.width / this.fontSize);
			this.symbols = [];

			this.initSymbols();
		}

		initSymbols() {
			for (let i = 0; i < this.columns; i++) {
				const yPosition = Math.floor(
					(Math.random() * this.canvas.height) / this.fontSize,
				);
				this.symbols[i] = new RandomSymbol(
					i,
					yPosition,
					this.fontSize,
					this.canvas.height,
				);
			}
		}

		draw() {
			this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.ctx.fillStyle = '#00d9ff';
			this.ctx.font = `${this.fontSize}px monospace`;

			this.symbols.forEach((symbol) => symbol.draw(this.ctx));
		}

		start() {
			animationInterval = setInterval(() => this.draw(), 50);
		}

		stop() {
			clearInterval(animationInterval);
		}
	}

	function adjustCanvasSize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function showCanvas() {
		document.body.classList.add('no-scroll');
		canvas.classList.remove('hidden');
	}

	function hideCanvas() {
		document.body.classList.remove('no-scroll');
		canvas.classList.add('hidden');
	}

	function startSymbolRain() {
		adjustCanvasSize();

		const symbolRain = new RandomSymbolRain(canvas, ctx, fontSize);
		symbolRain.start();
		return symbolRain;
	}

	let symbolRainInstance;

	button.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });

		showCanvas();

		symbolRainInstance = startSymbolRain();
	});

	canvas.addEventListener('click', () => {
		hideCanvas();

		if (!symbolRainInstance) {
			return;
		}

		symbolRainInstance.stop();
		symbolRainInstance = null;
	});

	window.addEventListener('resize', () => {
		if (canvas.classList.contains('hidden') || symbolRainInstance) {
			return;
		}

		symbolRainInstance.stop();
		adjustCanvasSize();

		symbolRainInstance = startSymbolRain();
	});
})();
