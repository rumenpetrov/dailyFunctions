;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);

	window.Global = window.Global || {};

	/* ------------------------------------------------------------ *\
		#FUNCTION DEFINITIONS
	\* ------------------------------------------------------------ */

	/**
	 * Function that debounce certain event.
	 * 
	 * @public
	 * @param  {Function}
	 * @param  {int}
	 * @return {Function}
	 */
	Global.debounce = function(fun, wait) {
		var timeoutId = -1;

		function debounced() {
			if (typeof wait == 'undefined') { wait = 200; }
			if (timeoutId != -1) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(fun, wait);
		}

		return debounced;
	};

	/**
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
	 */
	Global.makeActiveInit = function() {
		var $triggers = $('[data-active-target]');

		// stop execution when elements does missing 
		if (!$triggers.length) {
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
	 * Hide function.
	 *
	 * Check if event's target matches given selectors or esc key is pressed.
	 * 
	 * @public
	 * @param  {event}
	 * @param  {string|Object}
	 * @return {void}
	 */
	Global.basicHide = function(evt, selector) {
		// stop execution when parameters are not valid
		if (typeof evt === 'undefined' || !$(selector).length) {
			console.error('basicHide: Invalid parameters!');
			return;
		}

		var $target = $(evt.target);

		if ((!$target.closest(selector).length) || (evt.keyCode == 27 /* esc key*/)) {
			$(selector).removeClass('isActive');
		}
	};

	/**
	 * Hide function.
	 *
	 * Check if event's target matches given selectors or esc key is pressed.
	 * 
	 * @public
	 * @param  {event}
	 * @param  {string|Object|Array} Requre only ID's
	 * @return {void}
	 */
	Global.practicalHide = function(evt, selector) {
		var $elements = $(selector);

		// stop execution when parameters are not valid
		if (typeof evt === 'undefined' || !$elements.length) {
			console.log('basicInteractionHide: Invalid parameters!');
			return;
		}

		var $target = $(evt.target);
		var evtType = evt.type;

		$elements.each(function(index, el) {
			var $element = $(el);

			if (evtType === 'keyup' && evt.keyCode === 27 /* esc key*/) {
				$element.removeClass('isActive');
			}

			if (evtType === 'click' || evtType === 'touchstart') {
				if (!$target.closest($element).length) {
					if ($element.hasClass('isActive')) {
						$element.removeClass('isActive');
					}
				}
			}
		});
	};

	/**
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
	Global.scrollToSelectorInit = function() {
		var $triggers = $('[data-scrollto]');
		var offsetTop = 0;

		// stop execution when element does not exist
		if (!$triggers.length) {
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
	 * Stick element to viewport.
	 *
	 * @public
	 * @param  {string|Object}
	 * @param  {string|Object}
	 * @param  {string|Object}
	 * @return {void}
	 *
	 * @TO DO: Transform function to use data attributes.
	 */
	Global.sticky = function(element, pivotTop, pivotBottom) {
		var $element = $(element);
		var $pivotTop = $(pivotTop);
		var $pivotBottom = $(pivotBottom);
		var offsetTop;
		var offsetBottom;
	
		// stop execution when parameters are not valid
		if ($element.length === 0 || $pivotTop.length === 0 || $pivotBottom.length === 0) {
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
	 * Tabs function.
	 * 
	 * @public
	 * @param  {string|Object}.
	 * @return {void}
	 * 
	 * @TO DO: Handle first tab select for multiple instances.
	 * @TO DO: Animate active tab.
	 * @TO DO: Transform function to use data attributes.
	 */
	Global.tabsInit = function(container) {
		var $container = $(container);
		var $tabsTriggers = $container.find('.jsTabsTrigger');
		var $tabsContents = $container.find('.jsTab');

		// stop execution when parameters are not valid
		if (!$container.length || !$tabsTriggers.length || !$tabsContents.length) {
			console.log('basicTabsInit: Invalid parameters!');
			return;
		}

		// handle active trigger
		function updateTriggers(targetID) {
			$tabsTriggers.removeClass('isActive');
			$tabsTriggers.each(function() {
				var	$that = $(this);

				if ($that.attr('href') === targetID) {
					$that.addClass('isActive');
				}
			});
		}

		// handle active tab
		function updateContents(targetID) {
			$tabsContents.removeClass('isActive');
			$tabsContents.each(function() {
				var	$that = $(this);

				if ($that.attr('id') === targetID.split('#')[1]) {
					$that.addClass('isActive');
				}
			});
		}

		// select first tab
		updateTriggers($($tabsTriggers[0]).attr('href'));
		updateContents($($tabsTriggers[0]).attr('href'));
		
		// switch between tabs
		$tabsTriggers.on('click', function(evt) {
			evt.preventDefault();

			var	href = $(this).attr('href');

			if (!$(this).hasClass('isActive')) {
				updateTriggers(href);
				updateContents(href);
			}
		});
	};

	/**
	 * Field's labels moving effect.
	 *
	 * Required:
	 * - 'data-blink-scope' - Get CSS style selector.
	 * 
	 * @private
	 * @return {void}
	 */
	var blinkFieldsInit = function() {
		var $inputs = $('[data-blink-scope]');
		var $currentElement;
		var scopeSelector;

		// stop execution when elements does missing 
		if (!$inputs.length) {
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
	 * Check if element is within the viewport.
	 *
	 * @private
	 * @param  {string|Object}
	 * @param  {bool} Default value true.
	 * @return {void}
	 *
	 * @TO DO: Transform function to use data attributes.
	 */
	var checkPosition = function(elements, removeClass) {
		// set default values
		removeClass = (typeof removeClass == 'undefined') ? true : removeClass;
		elements = (typeof elements == 'undefined') ? '.animate' : elements;
		
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
	 * Change image background on hover.
	 * 
	 * @return {void}
	 *
	 * @TO DO: Transform function to use data attributes.
	 */
	Global.imageChangerInit = function() {
		var $target = $('#jsImageChangerTarget');
		var $triggers = $('.jsImageChangerTrigger');

		// stop execution when parameters are not valid
		if (!$target.length || !$triggers.length) {
			console.log('imageChanger: Invalid parameters!');
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

	/* ------------------------------------------------------------ *\
		#EVENT BINDS
	\* ------------------------------------------------------------ */

	$doc.on('keyup', function(event) {
		// Global.practicalHide(event, ['.toggleHead', '.toggleBody']);
		Global.basicHide(event, '.toggleHead, .toggleBody');
	});

	$doc.on('click', function(event) {
		// Global.practicalHide(event, ['.toggleHead', '.toggleBody']);
		Global.basicHide(event, '.toggleHead, .toggleBody');
	});

	$doc.on('touchstart', function(event) {
		// Global.practicalHide(event, ['.toggleHead', '.toggleBody']);
		Global.basicHide(event, '.toggleHead, .toggleBody');
	});

	$doc.ready(function() {
		blinkFieldsInit();
	});

	$win.on('load', function() {

	});

	$win.on('resize', function() {
		// Global.debounce(myFunctionName)();
	});

	$win.on('scroll', function() {
		// Global.debounce(myFunctionName)();
	});
})(jQuery, window, document);