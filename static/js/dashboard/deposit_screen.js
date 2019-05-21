var currency = "";
var prepareParams,paymentForm,redirectionWindow;
var data_get = "";
var searchParams = new URLSearchParams(window.location.search);

function fillDateForms() {
	//Gen months
	var thisMonth = new Date().getMonth();
	var monthlist = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	var months = [];
	var a = 0;
	var selected = "";
	months.push('<option value="">Month</option>');
	for (i = 1; i < 13; i++) {
		if (i < 10) {
			i = ('0' + i).slice(-2);
		}
		//if (thisMonth == a){ selected='selected' } else { selected = ""; }
		months.push('<option value="' + i + '" ' + selected + '>' + i + '</option>');
		a++;
	}
	//Gen years
	var thisYear = new Date().getFullYear();
	var years = [];
	var a = 0;
	var selected = "";
	years.push('<option value="">Year</option>');
	for (i = thisYear; i < thisYear + 20; i++) {
		//if (a == 0) {selected = " selected='selected' ";} else {selected = "";}
		years.push('<option value="' + (
			thisYear + a) + '" ' + selected + '>' + (
			thisYear + a) + '</li>');
		a++;
	}
	$('.dropdown-menu-month').html(months);
	$('.dropdown-menu-year').html(years);
}

function setDataShowPayment(response) {
	value = response;

	if (value != null) {
		var myRegex = /\<img.+src\s*=\s*"([^"]+)"/g;
		var test = value.icon;
		var src = myRegex.exec(test)[1];

		if (typeof src !== 'undefined') {
			value.icon = src;
		}

		var amountarr = [];
		$.each(value.fields.amount.limits, function (index, value) {
			amountarr[index] = value;
		});

		value.mycurrency = currency;
		value.minlimit = amountarr['NOK'].min;
		value.maxlimit = amountarr['NOK'].max;

		//console.log(value);
		data_get = value;
		var template_base = '/static/handlebars/dashboard/deposit_screen.hbs';
		$.get(template_base, function (html) {
			var Template = Handlebars.compile(html);
			limitData = $.extend({}, value, '');
			Handlebars.registerHelper('inputselect', function (conditional, options) {
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
			var HTML = Template(limitData);
			$("#deposit_screen").html(HTML);
			/* Back from redirect */
			if (searchParams.get('pid') != null && searchParams.get('pid') != '') {
				$('#deposit_step1').hide();
			}
			/* Back from redirect end */

			$("#currency").val(currency);
			if (value.paymentMethodCode == "MoneyMatrix_CreditCard") {
				fillDateForms();
				loadMoneyMatrixFields();
				loadRadioCheckVisa();
			}

			if ($(window).width() <= 650) {
				if ($("#mobile-quick-ds .quicklist").length > 0 && $("#mobile-quick-ds .quicklist").length == 1) {
					$('#amount').val($('#mobile-quick-ds .quick_amount').val());
				}
			} else {
				if ($("#desktop-quick-ds .quicklist").length > 0 && $("#desktop-quick-ds .quicklist").length == 1) {
					$('#amount').val($('#desktop-quick-ds .quick_amount').val());
				}
			}
		});
	}
}

function getTransactionInfoFrom(session, args) {
	session.call('/user/deposit#getTransactionInfo', [], args).then(function (result) {
		console.log('%cTransaction ', 'font-weight:bold', result);
		if (result.kwargs.status == 'success') {
			var value_confirm = result.kwargs;
			var template_base = '/static/handlebars/dashboard/deposit_screen_confirm.hbs';
			$.get(template_base, function (html) {
				var Template3 = Handlebars.compile(html);
				var limitData3 = $.extend({}, value_confirm, '');
				Handlebars.registerHelper('trans', function (title) {
					var t = gettext(title);
					return t;
				});
				var HTML3 = Template3(limitData3);
				$("#deposit_screen_confirm").html(HTML3);
			});
		} else {
			$("#deposit_screen_confirm").html(result.kwargs.desc);
		}
		$("#deposit_step1,#deposit_step2").hide();
		$("#deposit_step3").show();
		callGetMoney();
	}, function (err) {
		console.log(err);
		setError(err.kwargs.desc);
	});
}

