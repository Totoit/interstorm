/**
 * Created by Aum on 8/14/2018.
 */
function getJackpots(session) {
    var payload = {
        "filterByPlatform": [],
        "expectedGameFields": 1106381
    };

    session.call("/casino#getJackpots", [], payload).then(function (result) {
        console.log(result);
        setJackpotShow(result.kwargs.jackpots);
    });
}

function setJackpotShow(response) {
    $.each(response, function (index, value) {

        if (value != null) {
            var template_base = '/static/handlebars/dashboard/game_slider.hbs';
            //console.log(value);
            $.get(template_base, function (html) {

                var Template = Handlebars.compile(html);
                limitData = $.extend({}, value, '');
                Handlebars.registerHelper('trans', function (title) {
                    var t = gettext(title);
                    return t;
                });

                var HTML = Template(limitData);
                $('.game-slider').slick('slickAdd', HTML);
            });
        }
    });
}

$(function () {

    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }

        return options.inverse(this);
    });

    if (slug == 'latest-slots') {
        casino_category = [];
        casino_name = "LATEST SLOTS";
    } else if (slug == 'video-slots') {
        casino_category = ["VIDEOSLOTS"];
        casino_name = "VIDEO SLOTS";
    } else if (slug == 'table-games') {
        casino_category = ["TABLEGAMES"];
        casino_name = "TABLE GAMES";
    } else if (slug == 'classic-slots') {
        casino_category = ["CLASSICSLOTS"];
        casino_name = "CLASSIC SLOTS";
    } else if (slug == 'video-pokers') {
        casino_category = ["VIDEOPOKERS"];
        casino_name = "VIDEOPOKERS";
    } else if (slug == 'other-games') {
        casino_category = ["OTHERGAMES"];
        casino_name = "OTHER GAMES";
    } else if (slug == 'roulette') {
        casino_category = ["ROULETTE"];
        casino_name = "ROULETTE";
        live_casino = true;
    } else if (slug == 'blackjack') {
        casino_category = ["BLACKJACK"];
        casino_name = "BLACKJACK";
        live_casino = true;
    } else if (slug == 'baccarat') {
        casino_category = ["BACCARAT"];
        casino_name = "BACCARAT";
        live_casino = true;
    }

    c.doCall(getJackpots);
    $('.game-slider').slick({
        autoplay: true,
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: '<a href="javascript: void(0)" class="slick-prev"></a>',
        nextArrow: '<a href="javascript: void(0)" class="slick-next"></a>',
        responsive: [
            {
                breakpoint: 2400,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
});
