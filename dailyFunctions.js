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
	 * Basic toggle function.
	 * 
	 * @private
	 * @param  {string|object}
	 * @param  {string|object}
	 * @param  {bool}
	 * @return {void}
	 */
	var basicInteractionInit = function(container, trigger, prevent) {
		var $container = $(container);
		var $trigger = $(trigger);

		// stop execution when parameters are not valid
		if (!$container.length || !$trigger.length) {
			console.log('basicInteractionInit: Invalid parameters!');
			return;
		}

		// set default values
		prevent = (typeof prevent === 'undefined') ? true : prevent;

		$trigger.on('click', function(event) {
			if (prevent) event.preventDefault();

			if ($trigger.hasClass('isActive')) {
				$trigger.removeClass('isActive');
				$container.removeClass('isActive');
			} else {
				$trigger.addClass('isActive');
				$container.addClass('isActive');
			}
		});
	};

	/**
	 * Basic hide function.
	 *
	 * Check if event's target matches given selectors or esc key is pressed.
	 * 
	 * @private
	 * @param  {event}
	 * @param  {string|Object}
	 * @return {void}
	 */
	var basicInteractionHide = function(event, selectorsString) {
		var evt = event || window.event;
		var $target = $(evt.target);

		// stop execution when parameters are not valid
		if (typeof event === 'undefined' || !$(selectorsString).length) {
			console.log('basicInteractionHide: Invalid parameters!');
			return;
		}

		if ((!$target.closest(selectorsString).length) || (event.keyCode == 27 /* esc key*/)) {
			$(selectorsString).removeClass('isActive');
		}
	};

	/**
	 * Field's labels moving effect.
	 *
	 * @private
	 * @return {void}
	 */
	var blinkFieldsInit = function() {
		var $inputs = $('.field').find('input, textarea');

		$inputs.each(function() {
			if($(this).val()) {
				$(this).closest('.field').addClass('isActive');
			} else {
				$(this).closest('.field').removeClass('isActive');
			}
		});

		$inputs.on('focusin', function() {
			$(this).closest('.field').addClass('isActive');
		}).on('focusout', function() {
			if(!$(this).val()) {
				$(this).closest('.field').removeClass('isActive');
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
	 * Scroll the window to selector from trigger's data-target attribute.
	 *
	 * @private
	 * @param  {string|object}
	 * @param  {int} Default value 0.
	 * @return {void}
	 */
	var scrollToSelectorInit = function(trigger, offsetTop) {
		var $trigger = $(trigger);

		// stop execution when element does not exist
		if (!$trigger.length) {
			console.log('Scroll trigger does not exist!');
			return;
		}

		// set default values
		offsetTop = (typeof offsetTop === 'undefined') ? 0 : offsetTop;

		$trigger.on('click', function(event) {
			event.preventDefault();

			var $target = $($(this).data('target'));

			// stop execution when target does not exists
			if (!$target.length) {
				console.log('Scroll target does not exist!');
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
	 * @return {void}
	 */
	Global.sticky = function(element, pivot) {
		var $element = $(element);
	
		// stop execution when parameters are not valid
		if ($element.length === 0) return;

		var $pivot = $(pivot);
		var offset = $pivot.offset().top - $('#jsHeader').outerHeight();

		if ($win.scrollTop() > offset) {
			$element.addClass('isActive');
			$pivot.css({
				'height': $element.outerHeight()
			});
		}
		else {
			$element.removeClass('isActive');
			$pivot.css({
				'height': 0
			});
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
		$tabsTriggers.on('click', function(event) {
			event.preventDefault();

			var	href = $(this).attr('href');

			if (!$(this).hasClass('isActive')) {
				updateTriggers(href);
				updateContents(href);
			}
		});
	};

	/**
	 * Simple Accordion.
	 *
	 * @private
	 * @param  {string|Object}
	 * @param  {string|Object}
	 * @param  {string|Object}
	 * @return {void}
	 */
	var basicAccordionInit = function(container, items, trigger) {
		var $container = $(container);
		var $trigger = $(trigger);
		var $items = $(items);
		var $current;

		$trigger.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			$current = $(this).parents().first();

			if (!($current.hasClass('isActive'))) {
				$items.removeClass('isActive');
				$current.addClass('isActive');
			} else {
				$items.removeClass('isActive');
			}
		});
	};

	/**
	 * Simple tabs.
	 *
	 * @private
	 * @param  {string|Object}
	 * @param  {string|Object}
	 * @return {[type]}
	 */
	var basicTabsInit = function(tabsNav, tabs) {
		var $tabsNav = $(tabsNav);
		var $tabs = $(tabs);

		$tabs.not(':first-child').hide();
		$tabsNav.find('li:first-child').addClass('selected');
		
		$tabsNav.on('click', 'a', function(event) {
			var $this = $(this),
				$parent = $this.parent(),
				href = $this.attr('href');

			if (!$parent.hasClass('selected')) {
				$parent.addClass('selected');
				$parent.siblings().removeClass('selected');
				$tabs.filter(href).fadeIn(300).siblings().hide();
				// $tabs.filter(href).show().siblings().hide();
			}
			event.preventDefault();
		});
	}

	/**
	 * Calculates viewport's min height.
	 *
	 * @private
	 * @return {void}
	 */
	var calcViewport = function() {
		var $wrap = $('#jsContainer');
		var $shell = $wrap.find('#jsShell');
		var shellH = 0;

		// exclude elements height, border, padding and margin
		function calcShellExcludes() {
			var $elements = $('.jsShellExclude');
			var total = 0;

			$elements.each(function() {
				if ($(this).is(":visible")) {
					total += $(this).outerHeight(true);
				}
			});

			return total;
		}

		shellH = $win.height() - calcShellExcludes() - parseInt($shell.css('padding-top')) - parseInt($shell.css('padding-bottom'));

		$wrap.css({
			'min-height': $win.height()
		});

		if (shellH > 0) {
			$shell.css({
				'min-height': shellH
			});
		}
	};

	/* ------------------------------------------------------------ *\
		#EVENT BINDS
	\* ------------------------------------------------------------ */

	$doc.on('keyup', function(event) {});

	$doc.on('click', function(event) {});

	$doc.on('touchstart', function(event) {});

	$doc.ready(function() {});

	$win.on('resize', function() {
		// Global.debounce(myFunctionName)();
	});

	$win.on('scroll', function() {
		// Global.debounce(myFunctionName)();
	});
})(jQuery, window, document);