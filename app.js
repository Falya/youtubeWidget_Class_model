(function () {
	'use strict';

	class YouTubeWidget {

		constructor(searchField, contentDiv) {
			this.searchField = searchField;
			this.contentDiv = contentDiv;
			this.viewdVideo = new Map();

		}

		init() {
			let btn = this.searchField.querySelector('input[type="button"]');
			let searchInput = this.searchField.querySelector('input[type="text"]');
			this.contentDiv.addEventListener('click', this);
			btn.addEventListener('click', this);
			searchInput.addEventListener('keypress', this);
			console.log(this.viewdVide);

		}

		getYouTubeJson() {
			let forSearch = this.getRequest();
			const API_KEY = 'AIzaSyACvkTKBo_DRiv4D3gLHWKUjQmLvXNq4IE';
			let wUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&q=${forSearch}&type=video&maxResults=6`;
			let xhr = new XMLHttpRequest();
			xhr.open('GET', wUrl, true);
			xhr.responseType = 'json';
			xhr.onload = () => {
				let data = xhr.response;
				this.createItem(data);
			};
			xhr.onerror = () => {
				console.log('Error!');
			};
			xhr.send();
		}

		getRequest() {
			let items = this.contentDiv.querySelectorAll('.item');
			if (items) {
				items.forEach((item) => {
					item.remove();
				});
			}
			this.contentDiv.style.margin = 'auto';
			this.contentDiv.querySelector('.loader').style.display = 'block';
			let req = this.searchField.querySelector('input[type="text"]'),
				reqVal = req.value;
			req.value = '';
			return reqVal;

		}

		createItem(obj) {
			let fragment = document.createDocumentFragment();
			obj.items.forEach((item) => {
				let itemDiv = document.createElement('div');
				itemDiv.classList.add('item', 'fadein');
				itemDiv.dataset.videoId = item.id.videoId;
				let figure = document.createElement('figure'),
					image = new Image();
				image.src = item.snippet.thumbnails.high.url;
				let figcaption = document.createElement('figcaption');
				figcaption.innerHTML = item.snippet.title;
				figure.append(image, figcaption);
				itemDiv.append(figure);
				fragment.append(itemDiv);
			});

			let loader = this.contentDiv.querySelector('.loader');
			loader.classList.toggle('fadeout');
			loader.addEventListener('animationend', () => {
				this.contentDiv.style.margin = '';
				loader.classList.toggle('fadeout');
				loader.style.display = '';
				this.contentDiv.append(fragment);
			}, {once: true});


		}

		toggleOverlay(e) {
			let overlay = document.querySelector('.overlay');
			console.log(e);
			let item = e.path ? e.path.find((element) => {
				return element.classList.contains('item');
			}) : e.target.offsetParent;

			if (overlay.classList.contains('display-none')) {
				let videoId = item.dataset.videoId;
				let iframe;

				if (this.viewdVideo.has(videoId)) {
					iframe = this.viewdVideo.get(videoId);
				} else {
					iframe = document.createElement('iframe');
					iframe.width = '760';
					iframe.height = '428';
					iframe.src = `http://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
					iframe.allowFullscreen = true;
					iframe.setAttribute('allow', 'autoplay');
					iframe.setAttribute('frameborder', '0');
					this.viewdVideo.set(videoId, iframe);

					iframe.onload = () => {

						document.body.setAttribute('style', 'overflow: hidden;');
					};
				}
				overlay.classList.toggle('display-none');
				overlay.append(iframe);
				overlay.addEventListener('click', function (e) {
					let target = e.currentTarget;
					document.body.removeAttribute('style');
					target.classList.toggle('display-none');
					iframe.remove();

				}, {once: true});
			}
		}

		handleEvent(e) {
			if (e.target.closest('[type="button"]') || (e.target.closest('[type="text"]') && e.key === 'Enter')) {
				e.preventDefault();
				this.getYouTubeJson();
			}
			else if (e.target.closest('.item')) {
				this.toggleOverlay(e);
			}
		}
	}

	let field = document.querySelector('.search-field'),
		divEl = document.querySelector('.result-list');
	let you = new YouTubeWidget(field, divEl);
	you.init();

}());