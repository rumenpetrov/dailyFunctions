;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);

	window.Helpers = window.Helpers || {};

	/* ------------------------------------------------------------ *\
		#FUNCTION DEFINITIONS
	\* ------------------------------------------------------------ */

	/**
	 * [status: STABLE]
	 * 
	 * Debounce execution of a certain function.
	 *
	 * Example:
	 * Helpers.debounce(myFunctionName)();
	 * 
	 * @public
	 * @param  {Function}
	 * @param  {int}
	 * @return {Function}
	 */
	Helpers.debounce = function(fun, wait) {
		var timeoutId = -1;

		function debounced() {
			if (typeof wait == undefined) { wait = 200; }
			if (timeoutId != -1) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(fun, wait);
		}

		return debounced;
	};

	/**
	 * [status: BETA]
	 * 
	 * Get trigger, target and optionally scope elements and toggle classes on them.
	 *
	 * Required:
	 * - 'data-linker-target' - Get CSS style selector. Set the attribute to a target element.
	 *
	 * Optional:
	 * - 'data-linker-scope' - Get CSS style selector. Use it to work with multiple targets. 
	 *
	 * @public
	 * @return {Object} All public methods
	 *
	 * @TODO:
	 * - Testing.
	 */
	Helpers.linker = (function() {
		// define all elements
		options = {
			$currentTrigger: null,
			$currentTarget: null,
			$currentScope: null
		};

		function _init() {
			var $triggers = $('[data-linker-target]');

			// stop execution when elements does missing
			if (!$triggers.length) {
				return;	
			}

			// events
			$triggers.on('click', function() {
				_inputReader(this);
			});
		}

		// check for data attributes, get all elements and handle errors
		function _inputReader(element) {
			options.$currentTrigger = $(element);

			if (!options.$currentTrigger.data('linker-scope')) {
				options.$currentTarget = $(options.$currentTrigger.data('linker-target'));
				
				// handle missing target
				if (!options.$currentTarget.length) {
					console.error('linker: Missing target element!');
					return;
				}

				// handle multiple targets
				if (options.$currentTarget.length > 1) {
					console.error('linker: Detect multiple target elements. Require "data-linker-scope"!');
					return;
				}
			} else {
				options.$currentScope = options.$currentTrigger.closest(options.$currentTrigger.data('linker-scope'));
				options.$currentTarget = options.$currentScope.find(options.$currentTrigger.data('linker-target'));

				// handle missing scope
				if (!options.$currentScope.length) {
					console.error('linker: Missing scope element! Remove "data-linker-scope" attribute or add scope element!');
					return;
				}
			}

			_render();
		}

		// switch classes
		function _render() {
			if (options.$currentScope === null) {
				// toggle class on trigger and target element when scope is missing
				if (options.$currentTrigger.hasClass('has-flag')) {
					options.$currentTrigger.removeClass('has-flag');
					options.$currentTarget.removeClass('has-flag');
				} else {
					options.$currentTrigger.addClass('has-flag');
					options.$currentTarget.addClass('has-flag');
				}
			} else {
				// toggle class on scope element
				if (!options.$currentScope.length) {
					console.error('linker: Missing scope element! Check "data-linker-scope" attribute!');
					return;
				}
				if (options.$currentScope.hasClass('has-flag')) {
					options.$currentScope.removeClass('has-flag');
				} else {
					options.$currentScope.addClass('has-flag');
				}
			}
		}
		
		return {
			init: function() {
				_init();
			}
		};
	})();

	/**
	 * [status: STABLE]
	 * 
	 * Connects elements.
	 *
	 * Required:
	 * - 'data-active-target' - Get CSS style selector. Set the attribute to a target element.
	 *
	 * Optional:
	 * - 'data-active-scope' - Get CSS style selector. Use it to work with multiple targets. 
	 * 
	 * @public
	 * @return {void}
	 *
	 * @TODO:
	 * - Will be replaced with "Helpers.linker".
	 */
	Helpers.makeActiveInit = function() {
		var $triggers = $('[data-active-target]');

		// stop execution when elements does missing 
		if (!$triggers.length) {
			// console.error('makeActiveInit: Invalid parameters'));
			return;
		}

		$triggers.on('click', function() {
			var $currentElement = $(this);
			var $currentScope;
			var $currentTarget;
			
			if (!$currentElement.data('active-scope')) {
				$currentTarget = $($currentElement.data('active-target'));
				
				// handle missing target
				if (!$currentTarget.length) {
					console.error('makeActiveInit: Missing target element!');
					return;
				}

				// handle multiple targets
				if ($currentTarget.length > 1) {
					console.error('makeActiveInit: Detect multiple target elements. Require "data-active-scope"!');
					return;
				}
			} else {
				$currentScope = $currentElement.closest($currentElement.data('active-scope'));
				$currentTarget = $currentScope.find($currentElement.data('active-target'));

				// handle missing scope
				if (!$currentScope.length) {
					console.error('makeActiveInit: Missing scope element! Remove "data-active-scope" attribute or add scope element!');
					return;
				};
			}
			
			// switch classes
			if ($currentElement.hasClass('isActive')) {
				$currentElement.removeClass('isActive');	
				$currentTarget.removeClass('isActive');

				if ($currentElement.data('active-scope')) {
					if ($currentScope.length) {
						$currentScope.removeClass('isActive');
					}
				}
			} else {
				$currentElement.addClass('isActive');	
				$currentTarget.addClass('isActive');

				if ($currentElement.data('active-scope')) {
					if ($currentScope.length) {
						$currentScope.addClass('isActive');
					}
				}
			}
		});
	};

	/**
	 * [status: STABLE]
	 * Universal hide function. Check if event's target matches given selectors or esc key is pressed.
	 *
	 * Example:
	 * Helpers.basicHide(event, '.accordionItemHead, .accordionItemBody, .accordionItem');
	 * 
	 * @public
	 * @param  {event}
	 * @param  {string|Object}
	 * @return {void}
	 *
	 * @TODO:
	 * - Change active class name.
	 * - Add active class dynamically.
	 */
	Helpers.basicHide = function(evt, selector) {
		// stop execution when parameters are not valid
		if (typeof evt === undefined || !$(selector).length) {
			// console.error('basicHide: Invalid parameters!');
			return;
		}

		var $target = $(evt.target);

		if ((!$target.closest(selector).length) || (evt.keyCode == 27 /* esc key*/)) {
			$(selector).removeClass('isActive');
		}
	};

	/**
	 * [status: STABLE]
	 * 
	 * Scroll the window to element.
	 *
	 * Required:
	 * - 'data-scrollto' - Get only CSS style ID selector.
	 *
	 * Optional:
	 * -'data-scrollto-offset' - Get CSS style selector.
	 *
	 * @public
	 * @return {void}
	 */
	Helpers.scrollToSelectorInit = function() {
		var $triggers = $('[data-scrollto]');
		var offsetTop = 0;

		// stop execution when element does not exist
		if (!$triggers.length) {
			// console.error('scrollToSelectorInit: Invalid parameters!');
			return;
		}

		$triggers.on('click', function(evt) {
			evt.preventDefault();

			var $currentElement = $(this);
			var targetSelector = $(this).data('scrollto');
			var $target = $(targetSelector);

			if (parseInt($currentElement.data('scrollto-offset'))) {
				offsetTop = parseInt($currentElement.data('scrollto-offset'));
			}
			
			// stop execution when target does not exists
			if (!$target.length) {
				console.error('scrollToSelectorInit: Scroll target does not exist!');
				console.warn('Function gets CSS style selector');
				return;
			}
			
			// stop execution when multiple targets are present
			if ($target.length > 1) {
				console.error('scrollToSelectorInit: Multiple scroll targets detected!');
				return;
			}

			$('html, body').stop(true, true).animate({
				scrollTop: $target.offset().top-offsetTop
			}, 1000);
		});
	};

	/**
	 * [status: STABLE]
	 * 
	 * Tabs/Accordion.
	 * 
	 * Required:
	 * - 'data-tabs-trigger' - Set to all triggers. Need unique, random string to link with contents
	 * - 'data-tabs-content' - Set to each tab's content. Need unique, random string to link with triggers
	 *
	 * Optional:
	 * - 'data-tabs-scope' - Set to each trigger and tab's content. Need unique, random string to link with triggers
	 * 
	 * @public
	 * @return {void}
	 *
	 * @TODO:
	 * - Need refactoring
	 * - Change active classes names.
	 * - Add optional url change.
	 */
	Helpers.tabsInit = function() {
		var $tabsTriggers = $('[data-tabs-trigger]');
		var $tabsContents = $('[data-tabs-content]');

		// stop execution when parameters are not valid
		if (!$tabsTriggers.length || !$tabsContents.length) {
			console.error('tabsInit: Invalid parameters!');
			return;
		}

		// handle active triggers and tabs
		function show(id, scope) {
			if (scope === "" || scope === undefined || scope === false) {
				console.warn('tabsInit: Require "data-tabs-scope" attribute to handle multiple instances!', scope);

				$tabsTriggers.removeClass('isActive');
				$tabsContents.removeClass('isActive');
				
				for (var i = 0; i < $tabsTriggers.length; i++) {
					var $current = $($tabsTriggers[i]);

					if ($current.data('tabs-trigger') === id) {
						$current.addClass('isActive');
					}
				}

				for (var i = 0; i < $tabsContents.length; i++) {
					var $current = $($tabsContents[i]);

					if ($current.data('tabs-content') === id) {
						$current.addClass('isActive');
					}
				}
			} else {
				for (var i = 0; i < $tabsTriggers.length; i++) {
					var $current = $($tabsTriggers[i]);

					if ($current.data('tabs-scope') === scope) {
						$current.removeClass('isActive');
					}
					if ($current.data('tabs-trigger') === id && $current.data('tabs-scope') === scope) {
						$current.addClass('isActive');
					}
				}

				for (var i = 0; i < $tabsContents.length; i++) {
					var $current = $($tabsContents[i]);

					if ($current.data('tabs-scope') === scope) {
						$current.removeClass('isActive');
					}
					if ($current.data('tabs-content') === id && $current.data('tabs-scope') === scope) {
						$current.addClass('isActive');
					}
				}
			}
		}

		// switch between tabs
		$tabsTriggers.on('click', function(evt) {
			evt.preventDefault();

			var $this = $(this);
			var	id = $this.data('tabs-trigger');
			var	scope = $this.data('tabs-scope');

			if (!$this.hasClass('isActive')) {
				show(id, scope);
			}
		});
		
		// show active tabs after init
		$tabsTriggers.filter('.isActive').each(function() {
			var $this = $(this);

			show($this.data('tabs-trigger'), $this.data('tabs-scope'));
		});
	};

	/**
	 * [status: STABLE]
	 * 
	 * Field's labels moving effect.
	 *
	 * Required:
	 * - 'data-blink-scope' - Get CSS style selector.
	 * 
	 * @public
	 * @return {void}
	 *
	 * @TODO:
	 * - Change active class name.
	 */
	Helpers.blinkFieldsInit = function() {
		var $inputs = $('[data-blink-scope]');
		var $currentElement;
		var scopeSelector;

		// stop execution when elements does missing 
		if (!$inputs.length) {
			// console.error('blinkFieldsInit: Invalid parameters!');
			return;
		}

		function checkSelector(selector) {
			if (!$(selector).length) {
				console.error('blinkFieldsInit: Invalid scope selector! - "' + selector + '"');
				console.warn('Function gets CSS style selector');
				return;
			}
		}

		$inputs.each(function() {
			$currentElement = $(this);

			if ($currentElement.data('blink-scope')) {
				scopeSelector = $currentElement.data('blink-scope');
			}

			checkSelector(scopeSelector);
		
			if($currentElement.val()) {
				$currentElement.closest(scopeSelector).addClass('isActive');
			} else {
				$currentElement.closest(scopeSelector).removeClass('isActive');
			}
		});

		$inputs.on('focusin', function() {
			$currentElement = $(this);
			scopeSelector = $currentElement.data('blink-scope');

			checkSelector(scopeSelector);

			$currentElement.closest(scopeSelector).addClass('isActive');
		}).on('focusout', function() {
			$currentElement = $(this);
			scopeSelector = $currentElement.data('blink-scope');

			checkSelector(scopeSelector);

			if(!$currentElement.val()) {
				$currentElement.closest(scopeSelector).removeClass('isActive');
			}
		});
	};

	/**
	 * [status: STABLE]
	 * 
	 * Stick element to viewport.
	 *
	 * @public
	 * @param  {string|Object}
	 * @param  {string|Object}
	 * @param  {string|Object}
	 * @return {void}
	 *
	 * @TO DO:
	 * - Transform function to use data attributes.
	 * - Change window reference.
	 * - Change active classes names.
	 */
	Helpers.sticky = function(element, pivotTop, pivotBottom) {
		var $element = $(element);
		var $pivotTop = $(pivotTop);
		var $pivotBottom = $(pivotBottom);
		var offsetTop;
		var offsetBottom;
	
		// stop execution when parameters are not valid
		if (!$element.length || !$pivotTop.length || !$pivotBottom.length) {
			// console.log('sticky: Invalid parameters!');
			return;
		}

		// get pivot's offsets
		offsetTop = $pivotTop.offset().top;
		offsetBottom = $pivotBottom.offset().top;

		if ($win.scrollTop() > offsetTop) {
			$element.addClass('isSticky');
		} else {
			$element.removeClass('isSticky');
		}

		if ($win.scrollTop() > offsetBottom - $element.outerHeight()) {
			$element.addClass('hasBoundary');
		} else {
			$element.removeClass('hasBoundary');
		}
	};

	/**
	 * [status: STABLE]
	 * 
	 * Check if element is within the viewport.
	 *
	 * @public
	 * @param  {string|Object}
	 * @param  {bool} Default value true.
	 * @return {void}
	 *
	 * @TO DO:
	 * - Need refactoring.
	 * - Transform function to use data attributes.
	 * - Change window reference.
	 * - Change active class name.
	 */
	Helpers.checkPosition = function(elements, removeClass) {
		// set default values
		removeClass = (typeof removeClass == undefined) ? true : removeClass;
		elements = (typeof elements == undefined) ? '.animate' : elements;
		
		var $animationItems = $(elements);
		var winH = $win.height();
		var winTopPos = $win.scrollTop();
		var winBottomPos = (winTopPos + winH);

		$.each($animationItems, function() {
			var $element = $(this);
			var elementH = $element.outerHeight();
			var elementTopPos = $element.offset().top;
			var elementBottomPos = (elementTopPos + elementH);

			//check if this current container is within viewport
			if ((elementBottomPos >= winTopPos) && (elementTopPos <= winBottomPos)) {
				$element.addClass('isActive');
			} else {
				if (removeClass) {
					$element.removeClass('isActive');
				}
			}
		});
	};

	/**
	 * [status: STABLE]
	 * 
	 * Change image background on hover.
	 *
	 * @public
	 * @return {void}
	 *
	 * @TO DO:
	 * - Need refactoring.
	 * - Transform function to use data attributes.
	 */
	Helpers.photoChangerInit = function() {
		var $target = $('#jsPhotoChangerTarget');
		var $triggers = $('.jsPhotoChangerTrigger');

		// stop execution when parameters are not valid
		if (!$target.length || !$triggers.length) {
			console.error('photoChanger: Invalid parameters!');
			return;
		}

		function changeSource(src) {
			$target.css({
				'background-image': 'url(' + src + ')'
			});
		}

		changeSource($($triggers[0]).data('bg'));

		$triggers.on('mouseenter', function() {
			var $this = $(this);

			// stop execution when data-bg attribute missing or is not set
			if (!($this.attr('data-bg')) || !$this.data('bg').length) {
				console.log('Invalid \"data-bg\" attribute!');
				return;
			}

			changeSource($this.data('bg'));
		});
	};
})(jQuery, window, document);