var SettingsPanel = function() {

	//this.messageManager = new MessageManager();

	var _this = this;

	this.init = function() {
		CustomPopupManager.display("includes/settings.html", function() {
			_this.display($('.set-menu .selected').attr('label'));
			$('.set-menu-item').click(function() {
				$('.set-menu-item').removeClass('selected');
				$(this).addClass('selected');
				$('#custom-popup-background .view').hide();
				_this.display($(this).attr('label'));
			});
			_this.initCompany();
			_this.initSecurity();
		});
	};

	this.display = function(label) {
		switch (label) {
			case "company":
				_this.displayCompany();
			break;
			case "security":
				_this.displaySecurity();
			break;
		}
	};

	/*
	* 	Company
	*/

	this.initCompany = function() {
		$('#settings-company button').click(function() {
			var params = {
				action: 		'editCompany',
				address:		$('#settings-company #address').val(),
				zipcode:		$('#settings-company #zipcode').val(),
				city:			$('#settings-company #city').val(),
				phoneFixe:		$('#settings-company #phoneFixe').val(),
				phoneMobile:	$('#settings-company #phoneMobile').val(),
				mail:			$('#settings-company #mail').val(),
				name:			$('#settings-company #name').val(),
				siret:			$('#settings-company #siret').val()
			};

			if (!CheckForms.check("#settings-company", params, [
					{item:'address',		id:"address",		error:Strings.SETTINGS_COMPANY_REQUIRE_ADDRESS},
					{item:'zipcode',		id:"zipcode",		error:Strings.SETTINGS_COMPANY_REQUIRE_ZIPCODE},
					{item:'city',			id:"city",			error:Strings.SETTINGS_COMPANY_REQUIRE_CITY},
					{items:[
						{item:'phoneFixe',		id:"phoneFixe"},
						{item:'phoneMobile',	id:"phoneMobile"}
						],	error:Strings.SETTINGS_COMPANY_REQUIRE_PHONE},
					{item:'mail',			id:"mail",			error:Strings.SETTINGS_COMPANY_REQUIRE_MAIL,	format:"mail",	formatError:Strings.SETTINGS_COMPANY_MAIL_WRONG_FORMAT},
					{item:'name',			id:"name",			error:Strings.SETTINGS_COMPANY_REQUIRE_COMPANY}
				])) return;

			$.post(Config.settingsApi, params, function() {
				History.add("settings", "edit_company_infos", 0,  "", null,  true, true, function() {
					CheckForms.displayMessage(".set-content", true, Strings.MESSAGE_SAVE_SUCESS);
					$('.message').css('left', ($(".set-content").width() - $('.alert').width()) / 2);
				});
			});
		});
	};

	this.displayCompany = function() {
		$.getJSON(Config.settingsApi, {action: 'getCompany'}, function(data) {
			$('#settings-company').show();
			$("#settings-company #address").val(data.address);
			$("#settings-company #zipcode").val(data.zipcode).autocomplete({
				source : Config.citiesApi,
				select : function(event, ui) {
					$("#settings-company #zipcode").val(ui.item.zipcode);
					$("#settings-company #city").val(ui.item.city);
					return false;
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				return $("<li>").data("ui-item.autocomplete", item).append(
					'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
			};
			$("#settings-company #city").val(data.city).autocomplete({
				source : Config.citiesApi,
				select : function(event, ui) {
					$("#settings-company #zipcode").val(ui.item.zipcode);
					$("#settings-company #city").val(ui.item.city);
					return false;
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				return $("<li>").data("ui-item.autocomplete", item).append(
					'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
			};
			$("#settings-company #phoneFixe").val(data.phoneFixe);
			$("#settings-company #phoneMobile").val(data.phoneMobile);
			$('#settings-company #mail').val(data.mail);
			$('#settings-company #siret').val(data.siret);
			$('#settings-company #name').val(data.name);
		});
	};


	/*
	*	Security
	*/

	this.initSecurity = function() {
		$('#settings-security #activate').change(function(event) {
			if (this.checked)
				$('#settings-security #save_active').show();
			else {
				$('#settings-security #frequency').val("weekly").trigger('change');
				$('#settings-security #save_active').hide();
			}
		});

		FrequencyFormManager.init("#settings-security", function(params) {
			params.action = 'editSecurity';
			params.active = $("#settings-security #activate").is(":checked") ? 1 : 0;

			$.post(Config.settingsApi, params, function() {
				History.add("settings", "edit_security", 0,  "", null,  true, true, function() {
					CheckForms.displayMessage(".set-content", true, Strings.MESSAGE_SAVE_SUCESS);
				});
			});
		}, false, false);
	};

	this.displaySecurity = function() {
		$.getJSON(Config.settingsApi, {action: 'getSecurity'}, function(data) {
			$('#settings-security').show();
			$('#settings-security #activate').prop("checked", data.active);
			if (data.active)
				$('#settings-security #save_active').show();
			else
				$('#settings-security #save_active').hide();
			FrequencyFormManager.initValuesFromData("#settings-security", data);
		});
	};

	this.init();
};