function getBonus(session, args, callback) {
	session.call('/user#getApplicableBonuses', [], args).then(function (result) {
		if(result.kwargs) {
			console.log('%cgetApplicableBonuses :', 'background:black;color:orange', result.kwargs);
			if(typeof callback == 'function')
				callback(result.kwargs);
		}
	},
	function (e) {
		c.handleError(e);
	});
}

function getPaymentMethodCfg(session, args) {
	session.call('/user/deposit#getPaymentMethodCfg', [], args).then(function (result) {
		var res = value = result.kwargs;
		console.log('%cgetPaymentMethodCfg :', 'background:black;color:orange', res);
		
		prepareParams = function() {
			return {
				gamingAccountID: res.fields.gamingAccountID.options[0].id,
				currency: res.fields.gamingAccountID.options[0].currency,
				amount: 0,
				bonusCode: "",
				returnURL: null
			}
		}
		
		if(res.icon)
			$('.payment-logo').append(res.icon);

		if(res.paymentMethodCode == 'MoneyMatrix_CreditCard'){
			$('#CreditCardBox').removeClass('hidden');



			// $('#CreditCardBoxChoose-1').append('<div class="col-md-12" style="margin-bottom: 15px;">\n\
			// 		<div>\n\
			// 			<input type="radio" value="'+bank_no+'" id="old-bank-'+count+'" name="old-bank-choice">\n\
			// 			<label for="old-bank-bank-'+count+'" style="margin-bottom:0;cursor: pointer;">'+bank_no+'</label>\n\
			// 		</div>\n\
			// 		</div>');
		}	

		getBonus(session, {
			"type": "deposit",
			"gamingAccountID": res.fields.gamingAccountID.options[0].id
		}, function(result){
			// Add script to set bonuses to each page here...
		});
	},
	function (err) {
		console.log(err);
	});
}

function loadMoneyMatrixFields() {
	$('#credit_deposit_cvv').show();
	var resultUrl = $("#secureFormScriptUrl").val();

	$.getScript(resultUrl, function () {
		paymentForm = new window.CDE.PaymentForm({
			'card-number': {
				selector: '#credit-card-number-wrapper',
				css: {
					'font-size': '18px',
					'height': '30px',
					'line-height': '28px',
					'font-family': 'Arial',
					'color': '#333',
					'background-color': 'white',
					'text-align': 'left',
					'vertical-align': 'middle',
					'direction': 'ltr'
				}
			},
			'card-security-code': {
				selector: '#credit-card-cvc-wrapper',
				css: {
					'font-size': '18px',
					'height': '30px',
					'line-height': '28px',
					'font-family': 'Arial',
					'color': '#333',
					'background-color': 'white',
					'text-align': 'center',
					'vertical-align': 'middle',
					'direction': 'ltr'
				}
			}
		});
	});
}

function loadRadioCheckVisa() {
	if (data_get.fields.payCardID.maximumPayCards == data_get.fields.payCardID.options.length) {
		$("input[name=chooseCreditType][value='exist']").prop("checked", true);
		showExistCard();
		$(".classCreditType").hide();
	} else if ((data_get.fields.payCardID.maximumPayCards > data_get.fields.payCardID.options.length) && (data_get.fields.payCardID.options.length > 0)) {
		$("input[name=chooseCreditType][value='exist']").prop("checked", true);
		showExistCard();
	} else if (data_get.fields.payCardID.options.length == 0) {
		$("input[name=chooseCreditType][value='register']").prop("checked", true);
		showNewCard();
		$(".classCreditType").hide();
	} else {
		$("input[name=chooseCreditType][value='register']").prop("checked", true);
		showNewCard();
	}
}

function showExistCard() {
	$(".newCardInput").hide();
	$(".class_payCardID").show();
}

function showNewCard() {
	$(".newCardInput").show();
	$(".class_payCardID").hide();
}

