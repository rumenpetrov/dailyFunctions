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
	 * @public
	 * @param  {string|Object} Requre ID.
	 * @param  {string|Object} Requre ID.
	 * @param  {bool} Default value true.
	 * @return {void}
	 */
	Global.basicInteractionInit = function(trigger, related, prevent) {
		var $trigger = $(trigger);
		var $related = $(related);

		// stop execution when parameters are not valid
		if (!$trigger.length || !$related.length) {
			console.log('basicInteractionInit: Invalid parameters!');
			return;
		}

		// set default values
		prevent = (typeof prevent === 'undefined') ? true : prevent;

		$trigger.on('click', function(event) {
			if (prevent) event.preventDefault();

			if ($trigger.hasClass('isActive')) {
				$trigger.removeClass('isActive');
				$related.removeClass('isActive');
			} else {
				$trigger.addClass('isActive');
				$related.addClass('isActive');
			}
		});
	};

	/**
	 * Basic hide function.
	 *
	 * Check if event's target matches given selectors or esc key is pressed.
	 * 
	 * @public
	 * @param  {event}
	 * @param  {Array}
	 * @return {void}
	 */
	Global.basicInteractionHide = function(evt, selectors) {

		// stop execution when parameters are not valid
		if (typeof evt === 'undefined' || !$(selectors).length) {
			console.log('basicInteractionHide: Invalid parameters!');
			return;
		}

		var $target = $(evt.target);
		var evtType = evt.type;

		// filter events
		if (evtType === 'keyup' && evt.keyCode === 27 /* esc key*/) {
			for (var i = 0; i < selectors.length; i++) {
				$(selectors[i]).removeClass('isActive');
			}
		} 

		if (evtType === 'click' || evtType === 'touchstart') {
			for (var j = 0; j < selectors.length; j++) {
				if (!$target.closest(selectors[j]).length) {
					var $this = $(selectors[j]);
					
					if ($this.hasClass('isActive')) {
						console.log($target);
						
						$this.removeClass('isActive');
					}
				}
			}
		}
	};

	/**
	 * Scroll the window to selector from trigger's data-target attribute.
	 *
	 * @public
	 * @param  {string|Object}
	 * @param  {int} Default value 0.
	 * @return {void}
	 */
	Global.scrollToSelectorInit = function(trigger, offsetTop) {
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
	 * @param  {string|Object}
	 * @return {void}
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

	/**
	 * Change image background on hover.
	 * 
	 * @return {void}
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