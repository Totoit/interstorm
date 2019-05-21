var allGames = [];
var slideCount = 0;
var $Template = null;

function getGameForWinner(session) {
    var rpccall = "/casino#getGames";

    session.call(rpccall, [], {
        // "filterByCategory": ['VideoSlots', 'JackpotGames', 'ClassicSlots', 'MiniGames', 'Lottery', 'VideoPokers', 'TableGames', 'ScratchCards'],
        "filterByCategory": ['VideoSlots', 'ClassicSlots', 'TableGames'],
        "filterByPlatform": getFilterByPlatform(),
        "expectedFields": 129452998655,
    }).then(function (result) {
        // console.log('%cGames::', 'color:orange', result.kwargs.games);
        allGames = result.kwargs.games;
        c.doCall(getWinners);
    });

    // readGamesOnfile('allGames', function (result) {
    //     console.log('%cGames::', 'color:orange', result.kwargs.games);

    //     allGames = $.extend(allGames, result.kwargs.games);
    //     c.doCall(getWinners);
    // });
}

function getWinners(session) {
    var payload = {
        "filterByPlatform": [],
        "expectedGameFields": 1048585
    };

    session.call("/casino#getRecentWinners", [], payload).then(function (result) {
        // console.log('%cgetRecentWinners::', 'color:orange',result.kwargs);
        setWinnerShow(result.kwargs.winners);
    });
}

function setWinnerShow(response) {
    var $listContainer = $("#latest-winners");
    var $value = response.shift();
    var $addWinner = function(options) {
        var limitData = $.extend({}, options, '');
        Handlebars.registerHelper('trans', function (title) {
            var t = gettext(title);
            return t;
        });

        var HTML = $Template(limitData);
        
        if(limitData.logo) {
            // var gameLogo = new Image();
            // gameLogo.onload = function() {
                $listContainer.slick('slickAdd', HTML);
                
                if(slideCount > 2) 
                $listContainer.slick('slickNext');
                
                slideCount++;
            // }

            // gameLogo.src = limitData.logo;
        }
    }

    if ($value != null) {
        var template_base = '/static/handlebars/dashboard/winner.hbs';
        var $thumbnail = allGames.find(function(obj) {
            return obj.slug == $value.game.slug;
        });

        // console.log('%cWinner::', 'color:orange', $value);
        
        if($thumbnail) {
            $value['logo'] = $thumbnail.logo;
            $value['thumbnail'] = $thumbnail.thumbnail;

            // console.log('%cAdd recent winner::', 'color:orange', $thumbnail);
        } else {
            setWinnerShow(response);

            return true;
        }

        $value['currency_symbol'] = getSymbol($value.currency);
        
        if($Template) {
            $addWinner($value);
        }else{
            $.get(template_base, function (html) {
                $('.lds-ellipsis').remove();

                $Template = Handlebars.compile(html);
                $addWinner($value);
            });
        }
    }

    if(response.length) {
        setTimeout(() => {
            setWinnerShow(response);
        }, 2500);
    }else{
        setTimeout(() => {
            c.doCall(getWinners);
        }, 5000);
    }
}

$(function () {
    // c.doCall(getGameForWinner);

    $("#latest-winners").slick({
        autoplay: true,
        dots: false,
        infinite: true,
        vertical: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
    });
});