function setError(err) {
	$('#updateresult').html('<font color=red>' + err + '</font>');
}
function confirmDeposit(session, args) {
	$('.loading').show();

	session.call('/user/deposit#confirm', [], args).then(function (result) {
		$('.loading').hide();
		if (result.kwargs.status == "success") {
			console.log('%cconfirm :%c SUCCESSED', 'background:black;color:orange', 'color:lawngreen', value_prepare);
			c.doCall(function (session) {
				getTransactionInfoFrom(session, {
					pid: result.kwargs.pid
				});
			});
		} else if (result.kwargs.status == "redirection") {
			console.log('%cconfirm :%c REDIRECTION', 'background:black;color:orange', 'color:white');
			if(result.kwargs.redirectionForm) {
				var rf = $(result.kwargs.redirectionForm);
				var windowName = 'redirectionConfirm';
				var windowParams = function() {
					var w = window.outerWidth * 0.7;
					var h = window.outerHeight * 0.8;
		
					return [
						'height=' + h,
						'width=' + w,
						'left=0',
						'fullscreen=yes',
						'scrollbars=no',
						'status=yes',
						'resizable=yes',
						'menubar=no',
						'toolbar=no',
						'addressbar=no',
						'location=no'
					].join(',');
				}

				redirectionWindow = window.open('/account/deposit/confirm', 'redirectionConfirm', windowParams());

				rf.attr('target', windowName);
				rf.appendTo(document.body).hide();
				rf.eq(0).submit();
			}
		} else {
			setError(gettext("LANG_JS_CONFIRM_ERROR"));
		}
	}, function (err) {
		$('.loading').hide();
		console.log(err);
		setError(err.kwargs.desc);
	});
}

function prepareDeposit(session, args) {
	$('.loading').show();

	var params = {
		"paymentMethodCode": value.paymentMethodCode,
		"fields": args
	}

	params.fields.returnURL = window.location.protocol + '//' + window.location.host + window.location.pathname + "status?";
	console.log('%cprepare params:', 'background:black;color:orange', params);

	session.call('/user/deposit#prepare', [], params).then(function (result) {
		$('.loading').hide();

		var value_prepare = result.kwargs;
		console.log('%cprepare :%c SUCCESSED', 'background:black;color:orange', 'color:lawngreen', value_prepare);

		if(value_prepare) {
			$('#step2').addClass('hidden');

			$('#step3').addClass('show');

			$('#step3').find('input[name=pid]').val(value_prepare.pid);
			$('#step3').find('.confirm-deposit-amount').text(value_prepare.debit.amount.toFixed(2) + " " + getSymbol(value_prepare.debit.currency));
			$('#step3').removeClass('hidden');
		}

	}, function (err) {
		$('.loading').hide();
		console.log(err);
		setError(err.kwargs.desc);
	});
}

