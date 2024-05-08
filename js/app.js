window.addEventListener("load", () => {
	function dataMediaQueries(array, dataSetValue) {
		// Получение объектов с медиа запросами
		const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
		});
		// Инициализация объектов с медиа запросами
		if (media.length) {
		const breakpointsArray = [];
		media.forEach((item) => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return (
			"(" +
			item.type +
			"-width: " +
			item.value +
			"px)," +
			item.value +
			"," +
			item.type
			);
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach((breakpoint) => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);
			// Объекты с нужными условиями
			const itemsArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
				return true;
				}
			});
			mdQueriesArray.push({
				itemsArray,
				matchMedia,
			});
			});
			return mdQueriesArray;
		}
		}
	}
	function setHash(hash) {
		hash = hash ? `#${hash}` : window.location.href.split("#")[0];
		history.pushState("", "", hash);
	}

	function getHash() {
		if (location.hash) {
		return location.hash.replace("#", "");
		}
	}
	function uniqArray(array) {
		return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
		});
	}

	function tabs() {
		const tabs = document.querySelectorAll("[data-tabs]");
		let tabsActiveHash = [];

		if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith("tab-")) {
			tabsActiveHash = hash.replace("tab-", "").split("-");
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add("_tab-init");
			tabsBlock.setAttribute("data-tabs-index", index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(tabs, "tabs");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
			// Событие
			mdQueriesItem.matchMedia.addEventListener("change", function () {
				setTitlePosition(
				mdQueriesItem.itemsArray,
				mdQueriesItem.matchMedia
				);
			});
			setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		}
		// Установка позиций заголовков
		function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
			let tabsTitleItems =
			tabsMediaItem.querySelectorAll("[data-tabs-title]");
			let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
			let tabsContentItems =
			tabsMediaItem.querySelectorAll("[data-tabs-item]");
			tabsTitleItems = Array.from(tabsTitleItems).filter(
			(item) => item.closest("[data-tabs]") === tabsMediaItem
			);
			tabsContentItems = Array.from(tabsContentItems).filter(
			(item) => item.closest("[data-tabs]") === tabsMediaItem
			);
			tabsContentItems.forEach((tabsContentItem, index) => {
			if (matchMedia.matches) {
				tabsContent.append(tabsTitleItems[index]);
				tabsContent.append(tabsContentItem);
				tabsMediaItem.classList.add("_tab-spoller");
			} else {
				tabsTitles.append(tabsTitleItems[index]);
				tabsMediaItem.classList.remove("_tab-spoller");
			}
			});
		});
		}
		// Работа с контентом
		function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
		let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector(
			"[data-tabs-titles]>._tab-active"
			);
			tabsActiveTitle
			? tabsActiveTitle.classList.remove("_tab-active")
			: null;
		}
		if (tabsContent.length) {
			tabsContent = Array.from(tabsContent).filter(
			(item) => item.closest("[data-tabs]") === tabsBlock
			);
			tabsTitles = Array.from(tabsTitles).filter(
			(item) => item.closest("[data-tabs]") === tabsBlock
			);
			tabsContent.forEach((tabsContentItem, index) => {
			tabsTitles[index].setAttribute("data-tabs-title", "");
			tabsContentItem.setAttribute("data-tabs-item", "");

			if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
				tabsTitles[index].classList.add("_tab-active");
			}
			tabsContentItem.hidden =
				!tabsTitles[index].classList.contains("_tab-active");
			});
		}
		}
		function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
		let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute("data-tabs-animate")) {
			return tabsBlock.dataset.tabsAnimate > 0
				? Number(tabsBlock.dataset.tabsAnimate)
				: 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute("data-tabs-hash");
			tabsContent = Array.from(tabsContent).filter(
			(item) => item.closest("[data-tabs]") === tabsBlock
			);
			tabsTitles = Array.from(tabsTitles).filter(
			(item) => item.closest("[data-tabs]") === tabsBlock
			);
			tabsContent.forEach((tabsContentItem, index) => {
			if (tabsTitles[index].classList.contains("_tab-active")) {
				if (tabsBlockAnimate) {
				_slideDown(tabsContentItem, tabsBlockAnimate);
				} else {
				tabsContentItem.hidden = false;
				}
				if (isHash && !tabsContentItem.closest(".popup")) {
				setHash(`tab-${tabsBlockIndex}-${index}`);
				}
			} else {
				if (tabsBlockAnimate) {
				_slideUp(tabsContentItem, tabsBlockAnimate);
				} else {
				tabsContentItem.hidden = true;
				}
			}
			});
		}
		}
		function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-tabs-title]")) {
			const tabTitle = el.closest("[data-tabs-title]");
			const tabsBlock = tabTitle.closest("[data-tabs]");
			if (
			!tabTitle.classList.contains("_tab-active") &&
			!tabsBlock.querySelector("._slide")
			) {
			let tabActiveTitle = tabsBlock.querySelectorAll(
				"[data-tabs-title]._tab-active"
			);
			tabActiveTitle.length
				? (tabActiveTitle = Array.from(tabActiveTitle).filter(
					(item) => item.closest("[data-tabs]") === tabsBlock
				))
				: null;
			tabActiveTitle.length
				? tabActiveTitle[0].classList.remove("_tab-active")
				: null;
			tabTitle.classList.add("_tab-active");
			setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
		}
	}
	tabs();
	function textGo() {
		// Знаходимо елементи за атрибутом data-text
		let bioProfessionElements = document.querySelectorAll('[data-text]');
	
		// Отримуємо текст з кожного елемента
		bioProfessionElements.forEach(function(element) {
			let dataTextValue = element.getAttribute('data-text') || "";
	
			// Отримуємо текст в середині тегу
			let innerTextValue = dataTextValue;
	
			// Виводимо отриманий текст
			let text = innerTextValue.split("");
			if (!text.length) {
				return;
			}
	
			// Очищаємо вміст тегу перед вставкою нового тексту
			element.innerText = " ";
	
			let line = 0;
			let count = 0;
			let out = "";
	
			function typeLine() {
				let interval = setTimeout(function () {
					out += text[line][count];
					element.innerText = out + " |";
					count++;
	
					if (count === text[line].length) {
						count = 0;
						line++;
	
						if (line === text.length) {
							clearTimeout(interval);
							element.innerText = out;
							return true;
						}
	
						typeLine();
					}
				}, getRandomInt(300 * 1.5));
			}
	
			typeLine();
		});
	}
	// Викликаємо функцію
	textGo();
	
	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}




	let bodyLockStatus = true;

	let bodyLockToggle = (delay = 500) => {
		if (document.documentElement.classList.contains('lock')) {
			bodyUnlock(delay);
		} else {
			bodyLock(delay);
		}
	}
	let bodyUnlock = (delay = 500) => {
		
		if (bodyLockStatus) {
			setTimeout(() => {
				document.documentElement.classList.remove("lock");
			}, delay);
			bodyLockStatus = false;
			setTimeout(function () {
				bodyLockStatus = true;
			}, delay);
		}
	}

	let bodyLock = (delay = 500) => {
		if (bodyLockStatus) {
			document.documentElement.classList.add("lock");
			bodyLockStatus = false;
			setTimeout(function () {
				bodyLockStatus = true;
			}, delay);
		}
	}

		// Класс Popup
	class Popup {
		constructor(options) {
			let config = {
				logging: true,
				init: true,
				// Для кнопок 
				attributeOpenButton: 'data-popup', // Атрибут для кнопки, которая вызывает попап
				attributeCloseButton: 'data-close', // Атрибут для кнопки, которая закрывает попап
				// Для сторонних объектов
				fixElementSelector: '[data-lp]', // Атрибут для элементов с левым паддингом (которые fixed)
				// Для объекта попапа
				youtubeAttribute: 'data-popup-youtube', // Атрибут для кода youtube
				youtubePlaceAttribute: 'data-popup-youtube-place', // Атрибут для вставки ролика youtube
				setAutoplayYoutube: true,
				// Изменение классов
				classes: {
					popup: 'popup',
					// popupWrapper: 'popup__wrapper',
					popupContent: 'popup__content',
					popupActive: 'popup_show', // Добавляется для попапа, когда он открывается
					bodyActive: 'popup-show', // Добавляется для боди, когда попап открыт
				},
				focusCatch: true, // Фокус внутри попапа зациклен
				closeEsc: true, // Закрытие по ESC
				bodyLock: true, // Блокировка скролла
				hashSettings: {
					location: true, // Хэш в адресной строке
					goHash: true, // Переход по наличию в адресной строке
				},
				on: { // События
					beforeOpen: function () { },
					afterOpen: function () { },
					beforeClose: function () { },
					afterClose: function () { },
				},
			}
			this.youTubeCode;
			this.isOpen = false;
			// Текущее окно
			this.targetOpen = {
				selector: false,
				element: false,
			}
			// Предыдущее открытое
			this.previousOpen = {
				selector: false,
				element: false,
			}
			// Последнее закрытое
			this.lastClosed = {
				selector: false,
				element: false,
			}
			this._dataValue = false;
			this.hash = false;

			this._reopen = false;
			this._selectorOpen = false;

			this.lastFocusEl = false;
			this._focusEl = [
				'a[href]',
				'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
				'button:not([disabled]):not([aria-hidden])',
				'select:not([disabled]):not([aria-hidden])',
				'textarea:not([disabled]):not([aria-hidden])',
				'area[href]',
				'iframe',
				'object',
				'embed',
				'[contenteditable]',
				'[tabindex]:not([tabindex^="-"])'
			];
			//this.options = Object.assign(config, options);
			this.options = {
				...config,
				...options,
				classes: {
					...config.classes,
					...options?.classes,
				},
				hashSettings: {
					...config.hashSettings,
					...options?.hashSettings,
				},
				on: {
					...config.on,
					...options?.on,
				}
			}
			this.bodyLock = false;
			this.options.init ? this.initPopups() : null
		}
		initPopups() {
			this.eventsPopup();
		}
		eventsPopup() {
			// Клик на всем документе
			document.addEventListener("click", function (e) {
				// Клик по кнопке "открыть"
				const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
				if (buttonOpen) {
					e.preventDefault();
					this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ?
						buttonOpen.getAttribute(this.options.attributeOpenButton) :
						'error';
					this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ?
						buttonOpen.getAttribute(this.options.youtubeAttribute) :
						null;
					if (this._dataValue !== 'error') {
						if (!this.isOpen) this.lastFocusEl = buttonOpen;
						this.targetOpen.selector = `${this._dataValue}`;
						this._selectorOpen = true;
						this.open();
						return;

					}

					return;
				}
				// Закрытие на пустом месте (popup__wrapper) и кнопки закрытия (popup__close) для закрытия
				const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
				if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
					e.preventDefault();
					this.close();
					return;
				}
			}.bind(this));
			// Закрытие по ESC
			document.addEventListener("keydown", function (e) {
				if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
					e.preventDefault();
					this.close();
					return;
				}
				if (this.options.focusCatch && e.which == 9 && this.isOpen) {
					this._focusCatch(e);
					return;
				}
			}.bind(this))

			// Открытие по хешу
			if (this.options.hashSettings.goHash) {
				// Проверка изменения адресной строки
				window.addEventListener('hashchange', function () {
					if (window.location.hash) {
						this._openToHash();
					} else {
						this.close(this.targetOpen.selector);
					}
				}.bind(this))

				window.addEventListener('load', function () {
					if (window.location.hash) {
						this._openToHash();
					}
				}.bind(this))
			}
		}
		open(selectorValue) {
			if (bodyLockStatus) {
				// Если перед открытием попапа был режим lock
				this.bodyLock = document.documentElement.classList.contains('lock') && !this.isOpen ? true : false;

				// Если ввести значение селектора (селектор настраивается в options)
				if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
					this.targetOpen.selector = selectorValue;
					this._selectorOpen = true;
				}
				if (this.isOpen) {
					this._reopen = true;
					this.close();
				}
				if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
				if (!this._reopen) this.previousActiveElement = document.activeElement;

				this.targetOpen.element = document.querySelector(this.targetOpen.selector);

				if (this.targetOpen.element) {
					// YouTube
					if (this.youTubeCode) {
						const codeVideo = this.youTubeCode;
						const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`
						const iframe = document.createElement('iframe');
						iframe.setAttribute('allowfullscreen', '');

						const autoplay = this.options.setAutoplayYoutube ? 'autoplay;' : '';
						iframe.setAttribute('allow', `${autoplay}; encrypted-media`);

						iframe.setAttribute('src', urlVideo);

						if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
							const youtubePlace = this.targetOpen.element.querySelector('.popup__text').setAttribute(`${this.options.youtubePlaceAttribute}`, '');
						}
						this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
					}
					if (this.options.hashSettings.location) {
						// Получение хэша и его выставление 
						this._getHash();
						this._setHash();
					}

					// До открытия
					this.options.on.beforeOpen(this);
					// Создаем свое событие после открытия попапа
					document.dispatchEvent(new CustomEvent("beforePopupOpen", {
						detail: {
							popup: this
						}
					}));

					this.targetOpen.element.classList.add(this.options.classes.popupActive);
					document.documentElement.classList.add(this.options.classes.bodyActive);

					if (!this._reopen) {
						!this.bodyLock ? bodyLock() : null;
					}
					else this._reopen = false;

					this.targetOpen.element.setAttribute('aria-hidden', 'false');

					// Запоминаю это открытое окно. Оно будет последним открытым
					this.previousOpen.selector = this.targetOpen.selector;
					this.previousOpen.element = this.targetOpen.element;

					this._selectorOpen = false;

					this.isOpen = true;

					setTimeout(() => {
						this._focusTrap();
					}, 50);

					// После открытия
					this.options.on.afterOpen(this);
					// Создаем свое событие после открытия попапа
					document.dispatchEvent(new CustomEvent("afterPopupOpen", {
						detail: {
							popup: this
						}
					}));
					

				}
			}
		}
		close(selectorValue) {
			if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
				this.previousOpen.selector = selectorValue;
			}
			if (!this.isOpen || !bodyLockStatus) {
				return;
			}
			// До закрытия
			this.options.on.beforeClose(this);
			// Создаем свое событие перед закрытием попапа
			document.dispatchEvent(new CustomEvent("beforePopupClose", {
				detail: {
					popup: this
				}
			}));

			// YouTube
			if (this.youTubeCode) {
				if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`))
					this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = '';
			}
			this.previousOpen.element.classList.remove(this.options.classes.popupActive);
			// aria-hidden
			this.previousOpen.element.setAttribute('aria-hidden', 'true');
			if (!this._reopen) {
				document.documentElement.classList.remove(this.options.classes.bodyActive);
				!this.bodyLock ? bodyUnlock() : null;
				this.isOpen = false;
			}
			// Очищение адресной строки
			this._removeHash();
			if (this._selectorOpen) {
				this.lastClosed.selector = this.previousOpen.selector;
				this.lastClosed.element = this.previousOpen.element;

			}
			// После закрытия
			this.options.on.afterClose(this);
			// Создаем свое событие после закрытия попапа
			document.dispatchEvent(new CustomEvent("afterPopupClose", {
				detail: {
					popup: this
				}
			}));

			setTimeout(() => {
				this._focusTrap();
			}, 50);

			
		}
		// Получение хэша 
		_getHash() {
			if (this.options.hashSettings.location) {
				this.hash = this.targetOpen.selector.includes('#') ?
					this.targetOpen.selector : this.targetOpen.selector.replace('.', '#')
			}
		}
		_openToHash() {
			let classInHash = document.querySelector(`.${window.location.hash.replace('#', '')}`) ? `.${window.location.hash.replace('#', '')}` :
				document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` :
					null;

			const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace('.', "#")}"]`);
			if (buttons && classInHash) this.open(classInHash);
		}
		// Утсановка хэша
		_setHash() {
			history.pushState('', '', this.hash);
		}
		_removeHash() {
			history.pushState('', '', window.location.href.split('#')[0])
		}
		_focusCatch(e) {
			const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
			const focusArray = Array.prototype.slice.call(focusable);
			const focusedIndex = focusArray.indexOf(document.activeElement);

			if (e.shiftKey && focusedIndex === 0) {
				focusArray[focusArray.length - 1].focus();
				e.preventDefault();
			}
			if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
				focusArray[0].focus();
				e.preventDefault();
			}
		}
		_focusTrap() {
			const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
			if (!this.isOpen && this.lastFocusEl) {
				this.lastFocusEl.focus();
			} else {
				focusable[0].focus();
			}
		}
		// Функция вывода в консоль

	}
	// Запускаем 
	new Popup({});
	//data-anim-Item добаляем атрибут елементу і стилізуєм класс 'active' в scss

	const animItems = document.querySelectorAll('[data-anim-Item]');


	if (animItems.length > 0) {
		window.addEventListener('scroll', animOnScroll);
		function animOnScroll() {
			for (let index = 0; index < animItems.length; index++) {
				const animItem = animItems[index];
				const animItemHeight = animItem.offsetHeight;
				const animItemOffset = offset(animItem).top;
				const animStart = 4;

				let animItemPoint = window.innerHeight - animItemHeight / animStart;
				if (animItemHeight > window.innerHeight) {
					animItemPoint = window.innerHeight - window.innerHeight / animStart;
				}

				if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
					animItem.classList.add('active');
				} else {
					if (!animItem.classList.contains('_anim-no-hide')) {
						animItem.classList.remove('active');
					}
				}
			}
		}
		function offset(el) {
			const rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
		}

		setTimeout(() => {
			animOnScroll();
		}, 300);
	}


	function uniqArray(array) {
		return array.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		}
		);
	}




	class ScrollWatcher {
		constructor(props) {
			let defaultConfig = {
				logging: true,
			}
			this.config = Object.assign(defaultConfig, props);
			this.observer;
			!document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;
		}
		// Обновляем конструктор
		scrollWatcherUpdate() {
			this.scrollWatcherRun();
		}
		// Запускаем конструктор
		scrollWatcherRun() {
			document.documentElement.classList.add('watcher');
			this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
		}
		// Конструктор наблюдателей
		scrollWatcherConstructor(items) {
			if (items.length) {
				// Уникализируем параметры
				let uniqParams = uniqArray(Array.from(items).map(function (item) {
					return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
				}));
				// Получаем группы объектов с одинаковыми параметрами,
				// создаем настройки, инициализируем наблюдатель
				uniqParams.forEach(uniqParam => {
					let uniqParamArray = uniqParam.split('|');
					let paramsWatch = {
						root: uniqParamArray[0],
						margin: uniqParamArray[1],
						threshold: uniqParamArray[2]
					}
					let groupItems = Array.from(items).filter(function (item) {
						let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
						let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
						let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
						if (
							String(watchRoot) === paramsWatch.root &&
							String(watchMargin) === paramsWatch.margin &&
							String(watchThreshold) === paramsWatch.threshold
						) {
							return item;
						}
					});

					let configWatcher = this.getScrollWatcherConfig(paramsWatch);

					// Инициализация наблюдателя со своими настройками
					this.scrollWatcherInit(groupItems, configWatcher);
				});
			}
		}
		// Функция создания настроек
		getScrollWatcherConfig(paramsWatch) {
			// Создаем настройки
			let configWatcher = {}
			// Родитель, внутри которого ведется наблюдение
			if (document.querySelector(paramsWatch.root)) {
				configWatcher.root = document.querySelector(paramsWatch.root);
			}
			// Отступ срабатывания
			configWatcher.rootMargin = paramsWatch.margin;
			
			// Точки срабатывания
			if (paramsWatch.threshold === 'prx') {
				// Режим параллакса
				paramsWatch.threshold = [];
				for (let i = 0; i <= 1.0; i += 0.005) {
					paramsWatch.threshold.push(i);
				}
			} else {
				paramsWatch.threshold = paramsWatch.threshold.split(',');
			}
			configWatcher.threshold = paramsWatch.threshold;

			return configWatcher;
		}
		// Функция создания нового наблюдателя со своими настройками
		scrollWatcherCreate(configWatcher) {
			this.observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					this.scrollWatcherCallback(entry, observer);
				});
			}, configWatcher);
		}
		// Функция инициализации наблюдателя со своими настройками
		scrollWatcherInit(items, configWatcher) {
			// Создание нового наблюдателя со своими настройками
			this.scrollWatcherCreate(configWatcher);
			// Передача наблюдателю элементов
			items.forEach(item => this.observer.observe(item));
		}
		// Функция обработки базовых действий точек срабатываения
		scrollWatcherIntersecting(entry, targetElement) {
			if (entry.isIntersecting) {
				// Видим объект
				// Добавляем класс
				!targetElement.classList.contains('_watcher-view') ? targetElement.classList.add('_watcher-view') : null;
			} else {
				// Не видим объект
				// Убираем класс
				targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
			}
		}
		// Функция отключения слежения за объектом
		scrollWatcherOff(targetElement, observer) {
			observer.unobserve(targetElement);
		}
		// Функция вывода в консоль
		
		// Функция обработки наблюдения
		scrollWatcherCallback(entry, observer) {
			const targetElement = entry.target;
			// Обработка базовых действий точек срабатываения
			this.scrollWatcherIntersecting(entry, targetElement);
			// Если есть атрибут data-watch-once убираем слежку
			targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
			// Создаем свое событие отбратной связи
			document.dispatchEvent(new CustomEvent("watcherCallback", {
				detail: {
					entry: entry
				}
			}));

			/*
			// Выбираем нужные объекты
			if (targetElement.dataset.watch === 'some value') {
				// пишем уникальную специфику
			}
			if (entry.isIntersecting) {
				// Видим объект
			} else {
				// Не видим объект
			}
			*/
		}
	}
	// Запускаем и добавляем в объект модулей
	watcher = new ScrollWatcher({});


		/* Перевірка мобільного браузера */
	let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
	/* Додавання класу touch для HTML, якщо браузер мобільний */
	 function addTouchClass() {
		// Додавання класу _touch для HTML, якщо браузер мобільний
		if (isMobile.any()) document.documentElement.classList.add('touch');
	}

	function customCursor(isShadowTrue) {
		const wrapper = document.querySelector('[data-custom-cursor]') ? document.querySelector('[data-custom-cursor]') : document.documentElement;
		if (wrapper && !isMobile.any()) {
			// Створюємо та додаємо об'єкт курсору
			const cursor = document.createElement('div');
			cursor.classList.add('fls-cursor');
			cursor.style.opacity = 0;
			cursor.insertAdjacentHTML('beforeend', `<span class="fls-cursor__pointer"></span>`);
			isShadowTrue ? cursor.insertAdjacentHTML('beforeend', `<span class="fls-cursor__shadow"></span>`) : null;
			wrapper.append(cursor);
	
			const cursorPointer = document.querySelector('.fls-cursor__pointer');
			const cursorPointerStyle = {
				width: cursorPointer.offsetWidth,
				height: cursorPointer.offsetHeight
			}
			let cursorShadow, cursorShadowStyle;
			if (isShadowTrue) {
				cursorShadow = document.querySelector('.fls-cursor__shadow');
				cursorShadowStyle = {
					width: cursorShadow.offsetWidth,
					height: cursorShadow.offsetHeight
				}
			}
			function mouseActions(e) {
				if (e.type === 'mouseout') {
					cursor.style.opacity = 0;
				} else if (e.type === 'mousemove') {
					cursor.style.removeProperty('opacity');
					if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || (window.getComputedStyle(e.target).cursor !== 'none' && window.getComputedStyle(e.target).cursor !== 'default')) {
						cursor.classList.add('_hover');
					} else {
						cursor.classList.remove('_hover');
					}
				} else if (e.type === 'mousedown') {
					cursor.classList.add('_active');
	
				} else if (e.type === 'mouseup') {
					cursor.classList.remove('_active');
				}
				cursorPointer ? cursorPointer.style.transform = `translate3d(${e.clientX - cursorPointerStyle.width / 2}px, ${e.clientY - cursorPointerStyle.height / 2}px, 0)` : null;
				cursorShadow ? cursorShadow.style.transform = `translate3d(${e.clientX - cursorShadowStyle.width / 2}px, ${e.clientY - cursorShadowStyle.height / 2}px, 0)` : null;
			}
	
			window.addEventListener('mouseup', mouseActions);
			window.addEventListener('mousedown', mouseActions);
			window.addEventListener('mousemove', mouseActions);
			window.addEventListener('mouseout', mouseActions);
		}
	}
	customCursor(true)
});
