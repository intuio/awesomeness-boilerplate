define(["jquery", "modernizr"], function($, Modernizr)
{
	var Grid = {

		grid:undefined,

		gridToggle:undefined,

		gridContainer:undefined,

		init: function()
		{
			this.grid = $("<div>").addClass("grid__container");
			this.gridToggle = $(".js-grid__toggle");
			this.gridContainer = $("body");

			Modernizr.touch ? this.listenTouch() : this.listenMouse();
		},

		listenMouse: function()
		{
			var that = this;

			this.gridToggle.on("click", function(e) { that.onclick.call( that, e );});
		},

		listenTouch: function()
		{
			
			var that = this;

			this.gridToggle.on("touchstart", function(e) { that.onclick.call( that, e );});
		},

		onclick: function(e)
		{
			e.preventDefault();
			e.stopPropagation();

			if(this.gridContainer.hasClass("grid--is-shown"))
			{
				this.hideGrid();
			}
			else
			{
				this.showGrid();
			}
		},

		showGrid: function()
		{
			this.gridContainer.append(this.grid);
			this.gridContainer.addClass("grid--is-shown");
		},

		hideGrid: function()
		{
			this.gridContainer.removeClass("grid--is-shown");
			this.grid.detach();
		}
	};

	// Return public functions
	return {

		init: function() { Grid.init(); },

		showGrid: function() { Grid.showGrid(); },

		hideGrid: function() { Grid.hideGrid(); }
	};
});