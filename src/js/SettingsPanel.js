var SettingsPanel = function() {

	this.timeout = null;
	this.MESSAGE_APPEAR_DURATION = 3000;

	var _this = this;

	this.init = function() {
		$('<div>').attr('id', 'panel-settings')
		.click(this.destroy)
		.load("includes/settings.html", function() {
			$('#panel-settings, #panel-settings .close').click(_this.destroy);
			$('.set-content').click(function() {return false;});
			_this.display($('.set-menu .selected').attr('label'));
			$('.set-menu-item').click(function() {
				$('.set-menu-item').removeClass('selected');
				$(this).addClass('selected');
				$('#panel-settings .view').hide();
				_this.display($(this).attr('label'));
			});
			_this.align();
		}).appendTo('body');

		$(window).resize(this.align);
	};

	this.display = function(label) {
		switch (label) {
			case "user":
				_this.initUser();
			break;
		}
	};

	this.initUser = function() {
		$('#settings-user button').click(function() {
			var params = {
				action: 		'editUser',
				address:		$('#settings-user #address').val(),
				zipcode:		$('#settings-user #zipcode').val(),
				city:			$('#settings-user #city').val(),
				phoneFixe:		$('#settings-user #phoneFixe').val(),
				phoneMobile:	$('#settings-user #phoneMobile').val(),
				mail:			$('#settings-user #mail').val(),
				companyName:	$('#settings-user #companyName').val(),
				siret:			$('#settings-user #siret').val()
			};

			if (!_this.checkUserInfos(params)) return;
			$.post(Config.settingsApi, params, function() {
				History.add("settings", "edit_owner_infos", 0,  "", null,  true, true, function() {
					_this.displayMessage(true, Strings.MESSAGE_SAVE_SUCESS);
				});
			});
		});

		$.getJSON(Config.settingsApi, {action: 'getUser'}, function(data) {
			$('#settings-user').show();
			$("#settings-user #address").val(data.address);
			$("#settings-user #zipcode").val(data.zipcode).autocomplete({
				source : Config.citiesApi,
				select : function(event, ui) {
					$("#settings-user #zipcode").val(ui.item.zipcode);
					$("#settings-user #city").val(ui.item.city);
					return false;
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				return $("<li>").data("ui-item.autocomplete", item).append(
					'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
			};
			$("#settings-user #city").val(data.city).autocomplete({
				source : Config.citiesApi,
				select : function(event, ui) {
					$("#settings-user #zipcode").val(ui.item.zipcode);
					$("#settings-user #city").val(ui.item.city);
					return false;
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				return $("<li>").data("ui-item.autocomplete", item).append(
					'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
			};
			$("#settings-user #phoneFixe").val(data.phoneFixe);
			$("#settings-user #phoneMobile").val(data.phoneMobile);
			$('#settings-user #mail').val(data.mail);
			$('#settings-user #siret').val(data.siret);
			$('#settings-user #companyName').val(data.companyName);
		});
	};

	this.checkUserInfos = function(data) {
		var mailRegexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!data.address) {
			this.displayMessage(false, Strings.SETTINGS_USER_REQUIRE_ADDRESS);
			return false;
		} else if (!data.zipcode) {
			this.displayMessage(false, Strings.SETTINGS_USER_REQUIRE_ZIPCODE);
			return false;
		} else if(!data.mail) {
			this.displayMessage(false, Strings.SETTINGS_USER_REQUIRE_MAIL);
			return false;
		} else if (!mailRegexp.test(data.mail)) {
			this.displayMessage(false, Strings.SETTINGS_USER_MAIL_WRONG_FORMAT);
			return false;
		} else if (!data.phoneFixe && !data.phoneMobile) {
			this.displayMessage(false, Strings.SETTINGS_USER_REQUIRE_PHONE);
			return false;
		} else if (!data.companyName) {
			this.displayMessage(false, Strings.SETTINGS_USER_REQUIRE_COMPANY);
			return false;
		}
		return true;
	};

	this.displayMessage = function(success, message) {
		clearTimeout(this.timeout);
		$('.set-content .message').remove();
		$('<div>').attr('class', 'message ' + (success ? "success" : "error")).text(message).appendTo('.set-content');
		$('.message').css('left', ($(".set-content").width() - $('.message').width()) / 2);
		this.timeout = setTimeout(function() {
			$('.set-content .message').fadeOut(700, function() {
				$(this).remove();
			});
		}, this.MESSAGE_APPEAR_DURATION);
	};

	this.align = function() {
		var set = $('.set-content');
		var content = $('#panel-settings');
		set.css({
			left: (content.width() - set.width()) / 2,
			top: (content.height() - set.height()) /2
		});
	};

	this.destroy = function() {
		$('#panel-settings').remove();
		$(window).off("resize", this.display);
	};

	this.init();
};