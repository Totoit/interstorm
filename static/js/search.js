var categories = [];
var search_payload = [];
var searchParam = {
  "filterByName": [],
  "filterByID": [],
  "filterByVendor": [],
  "filterByCategory": [],
  "filterByTag": [],
  "filterByPlatform": [],
  "filterByAttribute": {},
  "expectedFields": 137438953471,
  "specificExportFields": [],
  "expectedFormat": "map",
  "sortFields": []
}


$(function () {
  c.doCall(getVendors);
  c.doCall(Searchcatagory);

  var searchTimeout;
  var searchTimeoutPopup;

  $('.go-game-search').on('click', function (e) {
    $('#loading-prcess').show();

    var category;
    var appendId = $(this).attr('box-id');
    var vendor = $('#'+appendId).find('.vendor-section select').val();
    var text_input = $('#'+appendId).find('.game-search-name').val(); 
    category = $(this).attr('category');

    console.log('--- appendId ---> '+appendId);
    e.stopImmediatePropagation();
    clearTimeout(searchTimeout);

    if (text_input != '') {
      searchParam.filterByName = [text_input];
    } 
    if(vendor != ''){
      searchParam.filterByVendor = [vendor];
    }
    if(category != ''){
      searchParam.filterByCategory = [category];
    }

    searchParam.filterByPlatform = getFilterByPlatform();
    searchTimeout = setTimeout(function () {
      $('.search-box').slick('removeSlide', null, null, true);
        SearchgetGames(searchParam, function (HTML) {
          $('#'+appendId+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+HTML+'</div>');
          removeHiddenGame(appendId);
          $('#loading-prcess').hide();
        });
    }, 500);
  });

  $('.go-game-search-popup').on('click', function (e) {
    $('#loading-prcess').show();

    var category;
    var appendId = $(this).attr('box-id');
    var vendor = $('#'+appendId).find('.vendor-section select').val();
    var text_input = $('#'+appendId).find('.game-search-name').val(); 

    category = $('#'+appendId).find('.category-section select').val(); 
    appendId = 'game-select-Box';

    console.log('--- appendId ---> '+appendId);
    e.stopImmediatePropagation();
    clearTimeout(searchTimeoutPopup);

    if (text_input != '') {
      searchParam.filterByName = [text_input];
    } 
    if(vendor != ''){
      searchParam.filterByVendor = [vendor];
    }
    if(category != ''){
      searchParam.filterByCategory = [category];
    }

    searchParam.filterByPlatform = getFilterByPlatform();
    searchTimeoutPopup = setTimeout(function () {
      $('.search-box').slick('removeSlide', null, null, true);
        SearchgetGamesPopup(searchParam, function (HTML) {
          $('#'+appendId+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+HTML+'</div>');
          removeHiddenGame(appendId);
          $('#loading-prcess').hide();
        });
    }, 500);
  });

  $('.game-search-name').keyup(function(e){
    if(e.keyCode == 13){

      $('#loading-prcess').show();

      var appendId = $(this).attr('box-id');
      var vendor = $('#'+appendId).find('.vendor-section select').val();
      var text_input = $('#'+appendId).find('.game-search-name').val();
      var category = $(this).attr('category');
    
      e.stopImmediatePropagation();
      clearTimeout(searchTimeout);

      if (text_input != '') {
        searchParam.filterByName = [text_input];
      } 
      if(vendor != ''){
        searchParam.filterByVendor = [vendor];
      }
      searchParam.filterByPlatform = getFilterByPlatform();
      searchParam.filterByCategory = [category];
      console.log('!! searchParam !!',searchParam);

      searchTimeout = setTimeout(function () {
        $('.search-box').slick('removeSlide', null, null, true);

        SearchgetGames(searchParam, function (HTML) {
          $('#'+appendId+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+HTML+'</div>');
          removeHiddenGame(appendId);
          $('#loading-prcess').hide();
        });
      }, 500);
    }
  });

  if (window.location.href.indexOf('live_casino') != -1) {
    var table_id = "";
    GetLiveCasino(table_id);
  }

  $('.game_filter').on('click', function () {
    init_filter($(this).children().data("value"));
  });
  $('.livecasino_filter').on('click', function () {
    init_livefilter($(this).children().data("value"));
  });


  Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
});

