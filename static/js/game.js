// START new functions updated by Kitja 11-12-2018

// function superGames(parameters,category) {
//   // $('.loading').show();

//   var pageIdBox = category+'-Box';
//   var defaults = {
//     "expectedFields": 129452998655
//   };
//   var device = {
//     "filterByPlatform": getFilterByPlatform()
//   };
//   defaults = $.extend({}, defaults, device);
//   var template_base = '/static/handlebars/games/';
//   var template_name = template_base + 'games.hbs';
//   var payload;
//   var template_hook = function (data) {
//     return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
//   };
//   if (typeof parameters == 'undefined') {
//     payload = defaults;
//   } else {
//     payload = $.extend({}, defaults, parameters);
//   }
//   c.doCall(function (session) {
//     // start get all games
//     session.call('/casino#getGames', [], payload).then(function (result) {
//       // console.log('payload all games :', payload);
//       console.log('all games result:', result);
//       $.get(template_name, function (html) {
//         var data = template_hook(result);
//         var Template = Handlebars.compile(html);
//         gameHTML = Template(data);
//         $('#'+pageIdBox+' #pills-4 .game-body').html('<div class="game-screen" data-value="'+category+'">'+gameHTML+'</div>');
//         superImage();
//         removeHiddenGame('pills-4');

//       }, 'html');
//     }, function (err) {
//       console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
//     });
//     // end get all games

//     // start get popular games
//     var pop_payload = {
//       "filterByName": [],
//       "filterBySlug": [],
//       "filterByVendor": [],
//       "filterByCategory": [category],
//       "filterByTag": [],
//       "filterByPlatform": getFilterByPlatform(),
//       "filterByAttribute": {},
//       "expectedFields": 129452998655,
//       "specificExportFields": [],
//       "expectedFormat": "map",
//       "pageIndex": "",
//       "pageSize": "16",
//       "sortFields": [
//           {
//             "field": 1024,
//             "order": "DESC"
//           }
//       ]
//     };
//     session.call('/casino#getGames', [], pop_payload).then(function (result) {
//       // console.log('payload popular games :', pop_payload);
//       // console.log('popular games result',result);
//       $.get(template_name, function (html) {
//         var data = template_hook(result);
//         var Template = Handlebars.compile(html);
//         gameHTML = Template(data);
//         // console.log('gameHTML:', gameHTML);
//         // console.log('pageIdBox: '+pageIdBox);
//         $('#'+pageIdBox+' #pills-1 .game-body').html('<div class="game-screen" data-value="'+category+'">'+gameHTML+'</div>');
//         superImage();
//         removeHiddenGame('home-pop-slot');


//       }, 'html');
//     }, function (err) {
//       console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
//     });
//     // end get popular games

//     // start get new games
//     var new_payload = {
//       "filterByName": [],
//       "filterBySlug": [],
//       "filterByVendor": [],
//       "filterByCategory": [category],
//       "filterByTag": [],
//       "filterByPlatform": getFilterByPlatform(),
//       "filterByAttribute": { "newGame": true },
//       "expectedFields": 129452998655,
//       "specificExportFields": [],
//       "expectedFormat": "map",
//       "pageIndex": "",
//       "pageSize": "",
//       "sortFields": []
//     };
//     session.call('/casino#getGames', [], new_payload).then(function (result) {
//       // console.log('payload new games :', new_payload);
//       // console.log('popular new result',result);
//       $.get(template_name, function (html) {
//         var data = template_hook(result);
//         var Template = Handlebars.compile(html);
//         gameHTML = Template(data);
//         // console.log('gameHTML:', gameHTML);
//         // console.log('pageIdBox: '+pageIdBox);
//         $('#'+pageIdBox+' #pills-2 .game-body').html('<div class="game-screen" data-value="'+category+'">'+gameHTML+'</div>');
//         superImage();
//         removeHiddenGame('pills-2');

//       }, 'html');
//     }, function (err) {
//       console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
//     });
//     // end get new games

//     // get get fav games
//     var fav_payload = {
//       "filterByPlatform": getFilterByPlatform(),
//       "filterByType": [],
//       "anonymousUserIdentity": "",
//       "expectedGameFields": 8201,
//       "expectedTableFields": 67117064
//     };
//     getFavGamesList(pageIdBox,category,fav_payload);
//     // end get fav games
    
//   });
// }

