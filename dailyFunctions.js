;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);

	window.Global = window.Global || {};

	/* ------------------------------------------------------------ *\
		#FUNCTION DEFINITIONS
	\* ------------------------------------------------------------ */

	// debounce event function
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

	Global.stickyMap = function(element, placeholder) {
		var $element = $(element);
		
		if ($element.length === 0) return;

		var $placeholder = $(placeholder);
		var offset = $placeholder.offset().top - $('#jsHeader').outerHeight();

		if ($win.scrollTop() > offset) {
			$element.addClass('isActive');
			$placeholder.css({
				'height': $element.outerHeight()
			});
		}
		else {
			$element.removeClass('isActive');
			$placeholder.css({
				'height': 0
			});
		}
	};

	// plugin isMobile - detect device and browser
	var detectDevice = function() {
		var isTouch = isMobile.any;
		var isIE = /*@cc_on!@*/false || !!document.documentMode; // detect IE browser
		console.log(isTouch ? "This is mobile device!" : "This is desktop device!");
		$('html').addClass(isTouch ? 'hasTouch' : 'noTouch');
	};

	// calc viewport min height
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

	// get container and trigger and toggle class to container
	var basicInteractionInit = function(container, trigger, prevent) {
		var $container = $(container);
		var $trigger = $(trigger);

		// set default values
		prevent = (typeof prevent == 'undefined') ? true : prevent;

		$trigger.on('click', function(event) {
			if (prevent) {
				event.preventDefault();
				event.stopPropagation();
			}

			$trigger.toggleClass('isActive');
			$container.toggleClass('isActive');
		});
	};

	// basic hide - get event and selectors to check
	var basicInteractionHide = function(event, selectors) {
		var ev = event || window.event;
		var $target = $(ev.target);

		if ((!$target.closest(selectors).length) || (event.keyCode == 27 /* esc key*/)) {
			$(selectors).removeClass('isActive');
		}
	};

	// accordion
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

	// tabs
	var basicTabsInit = function($tabsNav, $tabs) {
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

	// field labels moving effect
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

	// show hidden sections
	var collapseSectionShow = function($trigger) {
		var selector = $trigger.parents('.collapseTrigger').data('collapse-selector');

		$(selector).show();
		$(selector).addClass('isVisible');
	};

	// hide sections
	var collapseSectionHide = function($trigger) {
		var selector = $trigger.parents('.collapseTrigger').data('collapse-selector');

		$(selector).hide();
		$(selector).removeClass('isVisible');
	};

	// plugin colorbox - add colorbox to text editor links that has linked image
	var editorGalleryInit = function() {
		$(".article").find('a:not([class])').each(function (i, el) {
			var hrefValue = el.href;

			if (/\.(jpg|png|gif|jpeg)$/.test(hrefValue)) {
				$(el).addClass('editorPhoto');

				$(el).colorbox({
					rel:'editorPhoto',
					transition:	"elastic",
					arrowKey: true,
					maxWidth: '90%',
					maxHeight: '90%'
				});
			}
		});
	};

	// sticky header
	var stickyHeader = function() {
		var $header = $('#jsHeader');
		var $headerPlaceholder = $('#jsHeaderPlaceholder');

		if ($win.scrollTop() > 0) {
			$header.addClass('isActive');
			$headerPlaceholder.css({
				'height': $header.outerHeight()
			});
		}
		else {
			$header.removeClass('isActive');
			$headerPlaceholder.css({
				'height': 0
			});
		}
	};
	
	// check if element is within the viewport 
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

	// scroll to element id - get jq obj and int
	var scrollAnimation = function(element, topOffset) {
		// set default values
		topOffset = (typeof topOffset == 'undefined') ? 0 : topOffset;

		$(element).on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var href = $(this).attr('data-href');

			$('html, body').stop(true, true).animate({
				scrollTop: $(href).offset().top-topOffset
			}, 1000);
		});
	};

	/* ------------------------------------------------------------ *\
		#EVENT BINDS
	\* ------------------------------------------------------------ */

	$doc.on('keyup', function(event) {});

	$doc.on('click', function(event) {});

	$doc.on('touchstart', function(event) {});

	$doc.on('ready', function(event) {});

	$win.on('resize', function() {
		// Global.debounce(myFunctionName)();
	});

	$win.on('scroll', function() {
		// Global.debounce(myFunctionName)();
	});
})(jQuery, window, document);