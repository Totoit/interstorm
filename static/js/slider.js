jQuery(function () {
    jQuery('.game-slide').slick({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow:'<button type="button" class="slick-prev"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;transform: rotate(-180deg);"></button>',
        nextArrow:'<button type="button" class="slick-next"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;"></button>',
        responsive: [
            {
                breakpoint: 2400,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
            breakpoint: 1920,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                infinite: false,
                dots: false
            }
        }, {
            breakpoint: 800,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: false,
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: false,
            }
        }]
    });
});

$(document).ready(function(){
    $( "body" ).on( "click", ".slick-next", function() {
        if($('.slick-next').hasClass('slick-disabled')){
            $(this).prev().css('margin-left','4px');;
        }
    });

    $( "body" ).on( "click", ".slick-prev", function() {
        if($('.slick-next').not('.slick-disabled')){
            $(this).next().css('margin-left','0px');
        }
    });
});