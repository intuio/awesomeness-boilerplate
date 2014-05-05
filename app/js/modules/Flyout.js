define(["jquery", "modernizr", "requestanimationframe"], function($, Modernizr)
{
	var Flyout = {

		flyout:undefined,

		flyoutToggle:undefined,

		flyoutNav:undefined,

		flyoutContent:undefined,

		sidebarToggle:undefined,

		init: function()
		{
			this.flyout = $(".js-flyout");
			this.flyoutToggle = $(".js-flyout__toggle");
			this.sidebarToggle = $(".js-sidebar__toggle");
			this.flyoutNav = $(".js-flyout__nav");
			this.flyoutContent = $(".js-flyout__content");

			Modernizr.touch ? this.listenTouch() : this.listenMouse();
		},

		listenMouse: function()
		{
			var that = this;

			this.flyoutToggle.on("click", function(e) { that.onclick.call( that, e );});
			this.flyoutContent.on("click", function(e) { if(that.flyout.hasClass("flyout--is-open")) that.hideFlyout.call(that); });

			if(this.sidebarToggle.length > 0)
			{
				this.sidebarToggle.on("click", function(e)
				{
					e.preventDefault();
					e.stopPropagation();

					if(that.flyout.hasClass("sidebar--is-hidden"))
					{
						that.showSidebar.call(that);
					}
					else
					{
						that.hideSidebar.call(that);
					}
				});
			}
		},

		listenTouch: function()
		{
			var that = this;

			this.flyoutToggle.on("touchstart", function(e)
			{
				that.onclick.call( that, e );

			}).on("touchmove", function(e)
			{
				e.preventDefault();
				e.stopPropagation();

			}).on("touchend", function(e)
			{
				e.preventDefault();
				e.stopPropagation();
			});

			this.flyoutContent.on("touchstart", function(e)
			{
				if(that.flyout.hasClass("flyout--is-open")) that.hideFlyout.call(that);

			}).on("touchmove", function(e)
			{
				if(that.flyout.hasClass("flyout--is-open"))
				{
					e.preventDefault();
					e.stopPropagation();
				}

			}).on("touchend", function(e)
			{
				if(that.flyout.hasClass("flyout--is-open"))
				{
					e.preventDefault();
					e.stopPropagation();
				}
			});

			if(this.sidebarToggle.length > 0)
			{
				this.sidebarToggle.on("touchstart", function(e)
				{
					e.preventDefault();
					e.stopPropagation();

					if(that.flyout.hasClass("sidebar--is-hidden"))
					{
						that.showSidebar.call(that);
					}
					else
					{
						that.hideSidebar.call(that);
					}
				}).on("touchmove", function(e)
				{
					if(that.flyout.hasClass("flyout--is-open"))
					{
						e.preventDefault();
						e.stopPropagation();
					}

				}).on("touchend", function(e)
				{
					if(that.flyout.hasClass("flyout--is-open"))
					{
						e.preventDefault();
						e.stopPropagation();
					}
				});
			}
		},

		onclick: function(e)
		{
			e.preventDefault();
			e.stopPropagation();

			if(!this.flyout.hasClass("flyout--is-open"))
			{
				this.showFlyout();
			}
			else
			{
				this.hideFlyout();
			}
		},

		showFlyout: function()
		{
			this.flyout.addClass("flyout--is-open");
		},

		hideFlyout: function()
		{
			this.flyout.removeClass("flyout--is-open");
		},

		showSidebar: function()
		{
			this.flyout.removeClass("sidebar--is-hidden");
		},

		hideSidebar: function()
		{
			this.flyout.addClass("sidebar--is-hidden");
		}
	};

	// Return public functions
	return {

		init: function() { Flyout.init(); },

		showFlyout: function() { Flyout.showFlyout(); },

		hideFlyout: function() { Flyout.hideFlyout(); },

		showSidebar: function() { Flyout.showSidebar(); },

		hideSidebar: function() { Flyout.hideSidebar(); }
	};
});