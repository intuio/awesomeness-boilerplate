//  ---------------------------------------------------------------------------
//
//  Tab Accordion Controller
//
//  ---------------------------------------------------------------------------



// Module definition
define(["jquery"], function($)
{
    var TabAccController =
    {
        tabAccs:undefined,



        init: function()
        {
            $.fn.extend({
                tab2acc: function () {

                    //Main function
                    this.each(function () {
                        var $respTabs = $(this);

                        //Assigning the h2 markup
                        var $tabItemh2;
                        $respTabs.find('.tabs--acc__content').parent().before("<div class='tabs--acc__acc-item' data-tab-target-group='tab4-example' role='tab' data-collapse-target-group='acctabs'></div>");

                        var itemCount = 0;
                        $respTabs.find('.tabs--acc__acc-item').each(function () {
                            $tabItemh2 = $(this);
                            var innertext = $respTabs.find('.tabs--acc__strip-item:eq(' + itemCount + ')').text();
                            
                            if(!$respTabs.find('.tabs--acc__acc-item:eq(' + itemCount + ')').hasClass('disabled')) {
                                $respTabs.find('.tabs--acc__acc-item:eq(' + itemCount + ')').append('<a>' + innertext + '</a>');
                            }
                            
                            $tabItemh2.attr('widget-id', 'tab_item-' + (itemCount));

                            var dataTabTarget = $respTabs.find('.tabs--acc__strip-item:eq(' + itemCount + ')').attr('data-tab-target-member');
                            $respTabs.find('.tabs--acc__acc-item:eq(' + itemCount + ')').attr('data-tab-target-member',dataTabTarget);
                            $respTabs.find('.tabs--acc__acc-item:eq(' + itemCount + ')').attr('data-collapse-target-member',dataTabTarget);
                            itemCount++;
                        });

                        //Assigning the 'widget-id' to Tab items
                        var count = 0, $tabContent;
                        $respTabs.find('.tabs--acc__strip-item').each(function () {
                            $tabItem = $(this);
                            $tabItem.attr('widget-id', 'tab_item-' + (count));

                            //First active tab                   
                            $respTabs.find('.tabs--acc__strip-item').first().addClass('tabs--acc__strip-item--is-active');
                            $respTabs.find('.tabs--acc__acc-item').first().addClass('tabs--acc__acc-item--is-active');
                            $respTabs.find('.tabs--acc__content').first().addClass('is-shown');//.attr('style', 'display:block');

                           //Assigning the 'content-id' attr to tab-content
                            var tabcount = 0;
                            $respTabs.find('.tabs--acc__content').each(function () {
                                $tabContent = $(this);
                                $tabContent.attr('content-id', 'tab_item-' + (tabcount));
                                tabcount++;
                            });

                            count++;
                        });

                        //Tab Click action function
                        $respTabs.find("[role=tab]").each(function () {
 
                            //Window resize function                   
                            $(window).resize(function () {
                                $respTabs.find('.resp-accordion-closed').removeAttr('style');
                            });
                        });
                    });
                }
            });
    
            // Initialize plugin on desired element
            $('.js-tabs--acc').tab2acc();

            // Bind event listener
            this.listen();
        },

        listen: function()
        {
            var that = this;

            // Bind the click event listener
            $(".js-tabs--acc").click(function(oArgs){that.onclick.call(that, oArgs);});

        },

        onclick: function(e)
        {
            e.preventDefault();

            var parent                 = $(e.target).parent(),
                tabGroup               = parent.closest("[data-tab-group-parent]"),
                targetGroup            = parent.attr("data-tab-target-group"),
                targetMember           = parent.attr("data-tab-target-member"),
                toggle                 = tabGroup.find("[data-tab-toggle-text]"),

                tabEls      = $("[data-tab-target-group='" + targetGroup + "']"),
                groupEls    = $("[data-tab-group='" + targetGroup + "']"),
                targetEl    = $("[data-tab-member='" + targetMember + "']");

            // Iterate through all tab elements
            // and remove the active class
            $.each(tabEls, function(i, el)
            {
                var $el = $(el);

                if($el.hasClass("tabs--acc__strip-item--is-active"))
                {
                    $el.removeClass("tabs--acc__strip-item--is-active");
                }
            });

            // Add the active class to the 
            // clicked element

            var widgetID = parent.attr('widget-id');

            $.each(tabEls, function(i, el)
            {
                var $el = $(el);

                if($el.attr('widget-id')==widgetID)
                {
                    $el.addClass("tabs--acc__strip-item--is-active");
                }
            });

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

    return TabAccController;
});


//
// REVISION TAB-ACCORDION WIDGET
//

// Easy Responsive Tabs Plugin
// Author: Samson.Onna <Email : samson3d@gmail.com>