function superCateGames(appendBoxId,category,pageSize) {
  // $('.loading').show();
  var parameters = {
    "filterByName": [],
    "filterBySlug": [],
    "filterByVendor": [],
    "filterByCategory": category,
    "filterByTag": [],
    "filterByPlatform": getFilterByPlatform(),
    "filterByAttribute": {},
    "expectedFields": 129452998655,
    "specificExportFields": [],
    "expectedFormat": "map",
    "pageIndex": "",
    "pageSize": pageSize,
    "sortFields": []
  }
  var defaults = {
    "expectedFields": 129452998655
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var payload;
  var template_name = template_base + 'games.hbs';
  var template_hook = function (data) {
    return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
  };
  if (typeof parameters == 'undefined') {
    payload = defaults;
  } else {
    payload = $.extend({}, defaults, parameters);
  }
  c.doCall(function (session) {

    session.call('/casino#getGames', [], payload).then(function (result) {
      // console.log('superCateGames payload :', payload);
      // console.log('superCateGames result:', result);

      $.get(template_name, function (html) {
        var data = template_hook(result);
        var Template = Handlebars.compile(html);
        gameHTML = Template(data);
        $('#'+appendBoxId+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+gameHTML+'</div>');
        // superImage();
        removeHiddenGame(appendBoxId);

      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });

    // $('.loading').hide();
  });
}

function getFavGamesList(pageIdBox,category,fav_payload) {
  
  
  c.doCall(function (session) {
    session.call('/user#getSessionInfo', []).then(function (result) {
      if(result){
        console.log('-------isLogin',isLogin);
        if (isLogin) {
          
          session.call('/casino#getFavorites', [], fav_payload).then(function (response) {
           
            var favoriteList = response.kwargs.favorites;
            console.log('getFavorites favoriteList',favoriteList);
            
            $('#'+pageIdBox+' .game-body').html('<div class="game-screen" data-value="'+category+'"></div>');
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
            $.each(favoriteList, function (index, value) {
              if (value != null) {
                var template_base = 'https://aurumstage.s3.amazonaws.com/static/handlebars/games/game_fav.hbs';
                value.slug = value.id;

                if(value.game){
                  if(value.game != 'undefined'){
                    if(value.game.thumbnail != 'undefined'){
                      value.thumbnail = value.game.thumbnail;
                    }
                  }
                }

                if(value.table){
                  if(value.table != 'undefined'){
                    if(value.table.thumbnail != 'undefined'){
                      value.thumbnail = value.table.thumbnail;
                    }
                  }
                }

                $.get(template_base, function (html) {
                  var Template = Handlebars.compile(html);
                  limitData = $.extend({}, value, '');
                  var HTML = Template(limitData);

                  $('#'+pageIdBox+' .game-body .game-screen').append(HTML);
                });
              }
            });

            // $('.loading').hide();

          }, function (e) {
            console.log(e);
            // $('.loading').hide();
          });
        }else{
          // $('.loading').hide();
          // login modal show
        }
      }
    }, function(err) {
      // $('.loading').hide();
      console.log('getProfileSession ERROR!!',err);
    });
  });
}

// function getPopulrGamesList(pageIdBox,category,pageSize) {
//   var pop_payload = {
//     "filterByName": [],
//     "filterBySlug": [],
//     "filterByVendor": [],
//     "filterByCategory": category,
//     "filterByTag": [],
//     "filterByPlatform": getFilterByPlatform(),
//     "filterByAttribute": {},
//     "expectedFields": 129452998655,
//     "specificExportFields": [],
//     "expectedFormat": "map",
//     "pageIndex": "",
//     "pageSize": pageSize,
//     "sortFields": [
//         {
//           "field": 1024,
//           "order": "DESC"
//         }
//     ]
//   };

//   console.log('getPopulrGamesList pop_payload:', pop_payload);
//   var template_name = '/static/handlebars/games/games.hbs';
//   var template_hook = function (data) {
//     return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
//   };

//   c.doCall(function (session) {
//     session.call('/casino#getGames', [], pop_payload).then(function (result) {
//       console.log('getPopulrGamesList result:', result);
      
//       $.get(template_name, function (html) {
//         var data = template_hook(result);
//         var Template = Handlebars.compile(html);
//         gameHTML = Template(data);
        
//         // console.log('pageIdBox: '+pageIdBox);
//         $('#'+pageIdBox+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+gameHTML+'</div>');
//         // superImage();
//         removeHiddenGameFromPopular(pageIdBox);
//         // $('#'+pageIdBox+' .game-box').removeClass('hidden');
//       }, 'html');
//     }, function (err) {
//       console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
//     });
//   });
 
// }

function getNewGamesList(pageIdBox,category,pageSize) {
  var new_payload = {
    "filterByName": [],
    "filterBySlug": [],
    "filterByVendor": [],
    "filterByCategory": category,
    "filterByTag": [],
    "filterByPlatform": getFilterByPlatform(),
    "filterByAttribute": { "newGame": true },
    "expectedFields": 129452998655,
    "specificExportFields": [],
    "expectedFormat": "map",
    "pageIndex": "",
    "pageSize": pageSize,
    "sortFields": []
  };
  var template_hook = function (data) {
    return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
  };
  var template_base = '/static/handlebars/games/';
  var template_name = template_base + 'games.hbs';
  c.doCall(function (session) {
    session.call('/casino#getGames', [], new_payload).then(function (result) {
      // console.log('payload new games :', new_payload);
      // console.log('popular new result',result);
      $.get(template_name, function (html) {
        var data = template_hook(result);
        var Template = Handlebars.compile(html);
        gameHTML = Template(data);
        // console.log('gameHTML:', gameHTML);
        // console.log('pageIdBox: '+pageIdBox);
        $('#'+pageIdBox+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+gameHTML+'</div>');
        // superImage();

      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}

// END new functions created by Kitja 06-12-2018

/**
 * Created by MaDeaw on 2/12/2018.
 */
var FIELDS = {
  Slug: 1,
  Vendor: 2,
  Name: 4,
  ShortName: 8,
  Description: 16,
  AnonymousFunMode: 32,
  FunMode: 64,
  RealMode: 128,
  NewGame: 256,
  License: 512,
  Popularity: 1024,
  Width: 2048,
  Height: 4096,
  Thumbnail: 8192,
  Logo: 16384,
  BackgroundImage: 32768,
  Url: 65536,
  HelpUrl: 131072,
  Categories: 262144,
  Tags: 524288,
  Platforms: 1048576,
  RestrictedTerritories: 2097152,
  TheoreticalPayOut: 4194304,
  BonusContribution: 8388608,
  JackpotContribution: 16777216,
  FPP: 33554432,
  Limitation: 536870912,
  Currencies: 8589934592,
  Languages: 17179869184

};
/*
var CategoriesLiveCasino = {
    BACCARAT: 'BACCARAT',
    ROULETTE: 'ROULETTE',
    BLACKJACK: 'BLACKJACK',
    Poker: 'Poker',
    LOTTERY: 'LOTTERY',
    HOLDEM: 'HOLDEM',
    WHEELOFFORTUNE: 'WHEELOFFORTUNE',
    SICBO: 'SICBO'
};*/
var gettext = window.gettext || function (s) {
  return s;
};
var category_selected;
var advanced_template = true;
var payload_store = null;

function getFilterByPlatform() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
    return ["iPad", "iPhone"];
  } else if (userAgent.match(/Android/i)) {
    return ["Android"];
  } else {
    return ["PC", "Windows81"];
  }
}
function removeFavSlider() {
  $("#favorites-slide .slick-slide").each(function () {
    $('.favorites-slide').slick('slickRemove', 0);
  });
}

function add_fav(slug_id) {
  var parameters = {
    "anonymousUserIdentity": "",
    "type": "game",
    "id": slug_id
  }
  if (isLogin) {
    c.doCall(function (session) {
      session.call('/casino#addToFavorites', [], parameters ).then(function (result) {
        swal({
          title: "Success",
          text: "",
          icon: "success",
          button: gettext("LANG_OK"),
        });

      }, function (e) {
        console.log('add_fav error',e);
        swal({
          title: "Error !",
          text: e,
          icon: "error",
          button: gettext("LANG_OK"),
        });
      });
    });
  }
}

function remove_fav(slug_id) {
  var parameters = {
    "anonymousUserIdentity": "",
    "type": "game",
    "id": slug_id
  }
  if (isLogin) {
    c.doCall(function (session) {
      session.call('/casino#removeFromFavorites', [], parameters ).then(function (result) {
        $('.fav-box#game-'+slug_id).remove();
      }, function (e) {
        console.log(e);
      });
    });
  }
}

function setFavoritesShow(response,slug) {

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

  var regnum = new RegExp('^\\d+$');
  if (regnum.test(slug)) { //Live casino
    $(".btn_fav_add").hide();
  } else {
    $(".btn_fav_add").show();
  }
  
  $.each(response, function (index, value) {
    if (value != null) {

      var template_base = 'https://aurumstage.s3.amazonaws.com/static/handlebars/games/game_fav.hbs';

      value.slug = value.id;

      $.get(template_base, function (html) {
        var Template = Handlebars.compile(html);
        limitData = $.extend({}, value, '');
        var HTML = Template(limitData);
        if (value.slug == slug) {
          $(".btn_fav_remove").show();
          $(".btn_fav_add").hide();
        }
        $(".favorites-slide").slick('slickAdd', HTML);
      });
    }
  });
}

function getFavorites(slug) {
  if (isLogin) {
    c.doCall(function (session) {
      session.call('/casino#getFavorites', [], {
        "filterByPlatform": getFilterByPlatform(),
        "filterByType": [],
        "anonymousUserIdentity": "",
        "expectedGameFields": 8201,
        "expectedTableFields": 67117064
      }).then(function (result) {
        var list_favorite = result.kwargs.favorites;
        if (result.kwargs.favorites.length > 0) {
          $("#favorites-box").show();
        } else {
          $("#favorites-box").hide();
        }
        $(".btn_fav_remove").hide();
        // setFavoritesShow(list_favorite,slug);
      }, function (e) {
        console.log(e);
      });
    });
  }
}

function playGameMode(mode) {
  var _oldurlget = window.location.href.replace(window.location.search, "");
  if (mode == 0) {
    var setReal = false;
    var _newurlget = _oldurlget + "?mode=fun";
    $('.playtowin-item,.playtowin').show();
    $('.playforfun-item,.playforfun').hide();
  } else {
    var setReal = true;
    var _newurlget = _oldurlget + "?mode=real";
    $('.playtowin-item,.playtowin').hide();
    $('.playforfun-item,.playforfun').show();
  }
  window.history.pushState("", "", _newurlget);
  if (!isLogin) {
    $('#loginModal').modal('show');
    return false;
  }
  $('#gameframe1').prop('src', '');
  removeFavSlider();

  var reg = new RegExp('^\\d+$');
  if (reg.test(slug)) { //Live casino
    c.doCall(function (session) {
      startMoreGame(session, {
        "iframe": "gameframe1",
        "slug": "",
        "tableID": slug,
        "realMoney": true
      });
    });
  } else {
    c.doCall(function (session) {
      startMoreGame(session, {
        "iframe": "gameframe1",
        "slug": slug,
        "realMoney": setReal
      });
    });
  }

}

function addToFrame(gameSlug, mode){
  var window_no = $('#gameSelectPopup').attr('window-no');
  var gameframe = 'gameframe'+window_no;
  var setReal;
  if(mode == 'fun'){
    setReal = false;
  }else{
    setReal = true;
  }

  $('.group-'+window_no+' .fav-in-window').attr('onclick','add_fav("'+gameSlug+'")');

  // console.log('setReal = '+setReal);
  // console.log('game slug = '+gameSlug);
  // console.log('game frame = '+gameframe);

  c.doCall(function (session) {
    startMoreGame(session, {
    "iframe": gameframe,
    "slug": gameSlug,
    "realMoney": setReal
    });
  });
  $('#'+gameframe).removeClass('hidden');
  $('#gameSelectPopup').modal('hide');
}

function startMoreGame(session, parameters) {
  var hasFlash = false;

    session.call('/casino#getLaunchUrl', [], parameters).then(function (result) {
      // console.log('GAME!!!>> ',result.kwargs);
      if (result.kwargs.status == 0) {
        try {
          hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
          //console.log("hasFlash1",hasFlash);
        } catch (exception) {
          hasFlash = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
        }
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || userAgent.match(/Android/i)) {
          document.location = result.kwargs.url;
          // $("#noflash").hide();
          // $("#ShowFrame").show();
        } else {
          // console.log('parameters.iframe : '+parameters.iframe);
          // console.log('result.kwargs.url !! = '+result.kwargs.url);

          var attrSrc;
          var checkAttrSrc = setInterval(function(){ 
            attrSrc = $('#' + parameters.iframe).attr('src');
            // console.log('ATTR SRC > '+attrSrc +' <<< ');

            if (typeof attrSrc != 'undefined') {
              $('#' + parameters.iframe).attr('src', result.kwargs.url);

              if (hasFlash == false) {
                //alert('Flash player not allow');
                $("#noflash").show();
                // $("#ShowFrame").hide();
              } else {
                $("#noflash").hide();
                $("#ShowFrame,#fullFrameScreen").show();
                getFavorites();
              }
              
              $('#' + parameters.iframe).removeClass('hidden');
              clearInterval(checkAttrSrc);
            }
          }, 1000);
        
          $('#popupGamePlay').modal('show');
        }
      } else {
        alert(result.kwargs.statusText);
      }

      //getRecentWinners(session);
    }, function (e) {
      // console.info(e);
      // console.log('e',e.kwargs)
      // alert(e.kwargs.desc);
      $('#loginModal').modal('show');
      $('#loginModal').on('hide.bs.modal', function () {
        window.location.href = '/';
      })
      c.handleError(e);
    });
}

function addMoreGame(mode) {
  // $('.loading').show();
  if (mode) {
    // exit full screen before add game
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);
    if (isInFullScreen) {
      fullscreen_game();
    }

    getGames(payload, function (HTML) {
      var divClass = 'gameforadd';
      // $('#' + divID).append(HTML);
      $('.' + divClass).append(HTML);
      // $('#' + divID + '.game-slide').slick('slickAdd', HTML);
      $('.item').mouseover(function () {
        $(this).find('.img').css('filter', 'brightness(0.5)');
      });
      $('.item').mouseout(function () {
        $(this).find('.img').css('filter', 'brightness(1)');
      });
      $('#addgamemodal').modal('show');
      // $('.loading').hide(); 
      superImage();
    });
  }
}

$(function () {

  // parameters = {
  //   "filterByName": [],
  //   "filterBySlug": [],
  //   "filterByVendor": [],
  //   "filterByCategory": [],
  //   "filterByTag": [],
  //   "filterByPlatform": [],
  //   "filterByAttribute": {},
  //   "expectedFields": 129452998655,
  //   "specificExportFields": [],
  //   "expectedFormat": "map",
  //   "pageIndex": "1",
  //   "pageSize": "2",
  //   "sortFields": []
  // }

  // START new functions created by Kitja 06-12-2018

  // var pageURL = window.location.href;
 
  // END new functions created by Kitja 06-12-2018


  // if (typeof slug !== 'undefined' && typeof getRealMode !== 'undefined') {
  //   var reg = new RegExp('^\\d+$');
  //   if (reg.test(slug)) { //Live casino
  //     c.doCall(function (session) {
  //       startMoreGame(session, {
  //         "iframe": "gameframe1",
  //         "slug": "",
  //         "tableID": slug,
  //         "realMoney": true
  //       });
  //     });
  //     $(".playtowin-item, .playforfun-item").remove();
  //     window.history.pushState("", "", window.location.href.replace(window.location.search, ""));
  //   } else {
  //     console.log(slug);
  //     c.doCall(function (session) {
  //       startMoreGame(session, {
  //         "iframe": "gameframe1",
  //         "slug": slug,
  //         "realMoney": getRealMode
  //       });
  //     });
  //   }
  // }
});

function loadmorescreen(screen) {

  $('#ShowFrame_second').removeClass('hidden');

  
}


function getGames(parameters, callback) {
  var defaults = {
    "expectedFields": 129452998655
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var payload;
  template_name = template_base + 'games.hbs';
  var template_hook = function (data) {
    return { games: data.kwargs.games, mode: 'game', languagecode: c.language };
  };
  if (typeof parameters == 'undefined') {
    payload = defaults;
  } else {
    payload = $.extend({}, defaults, parameters);
  }
  c.doCall(function (session) {
   
    payload_store = payload;
    //console.log('payload game:', payload_store);
    session.call('/casino#getGames', [], payload).then(function (result) {
      $.get(template_name, function (html) {
        var data = template_hook(result);
        console.log('data game:', result);
        if (typeof data.games[0] != "undefined") {
          var backgroundImage = data.games[0].backgroundImage;
          if (typeof data.games[0].width != "undefined" && typeof data.games[0].height != "undefined") {
            var gameRatio = data.games[0].width / data.games[0].height;
            if (gameRatio == 4 / 3) {
              $('#ShowFrame').addClass('game-ratio-4-3');
            } else if (gameRatio == 3 / 2) {
              $('#ShowFrame').addClass('game-ratio-3-2');
            } else if (gameRatio == 16 / 9) {
              $('#ShowFrame').addClass('game-ratio-16-9');
            } else if (gameRatio == 2 / 1) {
              $('#ShowFrame').addClass('game-ratio-2-1');
            } else if (gameRatio == 21 / 9) {
              $('#ShowFrame').addClass('game-ratio-21-9');
            } else if (gameRatio == 4 / 1) {
              $('#ShowFrame').addClass('game-ratio-4-1');
            }
          }
        }
        var Template = Handlebars.compile(html);
        //CHK img
        Handlebars.registerHelper('if', function (conditional, options) {
          if (conditional !== undefined && conditional != "") {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        });
        Handlebars.registerHelper('ifvalue', function (conditional, options) {
          if (options.hash.value === conditional) {
            return options.fn(this)
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

function getGameInfo(parameters, callback) {
  var defaults = {
    "expectedFields": 129452998655
  };
  var device = {
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var payload;
  template_names = template_base + 'game_info.hbs';
  // console.log('tempname',template_names);
  var template_hook = function (data) {
    return { games: data.kwargs.games, languagecode: c.language };
  };
  if (typeof parameters == 'undefined') {
    payload = defaults;
  } else {
    payload = $.extend({}, defaults, parameters);
  }
  // console.log('pay load',payload);
  c.doCall(function (session) {
    payload_store = payload;
    session.call('/casino#getGames', [], payload).then(function (result) {
      // console.log('data game:', template_names);
      $.get(template_names, function (html) {
        var data = template_hook(result);
        // console.log('data game:', template_names);
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
        // console.log('game Data',gameHTML);
        if (callback) {
          callback(gameHTML)
        }
      }, 'html');
    }, function (err) {
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}

// get vendors 
c.doCall(function (session) {
  session.call('/casino#getGameVendors').then(function (result) {
    var data = result.kwargs.vendors;
    data.forEach(function(vendorName) {
      $('.vendor-section select').append('<option value="'+vendorName+'">'+vendorName+'</option>');
    });
  }, function (err) {
    console.log('get vendors ERROR !!', err.kwargs.desc, err.kwargs.detail);
  });
});

// get categories 
c.doCall(function (session) {
  session.call('/casino#getGameCategories').then(function (result) {
    var data = result.kwargs.categories;
    data.forEach(function(categoryName) {
      $('#gameSelectPopup').find('.category-section select').append('<option value="'+categoryName+'">'+categoryName+'</option>');
    });
  }, function (err) {
    console.log('get categories ERROR !!', err.kwargs.desc, err.kwargs.detail);
  });
});

function getGameByVendor(vendor,append) {
  var category;
  var appendId;

  if(append == 'gameSelectPopup'){
    appendId = 'gameSelectPopup';
    category = $('.go-game-search-popup').attr('category');
  }else{
    appendId = append+'-Box';
    category = $('.go-game-search').attr('category');
  }

  var parameters = {
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

  if($('#'+append+' .game-search-name').val() != ''){
    parameters.filterByName = [$('#'+append+' .game-search-name').val()];
  }
  if(vendor != ''){
    parameters.filterByVendor = [vendor];
  }
  if(category != ''){
    parameters.filterByCategory = [category];
  }

  parameters.filterByPlatform = getFilterByPlatform();

  if(append == 'gameSelectPopup') {
    SearchgetGamesPopup(parameters, function (HTML) {
      $('#'+appendId+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+HTML+'</div>');

      //Load more for when select filter search by Tae 17-12-2018
      pills_no = appendId.substr(appendId.length - 1)
      removeHiddenGame(appendId);
      gameIndex[pills_no-1] = gameShowPerClick;

    });
  } else {
    // $('.loading').show(); 
    SearchgetGames(parameters, function (HTML) {
      // $('.loading').hide();
      $('#'+appendId+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+HTML+'</div>');

      //Load more for when select filter search by Tae 17-12-2018
      pills_no = appendId.substr(appendId.length - 1)
      removeHiddenGame(appendId);
      gameIndex[pills_no-1] = gameShowPerClick;

    });
  }
}

function getGameByCategory(category,appendId) {

  var parameters = {
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

  var vendor = $('#gameSelectPopup').find('.vendor-section select').val();

  if($('#gameSelectPopup .game-search-name').val() != ''){
    parameters.filterByName = [$('#gameSelectPopup .game-search-name').val()];
  }
  if(vendor != ''){
    parameters.filterByVendor = [vendor];
  }
  if(category != ''){
    parameters.filterByCategory = [category];
  }

  parameters.filterByPlatform = getFilterByPlatform();
  
  // $('.loading').show(); 
  SearchgetGamesPopup(parameters, function (HTML) {
    // $('.loading').hide();
    $('#'+appendId+' .game-body').html('<div class="game-screen" data-value="'+category+'">'+HTML+'</div>');

    //Load more for when select filter search by Tae 17-12-2018
    pills_no = appendId.substr(appendId.length - 1)
    removeHiddenGame(appendId);
    gameIndex[pills_no-1] = gameShowPerClick;

  });
}

function onFullScreenChange () {
	var fullScreenElement =
		document.fullscreenElement ||
		document.msFullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement;

	if(!fullScreenElement)
		$('.gameplay__game-wrapper').removeClass('fullScreenActive hidden');
}

function fullscreen_game(frameNum) {

  var elem = document.getElementById("ShowFrame");
	
	if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
		if (elem.requestFullScreen) {
			elem.requestFullScreen()
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen()
		} else if (elem.webkitRequestFullScreen) {
			elem.webkitRequestFullscreen()
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen()
		}

    frameNum = parseInt(frameNum) || 1;
    
		$('.gameplay__game-wrapper--' + frameNum).addClass('fullScreenActive');
		$('.gameplay__game-wrapper:not(.fullScreenActive)').addClass('hidden');
  } 
  
}

function enlarge_game(frameNum) {
  if( $('.gameplay__game-wrapper--'+frameNum).hasClass('enlarge-box') ) {
    $('.gameplay__game-wrapper--'+frameNum).removeClass('enlarge-box');
    $(".group-1, .group-2, .group-3, .group-4").removeClass('hidden');
  } else {
    $('.gameplay__game-wrapper--'+frameNum).addClass('enlarge-box');
    $(".tool-group:not(.group-"+frameNum+")").addClass('hidden');
  }
}

$(document).ready(function () {
	$("body").on('change', '.vendor-section select', function () {
    var vendor = $(this).val();
    var append = $(this).attr('box-id');
		getGameByVendor(vendor,append);
  });
  
  $("body").on('change', '.category-section select', function () {
    var category = $(this).val();
		getGameByCategory(category,'game-select-Box');
	});

	if (document.onfullscreenchange === null)
		document.onfullscreenchange = onFullScreenChange;

	if (document.onmsfullscreenchange === null)
		document.onmsfullscreenchange = onFullScreenChange;

	if (document.onmozfullscreenchange === null)
		document.onmozfullscreenchange = onFullScreenChange;

	if (document.onwebkitfullscreenchange === null)
		document.onwebkitfullscreenchange = onFullScreenChange;
});

function getLiveCasinoTables(parameters, callback) {
  var defaults = {
    // "expectedFields": 137438953471, //129452998655
    "expectedTableFields": 137438953471
  };
  var device = {
    "dataSourceName": "live-casino",
    "categoryID": "live-casino$live-casino",
    // "filterByCategory": ["BLACKJACK"],
    "includeChildren": true,
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var payload;
  var template_name = template_base + 'games_lobby.hbs';
  var template_hook = function (data) {
    return { games: data.kwargs.children, mode: 'casino', languagecode: c.language };
  };
  //console.log("parameters",defaults);
  if (typeof parameters == 'undefined') {
    payload = defaults;
  } else {
    payload = $.extend({}, defaults, parameters);
  }
  c.doCall(function (session) {
    payload_store = payload;
    payload.expectedFormat = 'map';
    payload.sortFields = [
      {
        field: 1,
        order: 'ASC'
      }, {
        field: FIELDS.Popularity,
        order: 'DESC'
      }
    ]
    // payload.sortFields = [
    //     { field : FIELDS.Name, order : 'ASC' }
    // ]
    // console.log('live data payload:', payload.filterByCategory[0]);
    if (payload.filterByCategory) {
      // console.log('filterByCategory',payload.filterByCategory)
      if (payload.filterByCategory == 'BLACKJACK') {
        payload.categoryID = "live-casino$blackjack"
      } else {
        payload.filterByCategory = []
      }
    }
    console.log('live data payload:', payload);
    // session.call('/casino#getLiveCasinoTables', [], payload).then(function(result) {
    session.call('/casino#getCustomCategoryChildren', [], payload).then(function (result) {
      console.log('live data game:', result);
      $.get(template_name, function (html) {
        var data = template_hook(result);
        // console.log('live data:',payload.f, data);
        var Template = Handlebars.compile(html);
        //CHK img
        Handlebars.registerHelper('if', function (conditional, options) {
          if (conditional !== undefined && conditional != "") {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        });
        Handlebars.registerHelper('ifvalue', function (conditional, options) {
          if (options.hash.value === conditional) {
            return options.fn(this)
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

function getCasinoCategory(parameters, callback) {
  var defaults = {
    // "expectedFields": 137438953471, //129452998655
    "expectedTableFields": 137438953471
  };
  var device = {
    "dataSourceName": "live-casino",
    "includeChildren": false,
    "filterByPlatform": getFilterByPlatform()
  };
  defaults = $.extend({}, defaults, device);
  var template_base = '/static/handlebars/games/';
  var payload;
  var template_name = template_base + 'lobby.hbs';
  var template_hook = function (data) {
    return { categories: data.kwargs.categories, languagecode: c.language };
  };
  //console.log("parameters",defaults);
  if (typeof parameters == 'undefined') {
    payload = defaults;
  } else {
    payload = $.extend({}, defaults, parameters);
  }
  c.doCall(function (session) {
    session.call('/casino#getCustomCategories', [], payload).then(function (result) {
      if (result) {
        $.get(template_name, function (html) {
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
          Handlebars.registerHelper('trans', function (title) {
            var t = gettext(title);
            return t;
          });

          Handlebars.registerHelper('getcat', function (catagory) {
            var t = catagory.toString().split('$');
            return t[1];
          });

          Handlebars.registerHelper('catname', function (catagory) {
            var t = catagory.toString().split('$');
            var v = t[1].toString().replace(/-/g, ' ')
            var r = v.toString().charAt(0).toUpperCase() + v.toString().slice(1);
            return gettext(r);
          });

          gameHTML = Template(data);
          if (callback) {
            callback(gameHTML)
          }
        }, 'html');
      }
    }, function (err) {
      // $('.loading').hide();
      swal({
        title: gettext("LANG_WARNING"),
        text: err.kwargs.desc,
        icon: "warning",
        button: gettext("LANG_OK"),
      });
      console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
    });
  });
}

function showInfo(id, main) {
  $('#game-' + id).closest('.game-board').find('.item.hovered').removeClass('hovered');
  $('#game-' + id).children('.item').addClass('hovered');
  $('div[id^=game-info]').hide();
  $('div[id^=search-info-]').hide();
  $('#game-info-' + id).show('slow');
}

function closeInfo(data) {
  $('#game-info-' + data).hide();
  $('#search-info-' + data).hide();
  $('#game-info-' + data).closest('.game-info').prev().closest('.game-board').find('.item.hovered').removeClass('hovered');
}

function popupLoginGames(data) {
  // $('#loginModal').modal('show');
  return c.doCall(function (session) {
    session.call("/user#getSessionInfo", []).then(function (result) {
      // console.log("isAuthenticated", result.kwargs.isAuthenticated);
      if (result.kwargs.isAuthenticated) {
        window.location.href = data;
        return true;
      } else {
        $('#loginModal').modal('show');
        return false;
      }
    });
  });
}

$(function () {
  if ($('.favorites-slide').length > 0) {
    $('.favorites-slide').slick({
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      prevArrow: '<button type="button" class="slick-prev"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;transform: rotate(-180deg);"></button>',
      nextArrow: '<button type="button" class="slick-next"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;"></button>',
      responsive: [
        {
          breakpoint: 2400,
          settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: true
          }
        }, {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        }, {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    });
  }

  Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
});


function PlayGameFromAddMoreGame(slug, game_width, game_height) {
  if (game_width !== undefined || game_height !== undefined) {
      var r = gcd(game_width, game_height);
      console.log("Aspect     = ", game_width / r, ":", game_height / r);

  }
  var gameLoad = {
      slug: slug,
      tableID: "",
      realMoney: true,/*JSON.parse(getQueryString("realmoney")),*/
      //realMoney: JSON.parse("true"),
      iframe: ''
  }
  console.info('Before loadgame');
  console.info('gameLoad', gameLoad);
  console.info('loadgame');
  var list_iframe = $("iframe[id^='gameframe']");
  var iframe_src;
  console.info('list_iframe', list_iframe);
  var arr_iframe = [];
  if (typeof(gameindex) != "undefined") {
      list_iframe.each(function (key, value) {
          iframe_src = $(this).attr("src");
          arr_iframe.push($(this).attr("id"));
          if (game_width !== undefined || game_height !== undefined) {
              if ((game_width / r) - (game_height / r) == 1) {
                  ratio[0] = 0;
              } else {
                  ratio[0] = 1;
              }
          }
      });
      if (gameindex == "btnframe2") {
          gameLoad.iframe = arr_iframe[1];
          if (game_width !== undefined || game_height !== undefined) {
              if ((game_width / r) - (game_height / r) == 1) {
                  ratio[1] = 0;
              } else {
                  ratio[1] = 1;
              }
          }
      }
      else if (gameindex == "btnframe3") {
          gameLoad.iframe = arr_iframe[2];
          if (game_width !== undefined || game_height !== undefined) {
              if ((game_width / r) - (game_height / r) == 1) {
                  ratio[2] = 0;
              } else {
                  ratio[2] = 1;
              }
          }
      }
      else if (gameindex == "btnframe4") {
          gameLoad.iframe = arr_iframe[3];
          if (game_width !== undefined || game_height !== undefined) {
              if ((game_width / r) - (game_height / r) == 1) {
                  ratio[3] = 0;
              } else {
                  ratio[3] = 1;
              }
          }
      }
      $("#" + gameindex).addClass("hidden");
  } else {
      list_iframe.each(function (key, value) {
          iframe_src = $(this).attr("src");
          if (iframe_src == "(unknown)" || iframe_src == "") {
              arr_iframe.push($(this).attr("id"));
          }
      });
      if (arr_iframe.length == 3) {
          if (game_width !== undefined || game_height !== undefined) {
              if ((game_width / r) - (game_height / r) == 1) {
                  ratio[1] = 0;
              } else {
                  ratio[1] = 1;
              }
          }
          $("#btnframe2").addClass("hidden");
      } else if (arr_iframe.length == 2) {
          if (game_width !== undefined || game_height !== undefined) {
              if ((game_width / r) - (game_height / r) == 1) {
                  ratio[2] = 0;
              } else {
                  ratio[2] = 1;
              }
          }
          $("#btnframe3").addClass("hidden");
      } else if (arr_iframe.length == 1) {
          if (game_width !== undefined || game_height !== undefined) {
              if ((game_width / r) - (game_height / r) == 1) {
                  ratio[3] = 0;
              } else {
                  ratio[3] = 1;
              }
          }
          $("#btnframe4").addClass("hidden");
      }
      gameLoad.iframe = arr_iframe[0];
  }
  /*E#1 */
  if (gameLoad.iframe == 'gameframe2') {
      $(".game-screen-wrapper").addClass("screen-mode2");
      $(".game-screen-wrapper").removeClass("screen-mode1");
      $(".game-screen-wrapper").removeClass("screen-mode4");
  } else if (gameLoad.iframe == 'gameframe3' || gameLoad.iframe == 'gameframe4') {
      $(".game-screen-wrapper").addClass("screen-mode4");
      $(".game-screen-wrapper").removeClass("screen-mode1");
      $(".game-screen-wrapper").removeClass("screen-mode2");
  }
  if (action == 'full-screen') {
      var totalratio = 0;
      ratio.forEach(function (item) {
          totalratio += item;
      });
      if (totalratio > 2) {
          $('.game').addClass('fullScreen');
          $('.game').addClass('sizewide-fullScreen');
          $('.container').css({'margin-right': ''});
          $('.container').css({'margin-left': ''});
          $('.col-lg-9').addClass('screen-wide-left');
          $('.col-lg-9').addClass('divwide-fullScreen');

      } else {
          $('.game').addClass('fullScreen');
          $('.game').addClass('sizenormal-fullScreen');
          $('.btn-close-game').addClass('btn-close-game-full-screen');
          $('.col-lg-9').addClass('divnormal-fullScreen');
      }
  }
  // console.log(list_iframe)
  c.doCall(startMoreGame, gameLoad);
  $('.addmoregame').addClass('hidden');
}
