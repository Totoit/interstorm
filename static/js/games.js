var width, height;
var getIDiframe = "gameframe1";
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
}

var gettext = window.gettext || function (s) {
	return s;
}
var frameOpened = 0;
var advanced_template = true;
/*E#1 Edit 20170320 hidden select 2 screen and 4 screen*/
function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b);
}

function getQueryString(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function gamemodeShow(HTML, mode) {
	/*
		if (mode == "all") {
			$('#games-list').html(HTML);
		} else if (mode == "pop") {
			$('#games-list-popular').html(HTML);
			$('#games-list-popular.game-screen-slidebar > .game-box > .item > .img.crop > a').click(function () {
				if (!$('.mode1').hasClass('active') && $('.game-mode-wrapper').length > 0) {
					console.log("game name:", $(this).data('slug'), getIDiframe);
					if (getIDiframe != "") {
						slug = $(this).data('slug');
						var payload = {
							"filterBySlug": [
								slug
							],
						};
						getGames(payload, "", "", getWidthHeight);
					}

					return false;
				} else {
					return true;
				}
			});
			// $(".game-box > a").addClass('disabled');
		} else if (mode == "new") {
			$('#games-list-new').html(HTML);
			$('#games-list-new.game-screen-slidebar > .game-box > .item > .img.crop > a').click(function () {
				if (!$('.mode1').hasClass('active') && $('.game-mode-wrapper').length > 0) {
					console.log("game name:", $(this).data('slug'), getIDiframe);
					if (getIDiframe != "") {

						slug = $(this).data('slug');
						var payload = {
							"filterBySlug": [
								slug
							],
						};
						getGames(payload, "", "", getWidthHeight);
					}
					return false;
				} else {
					return true;
				}
			});
		}
		*/

	// $('.img.crop > a').click(function () {
	//     if (!$('.mode1').hasClass('active')) {
	//         console.log("game name:",$(this).data('slug'),getIDiframe);
	//         return false;
	//     } else {
	//         return true;
	//     }
	//
	// });

}

function gameSelectPopup(window_no){
  console.log('window_no = '+window_no);
	$('#gameSelectPopup').modal('show');
	$('#gameSelectPopup').attr('window-no',window_no);
}

function PlayGameFromAddMoreGame(slug, game_width, game_height) {
	if (game_width !== undefined || game_height !== undefined) {
		var r = gcd(game_width, game_height);
		console.log("Aspect     = ", game_width / r, ":", game_height / r);

	}
	var gameLoad = {
		slug: slug,
		tableID: "",
		realMoney: "",
		/*JSON.parse(getQueryString("realmoney")),*/
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
	if (typeof (gameindex) != "undefined") {
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
		} else if (gameindex == "btnframe3") {
			gameLoad.iframe = arr_iframe[2];
			if (game_width !== undefined || game_height !== undefined) {
				if ((game_width / r) - (game_height / r) == 1) {
					ratio[2] = 0;
				} else {
					ratio[2] = 1;
				}
			}
		} else if (gameindex == "btnframe4") {
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
			$('.container').css({
				'margin-right': ''
			});
			$('.container').css({
				'margin-left': ''
			});
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


function boardShowGame(result, html, template_hook, gameHTML) {
	var data = template_hook(result);
	console.log('data game:', data);
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
}

function getWidthHeight(session, result) {
	width = result.kwargs.games[0].width;
	height = result.kwargs.games[0].height;

	if (typeof height == 'number' && typeof width == 'number') {
		$('.gameplay__wrapper').addClass('game-ratio--' + width + 'x' + height);
	}

	PlayGameFromAddMoreGame(session);
}

function PlayGameFromAddMoreGame(session) {
	var gameLoad = {
		slug: slug,
		tableID: "",
		realMoney: realMode,
		iframe: getIDiframe
	};

	startMoreGame(session, gameLoad);
}

// function clickmode() {
// 	$('.mode1').click(function () {
// 		$('.mode1').addClass("active");
// 		$('.mode2').removeClass("active");
// 		$('.mode4').removeClass("active");
// 		$('.gameplay__wrapper').addClass('has-1');
// 		$('.gameplay__wrapper').removeClass('has-2');
// 		$('.gameplay__wrapper').removeClass('has-4');
// 		if ($('.gameplay__game-wrapper--2').length > 0)
// 			removeFrame('.gameplay__game-wrapper--2');
// 		if ($('.gameplay__game-wrapper--3').length > 0 && $('.gameplay__game-wrapper--4').length > 0) {
// 			removeFrame('.gameplay__game-wrapper--3');
// 			removeFrame('.gameplay__game-wrapper--4');
// 		}
// 	});

// 	$('.mode2').click(function () {
// 		$('.mode1').removeClass("active");
// 		$('.mode2').addClass("active");
// 		$('.mode4').removeClass("active");
// 		$('.gameplay__wrapper').addClass('has-2');
// 		$('.gameplay__wrapper').removeClass('has-1');
// 		$('.gameplay__wrapper').removeClass('has-4');
// 		if ($('.gameplay__game-wrapper--3').length > 0 && $('.gameplay__game-wrapper--4').length > 0) {
// 			removeFrame('.gameplay__game-wrapper--3');
// 			removeFrame('.gameplay__game-wrapper--4');
// 		}
// 		renderframeGame('2');
// 	});

// 	$('.mode4').click(function () {
// 		$('.mode1').removeClass("active");
// 		$('.mode2').removeClass("active");
// 		$('.mode4').addClass("active");
// 		$('.gameplay__wrapper').addClass('has-4');
// 		$('.gameplay__wrapper').removeClass('has-1');
// 		$('.gameplay__wrapper').removeClass('has-2');
// 		renderframeGame('3');
// 		renderframeGame('4');
// 	});
// }

// function removeFrame(nameFrame) {
// 	$(nameFrame).remove();
// }

function renderframeGame(frame, template_name, template_hook) {
	var frame = frame || 1;
	var template_base = '/static/handlebars/games/';

	template_name = template_name || template_base + (
		advanced_template ?
		'game_frame' :
		'') + '.hbs';

	template_hook = template_hook || function (framenumber) {
		return {
			framenumber: framenumber,
			groupside: frame == 1 || framenumber % 2 == 0 ? 'right' : 'left'
		};
	}

	// template_name = '/static/handlebars/games/game_frame.hbs'; 
	template_name = 'https://aurumstage.s3.amazonaws.com/static/handlebars/games/game_frame.hbs';

	$.get(template_name, function (html) {
		$('.gameplay__wrapper').removeClass('has-1 has-2 has-3 has-4').addClass('has-' + frame);


		if(frame >= frameOpened) {
			for(var i = frameOpened; i < frame; i++){
				
				var data = template_hook(parseInt(i) + 1);
				var Template = Handlebars.compile(html);
				var HTML = Template(data);

				Handlebars.registerHelper('ifCond', function (v1, v2, options) {
					if (v1 == v2) {
					  return options.fn(this);
					}

					return options.inverse(this);
				});

				$('.gameplay__wrapper').append(HTML);
				$('.gameplay__game-iframe').on('load', function () {
					var frameId = $(this).attr('id');

					if(!$(this).hasClass('loaded')){
						$(this).contents().bind('click', function(){
							getIDiframe = frameId;
						});
					}

					$(this).addClass('loaded');
				});
			}

			// framePlus = parseInt(frameOpened) + 1;
			// $('.enlarge-'+framePlus).addClass('hidden');
			// if(framePlus > 1){
			// 	$('.first-right-tools').addClass('hidden');
			// 	$('.enlarge-1, .enlarge-2, .enlarge-3, .enlarge-4').removeClass('hidden');
			// }

		}else{
			// $('.enlarge-1').addClass('hidden');
			for(var i = frameOpened; i > frame; i--){
				$('.gameplay__game-wrapper--' + i).remove();
			}
		}

		frameOpened = frame;

	});
}

function switchmodegame(mode) {
	var payload = {};
	if (mode == 'newgame') {
		payload = {
			"sortFields": [{
				"field": FIELDS.NewGame,
				"order": "DESC"
			}]
		}
	} else {
		payload = {
			"filterByCategory": [mode]
		}
	}
	return payload
}

$(document).ready(function () {
	// console.log('games.js loaded');

	// start get games by Kitja 12-12-2018
	var parameters = {
		"filterByName": [],
		"filterBySlug": [],
		"filterByVendor": [],
		"filterByCategory": [],
		"filterByTag": [],
		"filterByPlatform": getFilterByPlatform(),
		"filterByAttribute": {},
		"expectedFields": 129452998655,
		"specificExportFields": [],
		"expectedFormat": "map",
		"pageIndex": "",
		"pageSize": "",
		"sortFields": []
	}

	var page_category = $('.inner-game-cate').attr('cate');
	// var URLpathname = window.location.pathname;
	if (page_category != 'undefined' && page_category != '') {
		parameters.filterByCategory = [page_category];
		// superGames(parameters, page_category);
	}
	// end get games by Kitja 12-12-2018

	// start old code get games
	//   if (typeof slug != 'undefined') {
	//       $('.mode1').addClass("active");
	//       renderframeGame('1');

	//       var payload = {
	//           "filterBySlug": [slug]
	//       };
	//       getGames(payload, "", "", getWidthHeight);
	//   }



	//   clickmode();

	//   var parent;
	//   parent = document.getElementsByClassName('casino');
	//   //console.log("parent :", parent);
	//   $.each(parent, function (element, index, array) {
	//       var dataID = index.getAttribute("data-value");
	//       var divID = index.id;
	//       var infoId = $('#' + divID).next().attr('id');
	//       // console.log("ids :",$('#'+divID).closest('div.game-info').html());
	//       //--- on clieck and next slide---
	//       var pageIndex = 1;
	//       var gameofpage = 8;
	//       // -------------------------------
	//       var payload = {
	//           "pageIndex": pageIndex,
	//           "pageSize": gameofpage
	//       }

	//       if (dataID == "LASTEST") {
	//           payload.filterByCategory = [];
	//           payload.sortFields = [
	//             {
	//               "field": 1024,
	//               "order": "DESC"
	//             }
	//           ]
	//       } else {
	//           payload = $.extend({}, payload, switchmodegame(dataID));
	//       }
	//       // console.log("payload :", payload, dataID);
	//       getGames(payload, function (HTML) {
	//           console.log("HTML :", divID);
	//           // $('#' + divID).append(HTML);
	//           $('#' + divID).append(HTML);
	//           // $('#' + divID + '.game-slide').slick('slickAdd', HTML);

	//           $('.item').mouseover(function () {
	//               $(this).find('.img').css('filter', 'brightness(0.5)');
	//           });
	//           $('.item').mouseout(function () {
	//               $(this).find('.img').css('filter', 'brightness(1)');
	//           })


	$(document).delegate('.OpenGame', 'click', function () {
		var getRealMode = false;
		var getMode = $(this).attr('mode');
		var gameslug = $(this).data('slug');
		var reg = new RegExp('^\\d+$');
		var loged = false;
		
		$('#ShowFrame').empty();
		renderframeGame('1');

		frameOpened = 0;
		if (getMode == 'real') {
			getRealMode = true;
		}
		// console.log('getMode = '+getMode);
		// console.log('getRealMode : '+getRealMode);

		// if(getMode == 'real'){
		// 	c.doCall(function (session) {
		// 		session.call("/user#getSessionInfo", []).then(
		// 			function (result) {
		// 				if (!result.kwargs.isAuthenticated) {
		// 					swal({
		// 						title: "Warning !",
		// 						text: 'Real mode need logged in first',
		// 						icon: "error",
		// 						button: gettext("LANG_OK"),
		// 					});

		// 					return;
		// 				}
		// 			}
		// 		, function (err) {
		// 			console.log(err);
		// 			c.conn.close();
		// 		});
		// 	});
		// }

		if(getMode == 'real'){
			if(!isLogin){
				swal({
					title: "Warning !",
					text: 'Real mode need logged in first',
					icon: "error",
					button: gettext("LANG_OK"),
				});

				return;
			}
		}

			if (reg.test(gameslug)) { // casino
				// console.log('gameslug if: '+gameslug);
				c.doCall(function (session) {
					startMoreGame(session, {
						"iframe": "gameframe1",
						"slug": "",
						"tableID": gameslug,
						"realMoney": getRealMode
					});

					$('#gameframe1').removeClass('hidden');
				});

				$('.group-1 .fav-in-window').attr('onclick','add_fav("'+gameslug+'")');
				$(".playtowin-item, .playforfun-item").remove();
				window.history.pushState("", "", window.location.href.replace(window.location.search, ""));

			} else {
				console.log('gameslug else: '+gameslug);
				c.doCall(function (session) {
					startMoreGame(session, {
						"iframe": "gameframe1",
						"slug": gameslug,
						"realMoney": getRealMode
					});

					$('.group-1 .fav-in-window').attr('onclick','add_fav("'+gameslug+'")');
					$('#gameframe1').removeClass('hidden');
				});
			}
		
		// $('#popupGamePlay').modal('show');
	});


	//       getGameInfo(payload, function (HTML) {
	//           $('#' + infoId).append(HTML);
	//       })
	//   });
	// end old code get games

	var parent_live;
	parent_live = document.getElementsByClassName('casino-live');
	$.each(parent_live, function (element, index, array) {
		var dataID = index.getAttribute("data-value");
		var divID = index.id;
		// console.log("id :", dataID);
		// console.log(dataID);
		//--- on clieck and next slide---
		var pageIndex = 1;
		var gameofpage = 8;
		// -------------------------------
		var payload = {
			"pageIndex": pageIndex,
			"pageSize": gameofpage
		};
		payload = $.extend({}, payload, switchmodegame(dataID));
		// console.log("payload live :",payload);
		getLiveCasinoTables(payload, function (HTML) {
			console.log("HTML :", divID);
			$('#' + divID).append(HTML);
			// $('#' + divID + '.game-slide').slick('slickAdd', HTML);

			$('.item').mouseover(function () {
				$(this).find('.img').css('filter', 'brightness(0.5)');
			});

			$('.item').mouseout(function () {
				$(this).find('.img').css('filter', 'brightness(1)');
			});

			superImage();
		});
	});

	if ($('#casino-catgory').length > 0) {
		// $('.loading').show();

		getCasinoCategory(payload, function (HTML) {
			$('#casino-catgory').append(HTML).ready(function () {
				var parent_live;
				parent_live = document.getElementsByClassName('casino-live');
				$.each(parent_live, function (element, index, array) {
					var dataID = index.getAttribute("data-value");
					var divID = index.id;
					var pageIndex = 1;
					var gameofpage = 8;
					var payload = {
						"pageIndex": pageIndex,
						"pageSize": gameofpage
					};
					payload = $.extend({}, payload, payload = {
						"categoryID": dataID
					});
					goSlick(divID);
					getLiveCasinoTables(payload, function (HTML) {
						$('#' + divID + '.game-slide').slick('slickAdd', HTML);
						$('.item').mouseover(function () {
							$(this).find('.img').css('filter', 'brightness(0.5)');
						});
						$('.item').mouseout(function () {
							$(this).find('.img').css('filter', 'brightness(1)');
						});
						superImage();
					});
				});
				// $('.loading').hide();
			})
		});
	}
});
function goSlick(divID){
  $('#' + divID).css('display','inherit');
  $('#' + divID).slick({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4.5,
    slidesToScroll: 1,
    prevArrow:'<button type="button" class="slick-prev"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;transform: rotate(-180deg);"></button>',
    nextArrow:'<button type="button" class="slick-next"><img src="/static/images/CTA_-_Play_More_Info3.png" style="z-index:999;;position:relative;height:3rem;"></button>',
    responsive: [{
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