function setDeposit(session, args) {
	// $('.loading').show();
	var params = prepareParams();
	args = $.extend(params, args, '');

	// console.log('%csetDeposit params: ', 'background:black;color:orange', args);
	
	if (value.paymentMethodCode == "MoneyMatrix_CreditCard") {
		if (args.chooseCreditType == "exist") {
			var cardToken = $("#payCardID").find('option:selected').attr('data-cardtoken');
			paymentForm.submitCvv({ CardToken: cardToken }).then(function (data) {
				if (data.Success == true) {
					c.doCall(function (session) {
						prepareDeposit(session, args);
					});
				} else {
					setError(gettext("LANG_JS_THE_CVV_ERROR"));
				}
			}, function (data) {
				setError(gettext("LANG_JS_THE_CVV_NOT_VALID"));
				return;
			});
		} else {
			if (!paymentForm.fields['card-number'].valid) {
				setError(gettext('LANG_JS_PLEASE_INPUT_CORRECT_CREDITCARDNUMBER'));
				return;
			} else if ($("#txtName").val() == "") {
				setError(gettext('LANG_JS_PLEASE_INPUT_CARDHOLDERNAME'));
				return;
			} else if ($("#expMonth").val() == "") {
				setError(gettext('LANG_JS_PLEASE_INPUT_MONTH'));
				return;
			} else if ($("#expYear").val() == "") {
				setError(gettext('LANG_JS_PLEASE_INPUT_YEAR'));
				return;
			} else {
				if ($('#txtCardID').val() == "") {

					paymentForm.submit().then(function (result) {
						if (result.Success) {
							// now we have the card id and we can start the transaction
							$('#txtCardID').val(result.Data.CardToken);
							$('#txtDisplayCardNumber').val(result.Data.DisplayText);

							var param = {
								"paymentMethodCode": value.paymentMethodCode,
								"fields": {
									"cardToken": $('#txtCardID').val(),
									"cardHolderName": $("#txtName").val(),
									"cardExpiryDate": $("#expMonth").val() + "/" + $("#expYear").val(),
									"displayCardNumber": $('#txtDisplayCardNumber').val()
								}
							}
							//console.log(param);
							session.call('/user/deposit#registerPayCard', [], param).then(function (result) {
								$('.loading').hide();
								//console.log(result);
								var cardToken = result.kwargs.registeredPayCard.cardToken;
								paymentForm.submitCvv({ CardToken: cardToken }).then(function (data) {
									if (data.Success == true) {
										c.doCall(function (session) {
											prepareDeposit(session, args);
										});
									} else {
										setError(gettext("LANG_JS_THE_CVV_ERROR"));
									}
								}, function (data) {
									$('.loading').hide();
									setError(gettext("LANG_JS_THE_CVV_NOT_VALID"));
									return;
								});
							}, function (err) {
								$('.loading').hide();
								console.log(err);
								setError(err.kwargs.desc);
							});

						} else { }
					}, function (error) {
						setError(error.detail);
						return;
					});
				}

			}

		}
	} else if (value.paymentMethodCode == "MoneyMatrix_Skrill") {
		if ($('#amount').val() == '') {
			setError(gettext('LANG_JS_PLEASE_INPUT_AMOUNT'));
			return;
		}
		if ($('#SkrillEmailAddress').val() != '' && $('#SkrillEmailAddress').val() !== 'undefined') {
			c.doCall(function (session) {
				$('.loading').show();
				prepareDeposit(session, args);
			});
		} else {
			if ($('#payCardID').val() != '' && $('#payCardID').val() !== 'undefined') {
				c.doCall(function (session) {
					$('.loading').show();
					prepareDeposit(session, args);
				});
			} else {
				setError(gettext('LANG_JS_PLEASE_CHECK_PAYCARDID_SKRILL'))
				return;
			}
		}
		return;
	} else if (value.paymentMethodCode == "MoneyMatrix_Neteller") {
		if ($('#amount').val() == '') {
			setError(gettext('LANG_JS_PLEASE_INPUT_AMOUNT'));
			return;
		}
		if ($('#NetellerSecret').val() == '') {
			setError(gettext('LANG_JS_PLEASE_INPUT_NETELLER_SECRET'));
			return;
		}
		if ($('#NetellerEmailAddressOrAccountId').val() != '' && $('#NetellerEmailAddressOrAccountId').val() !== 'undefined') {
			c.doCall(function (session) {
				$('.loading').show();
				prepareDeposit(session, args);
			});
		} else {
			if ($('#payCardID').val() != '' && $('#payCardID').val() !== 'undefined') {
				c.doCall(function (session) {
					$('.loading').show();
					prepareDeposit(session, args);
				});
			} else {
				setError(gettext('LANG_JS_PLEASE_CHECK_PAYCARDID_NETELLER'))
				return;
			}
		}
		return;
	} else if (value.paymentMethodCode == "MoneyMatrix_EcoPayz") {
		if ($('#amount').val() == '') {
			setError(gettext('LANG_JS_PLEASE_INPUT_AMOUNT'));
			return;
		}
		c.doCall(function (session) {
			$('.loading').show();
			prepareDeposit(session, args);
		});
	} else if (value.paymentMethodCode == "MoneyMatrix_Trustly") {
		if ($('#amount').val() == '') {
			setError(gettext('LANG_JS_PLEASE_INPUT_AMOUNT'));
			return;
		}
		c.doCall(function (session) {
			$('.loading').show();
			prepareDeposit(session, args);
		});
	} else if (value.paymentMethodCode == "MoneyMatrix_PaySafeCard") {
		if ($('#amount').val() == '') {
			setError(gettext('LANG_JS_PLEASE_INPUT_AMOUNT'));
			return;
		}
		c.doCall(function (session) {
			$('.loading').show();
			prepareDeposit(session, args);
		});
	} else if (value.paymentMethodCode == "MoneyMatrix_Zimpler") {
		if ($('#amount').val() == '') {
			setError(gettext('LANG_JS_PLEASE_INPUT_AMOUNT'));
			return;
		}
		c.doCall(function (session) {
			$('.loading').show();
			prepareDeposit(session, args);
		});
	} else {
		c.doCall(function (session) {
			prepareDeposit(session, args);
		});
	}

	return false;
}

