//  ---------------------------------------------------------------------------
//
//  Appearance Controller plugin
//
//	Let's an element appear on screen with a fancy animation. Used for elements like overlay menus, alert boxes etc. 
//
//	Example with one clickable element showing the hidden element:
//	
//	HTML structure:
//	<a href="#" data-appearance-target-group="appearance-example">Jump to …</a>
//	<div data-appearance-group="appearance-example">
//		Content goes here
//	</div>
//  ---------------------------------------------------------------------------

	
	
// Module definition
define(["jquery", "modernizr", "requestanimationframe"], function($, Modernizr)
{

	var EntryController = {

		entryToggles:undefined,

		eventType:undefined,

		overlay:undefined,

		init: function()
		{
			this.overlay = $("<div>");
			this.overlay.addClass("entry__overlay");
			$("body").append(this.overlay);

			this.eventType = Modernizr.touch ? "touchstart" : "click";
			this.entryToggles = $(".js-entry__toggle");
			this.listen();
		},

		listen: function()
		{
			this.overlay.on("touchmove", function(e){ e.preventDefault(); });
			this.entryToggles.on(this.eventType, { entryController:this }, this.onclick);
		},

		onclick:function(e)
		{
			e.preventDefault();
			
			var $target  = $(this.hash);

			if($target.hasClass("entry--is-shown"))
			{
				e.data.entryController.hideTarget($target);
			}
			else
			{
				e.data.entryController.showTarget($target);
			}
		},

		hideTarget:function(el)
		{
			var that = this;

			window.requestAnimationFrame(function()
			{
				el.removeClass("entry--is-shown");
				that.overlay.removeClass("entry--is-shown");
			});

			el.one("transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd", function(e)
			{
				el.css({ display:"none" });
			});
		},

		showTarget:function(el)
		{
			var that = this;

			el.css({ display:"block" });

			window.requestAnimationFrame(function()
			{
				el.addClass("entry--is-shown");
				that.overlay.addClass("entry--is-shown");
			});
		}
	};

	return EntryController;

});
	