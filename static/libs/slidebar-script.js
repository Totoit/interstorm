(function ($) {
    // Create a new instance of Slidebars
    var controller = new slidebars();

    // Initialize Slidebars
    controller.init();

    //Left Slidebar controls
    $('.js-toggle-left-slidebar').on('click', function (event) {
        event.stopPropagation();

            controller.toggle('mobile-slidebar');

    });

    // close
    $(controller.events).on('opened', function () {
        //console.log('Menu Open '+controller.events);
        $('[canvas="mobile-container"]').addClass('js-close-any-slidebar');
        $('html,body').css({'position':'static','overflow-y':'hidden','-webkit-overflow-scrolling':'auto'});
    });

    $(controller.events).on('closed', function () {
        //console.log('Menu Close '+controller.events);
        $('[canvas="mobile-container"]').removeClass('js-close-any-slidebar');
         $('html,body').css({'position':'static','overflow-y':'auto','-webkit-overflow-scrolling':'touch'});
    });

    $('body').on('click', '.js-close-any-slidebar', function (event) {
        event.stopPropagation();
        controller.close();
    });

    /*
    $(".carousel-main").owlCarousel({

        autoPlay: 10000, //Set AutoPlay to 3 seconds
        items : 2,
        itemsDesktop : [1199,3],
        itemsDesktopSmall : [979,3]

    });*/

    $(window).bind("pageshow", function(event) {
        if (event.originalEvent.persisted) {
            window.location.reload();
        }
    });

})(jQuery);