function getQuickDeposit() {
	var quick_code = $('.quicklist').val();
	if ($(".quicklist").length > 0) {
		$('#deposit_screen').html('Loading...');
		$('#deposit_screen_prepare,#deposit_screen_confirm').html('');
		c.doCall(function (session) {
			getPaymentMethodCfg(session, {
				paymentMethodCode: quick_code,
				payCardID: ""
			});
		});
	}
}

$(function () {
	c.doCall(function (session) {
		console.log('Payment medhod %c' + slug, 'background:black;color:orange;font-weight:bold');
		if ($(".quicklist").length) {
			console.log('%cQuick Deposit start', 'font-weight:bold');
			session.call('/user/account#getProfile', []).then(function (result) {
				$('.quick-currency').html(result.kwargs.fields.currency);
				$('.quick-deposit-box').show();
				/* Back from redirect */
				if (searchParams.get('pid') != null && searchParams.get('pid') != '') {
					c.doCall(function (session) {
						getTransactionInfoFrom(session, {
							pid: searchParams.get('pid')
						});
					});
				}
			},
			function (e) {
				c.handleError(e);
			});
		} else {
			console.log('%cDeposit start', 'font-weight:bold');
			getPaymentMethodCfg(session, {
				paymentMethodCode: slug,
				payCardID: ""
			});
		}
	});

	var curStep = 1;
	$('.next-step').on('click', function(e){
		curStep = $(e.currentTarget).data('currentStep');

		if(curStep){
			switch (curStep) {
				case 1:
					
					break;

				case 2:
					if($("#step-2-amount").val()) {
						var formObj = {};
						var inputs = $("#depositForm-step2").serializeArray();
				
						$('#updateresult').html('');
				
						$.each(inputs, function (i, input) {
							formObj[input.name] = input.value;
						});
						
						// console.log(formObj);
						c.doCall(function (session) {
							setDeposit(session, formObj);
						});
					}

					break;

				case 3:
					if($("form[name=depositPrepareForm]").length) {
						var formObj = {};
						var inputs = $("form[name=depositPrepareForm]").serializeArray();
					
						$.each(inputs, function (i, input) {
							formObj[input.name] = input.value;
						});

						c.doCall(function (session) {
							confirmDeposit(session, formObj);
						});
					}

					break;
			
				default:
					break;
			}
		}
	});

	// $("form[name='depositForm']").submit(function (event) {
	// 	var formObj = {};
	// 	var inputs = $('#depositForm').serializeArray();

	// 	$('#updateresult').html('');

	// 	$.each(inputs, function (i, input) {
	// 		formObj[input.name] = input.value;
	// 	});
		
	// 	console.log(formObj);
	// 	c.doCall(function (session) {
	// 		setDeposit(session, formObj);
	// 	});
	// });

	// $("form[name='depositPrepareForm']").submit(function (event) {
	// 	$('.loading').show();
	// 	var formObj = {
	// 		pid: $("#pid").val()
	// 	};
	// 	c.doCall(function (session) {
	// 		confirmDeposit(session, formObj);
	// 	});
	// });
});