function getSearchInfo(parameters, callback) {
  var defaults = {
    "expectedFields": 129452998655
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };

  defaults = $.extend({}, defaults, device);

  var template_base = '/static/handlebars/games/';
  var payload;
  template_names = template_base + 'search_info.hbs';
  var template_hook = function (data) {
    return { games: data.kwargs.games, languagecode: c.language };
  };

  if (typeof parameters == 'undefined') {
    payload = defaults;
  } else {
    payload = $.extend({}, defaults, parameters);
  }
  c.doCall(function (session) {

    payload_store = payload;

    session.call('/casino#getGames', [], payload).then(function (result) {
      $.get(template_names, function (html) {
        var data = template_hook(result);
        var Template = Handlebars.compile(html);

        //CHK img
        Handlebars.registerHelper('if', function (conditional, options) {
          if (conditional !== undefined && conditional != "") {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        });
        //
        gameHTML = Template(data);
        if (callback) {
          callback(gameHTML)
        }
      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}




function searchVenders(vender){
  // $('.loading').show();
  var defaults = {
    "expectedFields": 129452998655
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var search_payload;
  template_names = template_base + 'search.hbs';
  var template_hook = function (data) {
    return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
  };
  if (typeof parameters == 'undefined') {
    search_payload = defaults;
  } else {
    search_payload = $.extend({}, defaults, parameters);
  }
  $('.title-search').html('<h4></h4>');
  $('.search-box').slick('removeSlide', null, null, true);
  search_payload = {
    "filterByName": [],
    "filterBySlug": [],
    "filterByVendor": [
      vender
    ],
    "filterByCategory": [],
    "filterByTag": [],
    "filterByPlatform": [],
    "filterByAttribute": {},
    "expectedFields": 129452998655,
    "specificExportFields": [],
    "expectedFormat": "map",
    "pageIndex": "1",
    "pageSize": "8",
    "sortFields": []
  }

  Handlebars.registerHelper('trans', function(txt, sty) {
    var t = gettext(txt);

    switch (sty) {
        case 'title':
            return t.replace(/(^|\s)\S/g, function (l) {
                return l.toUpperCase();
            });

        case 'upper':
            return t.toUpperCase();

        case 'lower':
            return t.toLowerCase();

        default:
            return t;
    }
  });

  c.doCall(function (session) {
    payload_store = search_payload;
    session.call('/casino#getGames', [], payload_store).then(function (result) {
      if (result.kwargs.totalGameCount == 0) {
        $('.title-search').html('<h4>' + gettext('LANG_JS_SEARCH_RESULT') + ':' + gettext('LANG_JS_NOT_FOUND') + '</h4>');
      } else {
        $('.title-search').html('<h4>' + gettext('LANG_JS_SEARCH_RESULT') + '</h4>');
      }
      $.get(template_names, function (html) {
        var data = template_hook(result);
        var Template = Handlebars.compile(html);
        Handlebars.registerHelper('if', function (conditional, options) {
          if (conditional !== undefined && conditional != "") {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        });
        gameHTML = Template(data);
        $('.search-box').slick('slickAdd', gameHTML);
        superImage();
        getSearchInfo(search_payload, function (HTML) {
          $('.game-info-search').html(HTML);
        });
        $('.section-search').show();
        $('.search-box').show();
        // $('.loading').hide();
      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}


function Searchcatagory(session) {
  parameters = [];
  session.call("/casino#getGameCategories").then(function (result) {
    categories = result.kwargs.categories;
  });
}

function getVendors(session) {
  parameters = [];
  session.call("/casino#getGameVendors").then(function (result) {
    vendors = result.kwargs.vendors;
    // $('.ListVender').append($("<li>").text(value));
    $.each(vendors, function (key, value) {
      if (value != "") {
        $('.ListVender').append($("<li>").text(value));
      }
    })
    // listener
    $('.ListVender').children().on('click',function(){
      var vender = $(this).text();
      console.log(vender);
      searchVenders(vender);
    });
  });
}

function GetLiveCasino(ID) {
  searchParam = {
    "filterByID": [],
    "filterByVendor": [],
    "filterByCategory": [],
    "filterByTag": [],
    "filterByPlatform": [],
    "filterByAttribute": {},
    "expectedFields": 137438953471,
    "specificExportFields": [],
    "expectedFormat": "map",
    "pageIndex": "",
    "pageSize": "0",
    "sortFields": []
  }
  if (ID != "" && ID != undefined) {
    searchParam.filterByID = [ID];
  }
  searchParam.filterByPlatform = getFilterByPlatform();
  search_payload = searchParam;
  setTimeout(function () {
    $('.search-box').slick('removeSlide', null, null, true);
    getSearchLiveCasino(search_payload, function (HTML) {
      $('.search-box').slick('slickAdd', HTML);
      superImage()
      $('.title-search').html('<h4>LIVE CASINO LOBBIES</h4>');
    });
  }, 2000);
}

function SearchgetGames(parameters, callback) {
  var defaults = {
    "expectedFields": 129452998655
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var search_payload;

  template_names = template_base + 'search.hbs';

  var template_hook = function (data) {
    return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
  };
  if (typeof parameters == 'undefined') {
    search_payload = defaults;
  } else {
    search_payload = $.extend({}, defaults, parameters);
  }
  console.log('Search parameters ===>',parameters);
  c.doCall(function (session) {
    payload_store = search_payload;
    // console.log('!! payload_store',payload_store);
    session.call('/casino#getGames', [], payload_store).then(function (result) {
      console.log('<< SearchgetGames >> ',result);

      $.get(template_names, function (html) {
        var data = template_hook(result);
        var Template = Handlebars.compile(html);
        //CHK imgimg
        Handlebars.registerHelper('if', function (conditional, options) {
          if (conditional !== undefined && conditional != "") {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        });
        gameHTML = Template(data);
        if (callback) {
          callback(gameHTML)
        }
      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}

function SearchgetGamesPopup(parameters, callback) {
  var defaults = {
    "expectedFields": 129452998655
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };

  defaults = $.extend({}, defaults, device);
  var search_payload;
  var template_names = 'https://aurumstage.s3.amazonaws.com/static/handlebars/games/select_game.hbs';

  var template_hook = function (data) {
    return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
  };

  if (typeof parameters == 'undefined') {
    search_payload = defaults;
  } else {
    search_payload = $.extend({}, defaults, parameters);
  }
  console.log('Search parameters ===>',parameters);

  Handlebars.registerHelper('trans', function(txt, sty) {
    var t = gettext(txt);

    switch (sty) {
        case 'title':
            return t.replace(/(^|\s)\S/g, function (l) {
                return l.toUpperCase();
            });

        case 'upper':
            return t.toUpperCase();

        case 'lower':
            return t.toLowerCase();

        default:
            return t;
    }
  });

  c.doCall(function (session) {
    payload_store = search_payload;
    // console.log('!! payload_store',payload_store);
    session.call('/casino#getGames', [], payload_store).then(function (result) {
      console.log('<< SearchgetGames >> ',result);
      $.get(template_names, function (html) {
        var data = template_hook(result);
        var Template = Handlebars.compile(html);
        //CHK imgimg
        Handlebars.registerHelper('if', function (conditional, options) {
          if (conditional !== undefined && conditional != "") {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        });
        gameHTML = Template(data);
        if (callback) {
          callback(gameHTML)
        }
      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}

function getSearchLiveCasino(parameters, callback) {
  var defaults = {
    "expectedFields": 137438953471
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var search_payload;
  template_names = template_base + 'search_live.hbs';
  var template_hook = function (data) {
    // main parameter
    return { tables: data.kwargs.tables, languagecode: c.language };
  };
  if (typeof parameters == 'undefined') {
    search_payload = defaults;
  } else {
    search_payload = $.extend({}, defaults, parameters);
  }
  // "/casino#getLiveCasinoTables"
  c.doCall(function (session) {
    session.call('/casino#getLiveCasinoTables', [], search_payload).then(function (result) {
      $.get(template_names, function (html) {
        var data = template_hook(result);
        var Template = Handlebars.compile(html);
        //CHK img
        Handlebars.registerHelper('if', function (conditional, options) {
          if (conditional !== undefined && conditional != "") {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        });
        gameHTML = Template(data);
        if (callback) {
          callback(gameHTML)
        }
      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}

function search_showInfo(id, main) {
  $('#game-show-info-' + id).closest('.game-board').find('.item.hovered').removeClass('hovered');
  $('#game-show-info-' + id).children('.item').addClass('hovered');
  $('div[id^=search-info-]').hide();
  $('div[id^=game-info-]').hide();
  $('#search-info-' + id).show('slow');
}

function search_closeInfo(data) {
  $('#game-info-' + data).hide();
  $('#search-info-' + data).hide();
  $('#game-info-' + data).closest('.game-info').prev().closest('.game-board').find('.item.hovered').removeClass('hovered');
}

// filter function
function init_filter(Category) {
  // $('.loading').show();
  searchParam.filterByName = [];
  searchParam.filterByPlatform = getFilterByPlatform();
  if (Category == "ALL" || Category == "LASTEST") {
    searchParam.sortFields = [
      {
        "field": 1024,
        "order": "DESC"
      }
    ]
    searchParam.filterByCategory = [];
  } else {
    searchParam.filterByCategory = [Category];
  }
  search_payload = searchParam;

  $('.search-box').slick('removeSlide', null, null, true);
  SearchgetGames(search_payload, function (HTML) {
    setTimeout(function () {
      $('.search-box').slick('slickAdd', HTML);
      superImage();
      $('.title-search').html('<h4>' + Category + '</h4>');
      getSearchInfo(payload, function (HTML) {
        $('.game-info-search').html(HTML);
        // $('.loading').hide();
      });
    }, 1000);
  });
}
// live filter function
function init_livefilter(Category) {
  // $('.loading').show();
  searchParam.filterByName = [];
  searchParam.filterByPlatform = getFilterByPlatform();
  if (Category == "" || Category == "ALL") {
    searchParam.filterByCategory = [];
  } else {
    searchParam.filterByCategory = [Category];
  }
  search_payload = searchParam;
  $('.search-box').slick('removeSlide', null, null, true);
  getSearchLiveCasino(search_payload, function (HTML) {
    setTimeout(function () {
      $('.search-box').slick('slickAdd', HTML);
      superImage();
      $('.title-search').html('<h4>' + Category + '</h4>');
      getSearchInfo(payload, function (HTML) {
        $('.game-info-search').html(HTML);
        // $('.loading').hide();
      });
    }, 1000);
  });
}
