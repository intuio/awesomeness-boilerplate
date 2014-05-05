//  ---------------------------------------------------------------------------
//
//  Tab Controller
//
//  ---------------------------------------------------------------------------

	
	
// Module definition
define(["jquery"], function($)
{
	var TabController = {

		init: function()
		{
			var that = this;

			// Bind the click event listener
			$("[data-tab-target-group]").click(function(oArgs){that.onclick.call(that, oArgs);});
			
		},

		onclick: function(e)
		{
			e.preventDefault();

			var parent	 	 		   = $(e.target).parent(),
				tabGroup 	 		   = parent.closest("[data-tab-group-parent]"),
				targetGroup  		   = parent.attr("data-tab-target-group"),
				targetMember 		   = parent.attr("data-tab-target-member"),
				toggle		 		   = tabGroup.find("[data-tab-toggle-text]"),

				tabEls		= $("[data-tab-target-group='" + targetGroup + "']"),
				groupEls	= $("[data-tab-group='" + targetGroup + "']"),
				targetEl	= $("[data-tab-member='" + targetMember + "']");


			// Iterate through all tab elements
			// and remove the active class
			$.each(tabEls, function(i, el)
			{
				var $el = $(el);

				if($el.hasClass("tabs__nav-item--is-active"))
				{
					$el.removeClass("tabs__nav-item--is-active").addClass("tabs__nav-item");
				}
				else if($el.hasClass("tabs--nested__nav-item--is-active"))
				{
					$el.removeClass("tabs--nested__nav-item--is-active").addClass("tabs--nested__nav-item");	
				}
			});

			// Add the active class to the 
			// parent of the clicked element
			if(parent.hasClass("tabs__nav-item"))
			{
				parent.addClass("tabs__nav-item--is-active");
			}
			else if(parent.hasClass("tabs--nested__nav-item"))
			{
				parent.addClass("tabs--nested__nav-item--is-active");
			}

			// Iterate through all ta panes
			// and remove the is-shown class
			$.each(groupEls, function(i, el)
			{
				$(el).removeClass("is-shown");
			});

			// Add the .is-shown class to the
			// tab pane which is targeted by 
			// the clicked tab element
			targetEl.addClass("is-shown");

			// Switch the tab toggle text
			toggle.text($(e.target).text());
		}
	};

	return TabController;
});
