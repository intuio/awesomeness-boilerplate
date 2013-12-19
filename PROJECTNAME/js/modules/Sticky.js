//  ---------------------------------------------------------------------------
//
//  Sticky Controller
//
//  ---------------------------------------------------------------------------

	
	
// Module definition
define(["jquery"], function($)
{
	var StickyController = {

		// All sticky elements
		stickies: {},

		// The top offset of fixed
		// positioned elements. Adds 
		// some top margin to the element
		// and accounts for a fixed navigation
		// bar, if necessary
		topOffset: 0,

		// The minimum window width for 
		// which fixed positioning is 
		// allowed. Is used to exclude
		// stickyness of elements on small
		// devices
		minWidth:0,

		init: function(minWidth)
		{
			this.minWidth = minWidth;

			// The top margin of fixed elements is
			// the base line-height, which in our case
			// is half the body line-height
			this.topOffset = parseInt($("body").css("line-height"), 10) / 2;

			// Check if there is a fixed navigation bar
			// and adjust the top offset accordingly
			if($(".nav-bar").css("position") == "fixed")
			{
				this.topOffset += $(".nav-bar").height();
			}

			var that = this;

			// Cache all sticky elements
			// inside a custom object
			$.each($("[data-sticky]"), function(i, sticky)
			{
				that.stickies[i] 	    = {};
				that.stickies[i]["el"]  = $(sticky);
				that.stickies[i]["pos"] = $(sticky).position().top - that.topOffset;
			});

			// Attach event listeners
			this.listen();

			// Execute event callback once
			// because the page might have been
			// loaded with a certain scroll position
			this.onscroll();
		},

		listen: function()
		{
			var that = this;

			// Bind the scroll event listener
			$(window).scroll(function(oArgs){ that.onscroll.call(that, oArgs); });
			$(window).resize(function(oArgs){ that.update.call(that, oArgs); });
		},

		// The scroll callback function simply
		// checks the scroll position and compares 
		// it to the top position of all sticky elements.
		// If the scroll position is higher than the top
		// position of a sticky element, it gets position fixed.
		onscroll: function(e)
		{
			// Do nothing in case the window
			// is not large enough to allow stickyness
			if(this.minWidth > $(window).width())
			{
				return;
			}

			var that = this;

			$.each(that.stickies, function(i, sticky)
			{
				// The scroll position is higher than
				// the top position of the sticky element
				if($(window).scrollTop() >= sticky.pos)
				{
					// Since per default the sticky element has width: auto, 
					// it is necessary to set the current width explicitly.
					// Otherwise the element would collapse or expand, given 
					// that the parent is no longer the width reference due
					// to position: fixed
					sticky.el.css({ position: "fixed", top: that.topOffset, width: sticky.el.outerWidth(true) });
				}
				else
				{
					// Reset the position and width properties
					sticky.el.css({ position: "static", width: "auto" });	
				}
			});
		},

		// The resize callback function is supposed
		// to do more work than the scroll callback.
		// Not only must the scroll position be compared
		// to the top positions of all sticky elements,
		// but also the changing width of the parent 
		// container is important, as the sticky element 
		// must grow or shrink its width accordingly.
		update: function(e)
		{
			var that = this;

			$.each(that.stickies, function(i, sticky)
			{
				// The parent of the sticky element
				// is needed as a reference object.
				// Otherwise it would be impossible
				// to determine the actual top position
				// of the sticky element which might
				// have changed. Also, the parent
				// inner width is the width for the
				// sticky element.
				var parent = sticky.el.parent(),
					parentInnerWidth = parent.innerWidth(),
					parentTopPos = parent.position().top;
				
				// Reset positioning and width, if the
				// window has become too narrow and
				// go to next element to reset that too.
				if(that.minWidth > $(window).width())
				{
					sticky.el.css({ position: "static", width: "auto" });
					return true; // Same as 'continue', jumps immediatly to next iteration
				}

				// Set the new width
				sticky.el.width(parentInnerWidth);

				// Recalculate the top position of 
				// the sticky element
				sticky.pos = parentTopPos - that.topOffset;

				// There is a fixed nav-bar
				if($(".nav-bar").css("position") == "fixed")
				{
					// Set the suitable top offset value: margin + nav-bar height
					that.topOffset = parseInt($("body").css("line-height"), 10) / 2 + $(".nav-bar").height();
				}
				else
				{
					// Set the suitable top offset value: margin
					that.topOffset = parseInt($("body").css("line-height"), 10) / 2;	
				}
			});

			// Execute the scroll callback
			// function to set the position
			// and width for all stickies.
			this.onscroll();
		}
	};

	return StickyController;			
});























