/**
 * Created by Aum on 8/14/2018.
 */
function getJackpots(session) {
    var payload = {
      "filterByPlatform": [],
      "expectedGameFields": 1106381
    };
    session.call("/casino#getJackpots", [], payload).then(function (result) {
        //console.log("==getJackpotWinners==",result.kwargs);
        setJackpotShow(result.kwargs.jackpots);
    });
}
function setJackpotShow(response) {

    $.each(response, function (index, value) {

        if (value != null) {
            var template_base = '/static/handlebars/dashboard/jackpot.hbs';
            //console.log(value);
            $.get(template_base, function (html) {

                var Template = Handlebars.compile(html);
                limitData = $.extend({}, value, '');
                Handlebars.registerHelper('trans', function (title) {
                    var t = gettext(title);
                    return t;
                });
                var HTML = Template(limitData);
                $("#jackpot_slider").slick('slickAdd',HTML);
                $('.CasinoJackpotsWidget .paginator').show();
            });
        }
    });
}
$(function () {
      c.doCall(getJackpots);
      $('.jackpot_slider').slick({
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: $('.prev_jackpot'),
        nextArrow: $('.next_jackpot'),
        responsive: [
              {
                breakpoint: 1280,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
        ]
      });
});
