
//The build will inline common dependencies into this file.
requirejs.config(
{
	paths:
	{
		// Libraries
		'jquery'					: '../js/vendor/jquery-1.10.2',
		'modernizr'					: '../js/vendor/modernizr',
		'prism'						: '../js/vendor/prism',
		'selectivizr'				: '../js/vendor/customized/selectivizr',
		'requestanimationframe'		: '../js/vendor/customized/requestAnimationFrame',

		// Custom modules
		'collapse'					: '../js/modules/Collapse',
		'tabcontroller'				: '../js/modules/Tabs',
		'tabacccontroller'			: '../js/modules/Tabs2Accordion',
		'scrollcontroller'			: '../js/modules/Scroll',
		'stickycontroller'			: '../js/modules/Sticky',
		'flyoutcontroller'			: '../js/modules/Flyout',
		'entrycontroller'			: '../js/modules/Entry',
		'gridcontroller'			: '../js/modules/Grid',
		'dropdown'					: '../js/modules/Dropdown',
		'slider'					: '../js/modules/Slider'
	},

	shim:
	{
		// Since it's not require-jquery.js
		// we need to shim it.
		'jquery':
		{
			exports: '$'
		},

		'modernizr':
		{
			exports: 'Modernizr'
		},

		'prism':
		{
			exports: 'Prism'
		}
	}
});

require(["jquery", "modernizr", "selectivizr", "prism"], function($, Modernizr, Selectivizr, Prism)
{
	// Add this event listener to prevent mobile safari 
	// from disabling the ::active pseudo class
	$(document).on("touchstart", function() {});

	// Initialize code highlighting
	Prism.highlightAll();

	// Check if we need Selectivizr
	if (!Modernizr.mq('only all'))
	{
		var slvzr = new Selectivizr();
		slvzr.startup();
	}

	if (!Modernizr.csstransitions) {
		$("body").addClass("no-toggle-menu");
	}
	
	// test for boxsizing
	// developer.mozilla.org/en/CSS/box-sizing
	// github.com/Modernizr/Modernizr/issues/248
	Modernizr.addTest("boxsizing", Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7));
				
});