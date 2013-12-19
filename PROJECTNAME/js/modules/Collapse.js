//  ---------------------------------------------------------------------------
//
//  Collapse plugin
//
//	There might be 1..n collapsibles targeted by one clickable element
//
//	Example with one clickable element opening/closing 2 different elements:
//	
//	HTML structure:
//	<div class="collapse-hd" data-collapse-target-group="plan" data-collapse-target-member="second_one">
//		Heading and icon go here
//	</div>
//	<div class="collapse-bd" data-collapse-group="plan">
//		<div class="collapse-inner">
//			Content goes here
//		</div>
//	</div>
//	<div class="collapse-bd" data-collapse-group="plan" data-collapse-member="second_one">
//		<div class="collapse-inner">
//			Content goes here
//		</div>
//	</div>
//
//  ---------------------------------------------------------------------------

	
	
// Module definition
define(["jquery"], function($){
	var collapser = {

		init: function()
		{
			var that = this;
			// Bind the click event listener
			$("[data-collapse-target-group]").click(function(oArgs){that.onclick.call(that, oArgs);});
			
		},

		onclick: function(e){
			//detect if we are a link, or not a selectable item
			var toggle = false;
			var open = false;



			_thisElem = $(e.target);
			if(!_thisElem.is("input"))
			{
				e.preventDefault();
				e.stopPropagation();
				toggle = true;
			}

			if(_thisElem.is("input")){
				switch(_thisElem.attr("type")){
					case "checkbox":
						open = (_thisElem.attr("checked") == "checked") ? true : false;
						
						break;
					case "select":
						
						open = (_thisElem.attr("selected") == "checked") ? true : false;
						
						break;
					case "radio":
						
						open = (_thisElem.attr("checked") == "checked") ? true : false;

						break;
					default :
						toggle = true;
				}
			}
			if(_thisElem.data("collapse-target-member") == "none"){ open = false}
			this.onAction(e, toggle, open);


		},



		onAction: function(e, toggle, open)
		{
			var that = this;
			

			// Check which elements are targeted by this collapse header
			// target = the group name of targeted collapsible elements
			var clickedElement = $(e.target).closest("[data-collapse-target-group]"),
				target = clickedElement.data("collapse-target-group"),
				targetMember = clickedElement.data("collapse-target-member");


			// Check whether the clicked element itself is not the element with
			// the data-collapse-target attribute set but is a child instead
			if(!target)
 			{
				alert("NO!")
				/// Find the closest parent element with the data-collapse-target attribute set
				//target = $(e.target).closest("[data-collapse-target-group]").data("collapse-target-group");
				//targetMember = $(e.target).closest("[data-collapse-target-group]").data("collapse-target-member");
 			}

			// collapseGroup = array containing all targeted elements
			var	collapseGroup = $("[data-collapse-group='" + target + "']");
			var exclusiveNotMembers = [];
			//if we have a member, filter out only the members
			if(targetMember){
				collapseGroup = [];
				$.each($("[data-collapse-group='" + target + "']"), function(index, collapseGroupMember){
					if($(collapseGroupMember).data("collapse-member") == targetMember){
						collapseGroup.push(collapseGroupMember);
					} else {
						exclusiveNotMembers.push(collapseGroupMember);
					}
				});
			}


			// Iterate through all the targeted collapsibles
			$.each(collapseGroup, function(i, el)
			{

				// bd 	    = the targeted element itself
				// margin   = the .collapse-inner margin which needs 
				// 			  to be accounted for to prevent jumping animation effects
				// height   = the height of .collapse-inner
				// icon     = holds the icon, in case there is one inside the clicked .collapse-hd

				var oArgs = {
					bd: $(el),
					height: $(el).find(".collapse-inner").height(),
					margin: parseInt($(el).find(".collapse-inner").css("margin-bottom"), 10),
					icon: clickedElement.find("[class*='icon-chevron-']"),
					clickedElement: clickedElement
				};

				// Sum margin and height if necessary
				if(!isNaN(oArgs.margin))
				{
					oArgs.height = oArgs.height + oArgs.margin;
				}

				if(toggle){
					// Body is collapsed
					if(oArgs.bd.height() === 0)
					{
						that.expand(oArgs);
					}

					// Body is not collapsed
					else
					{
						that.collapse(oArgs);

					}	
				}

				if(open){
					if(oArgs.bd.height() === 0){
						that.expand(oArgs);	
					}
				} else {
					if(oArgs.bd.height() != 0){
						that.collapse(oArgs);
					}
				}

				
			});


				// Iterate through all the targeted collapsibles
			$.each(exclusiveNotMembers, function(i, el)
			{

				// bd 	    = the targeted element itself
				// margin   = the .collapse-inner margin which needs 
				// 			  to be accounted for to prevent jumping animation effects
				// height   = the height of .collapse-inner
				// icon     = holds the icon, in case there is one inside the clicked .collapse-hd

				var oArgs = {
					bd: $(el),
					height: $(el).find(".collapse-inner").height(),
					margin: parseInt($(el).find(".collapse-inner").css("margin-bottom"), 10),
					icon: clickedElement.find("[class*='icon-chevron-']"),
					clickedElement: clickedElement
				};

				// Sum margin and height if necessary
				if(!isNaN(oArgs.margin))
				{
					oArgs.height = oArgs.height + oArgs.margin;
				}


				if(oArgs.bd.height() != 0){
					that.collapse(oArgs);
				}

				
			});



		},

		expand: function(oArgs){
			// Switch icons
						oArgs.icon.removeClass("icon-chevron-down");
						oArgs.icon.addClass("icon-chevron-up");
						oArgs.clickedElement.addClass("active");


						$("[data-validation-type]", oArgs.bd).each(function(_index, validationElem){
							$(validationElem).attr("collapsed", 0);
						});

						// CSS transitions available
						if(Modernizr.csstransitions)
						{
							// Open body
							// Add transition class and set the container height to expand to
							oArgs.bd.addClass("collapsing").css("height", oArgs.height + "px");

							// Attach a one time event listener to CSS transition end events
							oArgs.bd.one("transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd", function() 
								{
									// Remove the transition class when done and set height to auto to allow resizing, orientation change etc.
									oArgs.bd.removeClass("collapsing").css("height", "auto");
								}
							);
						}

						// Only JS animations available
						else
						{
							// Open body
							oArgs.bd.animate({"height": oArgs.height + "px"}, 300, function()
								{
									// Set height to auto to allow resizing, orientation change etc.
									oArgs.bd.css("height", "auto");
								});
						}
		},

		collapse: function(oArgs){
			// Switch icons
						oArgs.icon.removeClass("icon-chevron-up");
						oArgs.icon.addClass("icon-chevron-down");
						oArgs.bd.removeClass("is-expanded");

						// Set px height for proper transition to 0
						oArgs.bd.css("height", oArgs.height + "px");


						$("[data-validation-type]", oArgs.bd).each(function(_index, validationElem){
							$(validationElem).attr("collapsed", 1);
						});
						

						// CSS transitions available
						if(Modernizr.csstransitions)
						{
							// Close body
							// Allow some time to set the transition class
							setTimeout(
								function()
								{
									// Add transition class and collapse to 0
									oArgs.bd.addClass("collapsing").css("height", "0px");
								},
								50);

							// Attach a one time event listener to CSS transition end events
							oArgs.bd.one("transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd", function()
								{
									// Remove transition class when done
									oArgs.bd.removeClass("collapsing");
									oArgs.clickedElement.removeClass("active");
								}
							);
						}

						// Only JS animations available
						else
						{
							// Close body
							oArgs.bd.animate({"height": "0"}, 300, function()
							{
								oArgs.clickedElement.removeClass("active");
							});
						}
		}

	};

	return collapser;			

});
