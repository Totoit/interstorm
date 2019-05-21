/**
 * Created by Aum on 6/8/2018.
 */
var casino_category = [];
var casino_name = "";
var live_casino = false;
var gameres = [];
var cat_pagesize = 6;
var nowpage = 1;
var maxpage = 1;
var totalGameCountAll = 0;

function createRows(gameCount){
  var rows = gameCount / 10;
  rows = Math.ceil(rows);
  console.log('rows',gameCount)
  for( var k = 1 ; k <= rows ; k++ ){
    $('#game_cate_res').append('<div id="games-row-'+k+'" class="slider game-board game-screen slick-slider" data-value="live-casino$'+slug+'" style="display: none;"></div>');
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
  var template_base = '/static/handlebars/games/lobby_cat.hbs';
  var startpage = 0;
  var i = 1;
  var cr = 0;
  var numberRow = 5;

  var lastRow = Math.ceil(totalGameCountAll / 10);
  var lastRowChild = totalGameCountAll % 10;
  
  if (totalGameCountAll < 5) {
    $('#games-row-1').show();
    $('#games-row-1').append('<div class="row"></div>');
    $.each(gameres.children, function(index, value) {
      if (value != null) {
        value.rowcount = i;
        value.languagecode = c.language;
        value.row_no = Math.ceil(i / 10);
        var template_hook = function(data) {
                return {games: data, languagecode: c.language};
              };
        $.get(template_base, function(html) {
          var Template = Handlebars.compile(html);
          limitData = $.extend({}, template_hook(value), '');
          var HTML = Template(limitData);
          cr = Math.ceil(value.rowcount / 10);
          $('#games-row-' + cr + '>.row').append(HTML);
          $('#games-row-' + cr + ' .gamepage').css('margin-bottom', '10px');
          $('#games-row-' + cr + ' .item').mouseover(function() {
            $(this).find('.img').css('filter', 'brightness(0.5)');
          });
          $('#games-row-' + cr + ' .item').mouseout(function() {
            $(this).find('.img').css('filter', 'brightness(1)');
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
    $.each(gameres.children, function(index, value) {
      if (value != null) {
        value.rowcount = i;
        value.languagecode = c.language;
        value.row_no = Math.ceil(i / 10);
        var cr2 = Math.ceil(value.rowcount / 10);
        var template_hook = function(data) {
          return {games: data, languagecode: c.language};
        };
        if (cr2 > ((pagination - 1) * numberRow) && cr2 <= (pagination * numberRow)) {
          $.get(template_base, function(html) {
            var Template = Handlebars.compile(html);
            limitData = $.extend({}, template_hook(value), '');
            var HTML = Template(limitData);
            cr = Math.ceil(value.rowcount / 10);
            if (lastRow == cr && lastRowChild < 5) {
              cr = cr - 1;
            }
            $('#games-row-' + cr).slick('slickAdd', HTML);
            $('#games-row-' + cr).css('margin-bottom', '25px');
            $('#games-row-' + cr + ' .item').mouseover(function() {
              $(this).find('.img').css('filter', 'brightness(0.5)');
            });
            $('#games-row-' + cr + ' .item').mouseout(function() {
              $(this).find('.img').css('filter', 'brightness(1)');
            });
          });
        }
        i++;
      }
    });
  }



  setTimeout(function () {
    superImage();
      setTimeout(function () {
        $('#casino_game_category_box').show();
      }, 200);
  }, 400);

  setTimeout(function () {superImage(); $('#casino_game_category_box').show();}, 1000);
  $('.loading').hide();
}

function settingSlick(rowSlick){
  console.log('rowslick',rowSlick);
  console.log('datas',$('#games-row-' + rowSlick));
  
  $('#games-row-' + rowSlick).css('display','inherit');
  $('#games-row-' + rowSlick).slick({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    prevArrow:'<button type="button" class="slick-prev"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;transform: rotate(-180deg);"></button>',
    nextArrow:'<button type="button" class="slick-next"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;"></button>',
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
  console.log('slickAf')
}


function getGameCategoryList(session) {
  maxpage = 1;
  var rpccall = "/casino#getCustomCategoryChildren";
  $('.loading').hide();
  // console.log('slug',slug);
  session.call("/casino#getCustomCategories", [], {
    "dataSourceName": "live-casino",
    // "categoryID": "live-casino$"+slug,
    "includeChildren": false,
    "filterByPlatform": getFilterByPlatform(),
    "expectedTableFields": 137438953471
  }).then(function(result) {
    $.each(result.kwargs.categories, function(index, value) {
      if(value.id == 'live-casino$'+slug ){
        if(value.localizedName){
          $('#casinoname').html(value.localizedName);
        }else{
            var regx_slug = slug.toString().replace(/-/g, ' ')
            var cate_name = regx_slug.toString().charAt(0).toUpperCase() + regx_slug.toString().slice(1);
          $('#casinoname').html(cate_name);
        }
      }
    });
  }).catch(function(err){
    console.log('err',err)
  });

  session.call(rpccall, [], {
    "dataSourceName": "live-casino",
    "categoryID": "live-casino$"+slug,
    "includeChildren": true,
    "filterByPlatform": getFilterByPlatform(),
    "expectedTableFields": 137438953471
  }).then(function(result) {
    // $('#casinoname').html(casino_name);
    // console.log('result',result)
    if(result){
      gameres = result.kwargs;
      console.log('gameres',gameres);
      totalGameCountAll = gameres.children.length;
      maxpage = (Math.ceil(totalGameCountAll / 50));
      createRows(totalGameCountAll);
    }

  }).catch(function(err){
    console.log('err',err)
  });
}
$(function() {
  c.doCall(getGameCategoryList);
});

