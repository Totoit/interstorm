var casino_category = [];
var casino_name = "";
var live_casino = false;
var gameres = [];
var cat_pagesize = 6;
var nowpage = 1;
var maxpage = 1;
var totalGameCountAll = 0;

function createRows(gameCount) {
    var rows = gameCount / 10;
    rows = Math.ceil(rows);

    for (var k = 1; k <= rows; k++) {
        $('#game_cate_res').append('<div id="games-row-' + k + '" class="slider game-board game-screen slick-slider" style="display: none;"></div>');
    }

    setGameCateDataShow(1);
    if (maxpage > nowpage) {
        $('#loadmore_btn').show();
    }
}

function loadmoregame_show() {
    //console.log("nowpage=" + nowpage + " / max = " + maxpage);
    nowpage++;
    setGameCateDataShow(nowpage);
    $('.gamepage' + nowpage).show();
    if (nowpage >= maxpage) {
        $('#loadmore_btn').hide();
    }
}

function setGameCateDataShow(pagination) {
    // console.log("===setGameCateDataShow===",gameres);
    var numberRow = 5;
    var valuedata = {};
    if (live_casino) {
        valuedata.games = gameres.tables;
    } else {
        valuedata.games = gameres.games;
    }

    var template_base = '/static/handlebars/games/game_cat.hbs';
    var startpage = 0;
    var i = 1;
    var cr = 0;
    var callMakeSlick = 0;
    var lastRow = Math.ceil(totalGameCountAll / 10);
    var lastRowChild = totalGameCountAll % 10;
    if (totalGameCountAll < 5) {
        $('#games-row-1').show();
        $('#games-row-1').append('<div class="row"></div>');

        $.each(valuedata.games, function (index, value) {
            if (value != null) {
                value.rowcount = i;
                value.languagecode = c.language;
                value.row_no = Math.ceil(i / 10);
                $.get(template_base, function (html) {
                    var Template = Handlebars.compile(html);
                    limitData = $.extend({}, value, '');
                    var HTML = Template(limitData);
                    cr = Math.ceil(value.rowcount / 10);

                    $('#games-row-' + cr + '>.row').append(HTML);
                    $('#games-row-' + cr + ' .gamepage').css('margin-bottom', '10px');
                    $('#games-row-' + cr + ' .item').mouseover(function () {
                        $(this).find('.img').css('filter', 'brightness(0.5)');
                        $(this).find('.btn-game-info').show();
                    });

                    $('#games-row-' + cr + ' .item').mouseout(function () {
                        $(this).find('.img').css('filter', 'brightness(1)');
                        $(this).find('.btn-game-info').hide();
                    });
                });

                i++;
            }
        });
    } else {
        for (var j = ((pagination - 1) * 5) + 1; j <= pagination * numberRow; j++) {
            if (lastRow == j) {
                if (lastRowChild >= 5) {
                    settingSlick(j);
                }
            } else {
                settingSlick(j);
            }
        }

        $.each(valuedata.games, function (index, value) {
            if (value != null) {
                value.rowcount = i;
                value.languagecode = c.language;
                value.row_no = Math.ceil(i / 10);
                var cr2 = Math.ceil(value.rowcount / 10);

                if (cr2 > ((pagination - 1) * numberRow) && cr2 <= (pagination * numberRow)) {
                    $.get(template_base, function (html) {
                        var Template = Handlebars.compile(html);
                        limitData = $.extend({}, value, '');
                        var HTML = Template(limitData);
                        cr = Math.ceil(value.rowcount / 10);

                        if (lastRow == cr && lastRowChild < 5) {
                            cr = cr - 1;
                        }

                        $('#games-row-' + cr).slick('slickAdd', HTML);
                        $('#games-row-' + cr).css('margin-bottom', '25px');
                        $('#games-row-' + cr + ' .item').mouseover(function () {
                            $(this).find('.img').css('filter', 'brightness(0.5)');
                            $(this).find('.btn-game-info').show();
                        });

                        $('#games-row-' + cr + ' .item').mouseout(function () {
                            $(this).find('.img').css('filter', 'brightness(1)');
                            $(this).find('.btn-game-info').hide();
                        });
                    });
                }

                i++;
            }
        });
    }

    var template_base2 = '/static/handlebars/games/game_info.hbs';
    valuedata.languagecode = c.language;
    $.get(template_base2, function (html) {
        var Template2 = Handlebars.compile(html);
        limitData2 = $.extend({}, valuedata, '');
        console.log(limitData2);
        var HTML = Template2(limitData2);
        $("#game_cate_info").append(HTML);
    });

    setTimeout(function () {
        superImage();
        setTimeout(function () {
            $('#casino_game_category_box').show();
        }, 200);
    }, 400);

    setTimeout(function () {
        superImage();
        $('#casino_game_category_box').show();
    }, 1000);

    $('.loading').hide();
}

function settingSlick(rowSlick) {
    $('#games-row-' + rowSlick).css('display', 'inherit');
    $('#games-row-' + rowSlick).slick({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        prevArrow: '<button type="button" class="slick-prev"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;transform: rotate(-180deg);"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;"></button>',
        responsive: [{
            breakpoint: 4000,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
                infinite: false,
                dots: false
            }
        }, {
            breakpoint: 1920,
            settings: {
                slidesToShow: 4.5,
                slidesToScroll: 4,
                infinite: false,
                dots: false
            }
        }, {
            breakpoint: 800,
            settings: {
                slidesToShow: 3.5,
                slidesToScroll: 3,
                infinite: false,
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1.5,
                slidesToScroll: 1,
                infinite: false,
            }
        }]
    });
}

function getGameCategoryList(session) {
    maxpage = 1;
    var rpccall = "/casino#getGames";
    if (live_casino) {
        rpccall = "/casino#getLiveCasinoTables";
    }
    $('.loading').show();

    session.call(rpccall, [], {
        "filterByName": [],
        "filterBySlug": [],
        "filterByVendor": [],
        "filterByCategory": casino_category,
        "filterByTag": [],
        "filterByPlatform": getFilterByPlatform(),
        "filterByAttribute": {},
        "expectedFields": 129452998655,
        "specificExportFields": [],
        "expectedFormat": "map",
        "pageIndex": "1",
        "pageSize": "0",
        "sortFields": []
    }).then(function (result) {
        gameres = result.kwargs;
        totalGameCountAll = gameres.totalGameCount;
        maxpage = Math.ceil(gameres.totalGameCount / 50);
        createRows(gameres.totalGameCount);
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

    $('#casinoname').html(casino_name);
    c.doCall(getGameCategoryList);

});

function categoryGameInfo(game_name, rowcount) {
    $('#game_cate_res .game-info-data').remove();
    var html_info = $('#game-info-' + game_name + '').clone();

    $("#games-row-" + rowcount + "").after('<div style="width:100%;" class="blocksmooth"></div>');
    $("#games-row-" + rowcount + "").after(html_info);
    $("#games-row-" + rowcount + "").after('<div style="width:100%;" class="blocksmooth"></div>');

    $('#game_cate_res .game-info-data').show('slow', function () {
        $('.blocksmooth').remove();
    });
}
