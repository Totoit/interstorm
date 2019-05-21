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

function writeJsonFile(filename, result) {
	var myJSON = JSON.stringify(result);

	$.ajax({
		type: "POST",
		url: "/syncgames/",
		data: {
			filename: filename,
			myJSON: myJSON
		},
		dataType: "text",
		cache: false,
	}).done(function (res) {
		// console.log('writeJsonFile res !! ',res);
		if (typeof res !== 'undefined') {
			// console.log('Write file success');
			swal("Good job!", "Sync games success", "success");
		} else {
			swal("Error!", "No Data Response", "error");
		}
	});
}

function callGames(filename, parameters) {
	c.doCall(function (session) {
		// console.log('!! parameters !!',parameters);
		session.call('/casino#getGames', [], parameters).then(function (result) {
			// console.log('call games result :', result);
			writeJsonFile(filename, result);
		}, function (err) {
			console.log('An error happens. desc="%s"; detail="%s"', err.kwargs.desc, err.kwargs.detail);
		});
	});
}

function callSessionInfo(category, jsonOBJ, advance) {
	var login = false;
	c.doCall(function (session) {
		session.call("/user#getSessionInfo", []).then(
			function (result) {
				if (result.kwargs.isAuthenticated) {
					login = true;
				} 
				appendGames(category, jsonOBJ, advance, login);
			}
		, function (err) {
			console.log(err);
			c.conn.close();
		});
	});
}

function appendGames(category, jsonOBJ, advance, login){
	var pageIdBox;
	var template_name;

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

	if (typeof advance === 'undefined') {
		pageIdBox = category + '-Box';
		template_name = 'https://aurumstage.s3.amazonaws.com/static/handlebars/games/games.hbs';
		// template_name = '/static/handlebars/games/games.hbs';
	}else {
		pageIdBox = advance + '-Box';
		template_name = 'https://aurumstage.s3.amazonaws.com/static/handlebars/games/game_select.hbs';
		// template_name = '/static/handlebars/games/game_select.hbs';
	}

	// console.log('pageIdBox == '+pageIdBox);
	// console.log('!!!!!!! isLogin == '+login);

	var template_hook = function (data) {
		return {
			games: data.kwargs.games,
			mode: 'game',
			languagecode: c.language,
			isLogin: login
		};
	}

	$.get(template_name, function (html) {
		var data = template_hook(jsonOBJ);
		
		var Template = Handlebars.compile(html);
        gameHTML = Template(data);
        // console.log('gameHTML',gameHTML);
		$('#' + pageIdBox + ' .game-body').html('<div class="game-screen" data-value="' + category + '">' + gameHTML + '</div>');

		if (typeof advance === 'undefined') {
			removeHiddenGame(category);
		} else {
			removeHiddenGame(advance);
		}
    }, 'html');
}

function readGamesOnfile(category,advance) {

	if (category == 'game-select' || category == '' || category == 'allGames') {
		category = 'allGames';
	}

	var url = '/api/readGamesData/';
    // console.log('====> lang: '+ window._EM.language_code);
	// if( window._EM.language_code != 'en'){
	// 	url = '/'+window._EM.language_code+url;
	// }
	// console.log('URL== '+url)

	$.ajax({
		type: "POST",
		url: url,
		data: {
			filename: category
		},
		dataType: "text",
		cache: false,
	}).done(function (res) {
		// console.log('readGamesOnfile res !! : '+res);
		var jsonOBJ = JSON.parse(res);
        callSessionInfo(category, jsonOBJ, advance);
	});
}