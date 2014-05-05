//  ---------------------------------------------------------------------------
//
//  Scrolling Controller
//
//  ---------------------------------------------------------------------------

	
	
// Module definition
define(["jquery"], function($)
{
	var ScrollController = {

		init: function()
		{
			var that = this;

			// Bind the click event listener
			$("[data-scrollto]").click(function(oArgs){that.onclick.call(that, oArgs);});
			
		},

		onclick: function(e)
		{
			e.preventDefault();

			var newPos = $($(e.target).attr("href")).offset().top,
				navBar = $(".nav-bar"),
				singleSpace = parseInt($("body").css("line-height"), 10) / 2;

			if(navBar.css("position") === "fixed")
			{
				newPos -= navBar.height() + singleSpace;
			}
			else
			{
				newPos -= singleSpace;
			}

			$('html, body').stop().animate({ scrollTop: newPos }, { duration: 500 });
		}
	};

	return ScrollController;
});
