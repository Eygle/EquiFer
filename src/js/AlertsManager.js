var formatWeekDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

var AlertsManager = function() {};

AlertsManager.formatData = function(data) {
	for (var i in data) {
		switch (data[i]['category']) {
			case 'animals':
				data[i]['category'] = Strings.TAB_ANIMALS;
				break;
			case 'clients':
				data[i]['category'] = Strings.TAB_CLIENTS;
				break;
			case 'stocks':
				data[i]['category'] = Strings.TAB_STOCKS;
				break;
		}
		switch (data[i]['frequency']) {
			case 'daily':
				data[i]['frequency'] = Strings.DAILY;
				data[i]['from'] = null;
				break;
			case 'weekly':
				data[i]['frequency'] = Strings.WEEKLY;
				data[i]['from'] = formatWeekDay[data[i]['from']];
				break;
			case 'monthly':
				data[i]['frequency'] = Strings.MONTHLY;
				break;
		}
	}
	return data;
};

// AlertsManager.checkParams = function(params) {
// 	if (!params.title || params.title.length > 255) {
// 		alert(Strings.ALERTS_REQUIRE_TITLE);
// 		return false;
// 	}
// 	return true;
// };

AlertsManager.displayAlertFormView = function(cat, id, name, data) {
	CustomPopupManager.display("includes/alert-form.html", function() {
		FrequencyFormManager.init("#custom-popup-background", function(params) {
			params.id = data ? data['id'] : undefined;
			params.action = data ? 'editProgrammedAlert' : 'addProgrammedAlert';
			params.title = $("#custom-popup-background #title").val();
			params.category = cat;
			params.objectId = id;
			if (!params.title || params.title.length > 255) {
				alert(Strings.ALERTS_REQUIRE_TITLE);
				return false;
			}
			$.post(Config.alertsApi, params, function() {
				History.add(cat, data ? "edit_alert" : "add_alert", 0, name, params.title, true, true, function() {
					CustomPopupManager.destroy();
					ManageView.display();
				});
			});
		}, true);
		if (data) {
			$('#custom-popup-background #title').val(data['title']);
			FrequencyFormManager.initValuesFromData("#custom-popup-background", data);
		}
		// $('#frequency').change(function(event) {
		// 	switch($(this).val()) {
		// 		case 'daily':
		// 			$('#date').attr('type', 'hidden');
		// 			$('.ui-datepicker-trigger').hide();
		// 			$('#from').hide();
		// 			$('label [for=from]').hide();
		// 			break;
		// 		case 'weekly':
		// 			$('#date').attr('type', 'hidden');
		// 			$('.ui-datepicker-trigger').hide();
		// 			$('#from').show().html('<option value="1">Lundi</option><option value="2">Mardi</option><option value="3">Mercredi</option><option value="4">Jeudi</option><option value="5">Vendredi</option><option value="6">Samedi</option><option value="0">Dimanche</option>');
		// 			$('label [for=from]').text("A partir du").show();
		// 			break;
		// 		case 'monthly':
		// 			$('#date').attr('type', 'hidden');
		// 			$('.ui-datepicker-trigger').hide();
		// 			var from = $('#from');
		// 			from.show().html("");
		// 			for (var i = 1; i <= 31; i++) {
		// 				from.append($('<option>').attr('value', i).text(i));
		// 			}
		// 			break;
		// 		case 'unique':
		// 			$('label [for="from"]').text("Le");
		// 			$('#from').hide();
		// 			$('.ui-datepicker-trigger').show();
		// 			$('#date').attr('type', 'text');
		// 			break;
		// 	}
		// });
		// $('.set-data button').click(function() {
		// 	var freq = $('#frequency').val();
		// 	var params = {
		// 		action:		data ? 'editProgrammedAlert' : 'addProgrammedAlert',
		// 		id:			data ? data['id'] : undefined,
		// 		title:		$('#title').val(),
		// 		frequency:	freq,
		// 		from:		freq == "unique" ? $("#date").val() : $('#from').val(),
		// 		category:	cat,
		// 		objectId:	id,
		// 	};
		// 	if (!AlertsManager.checkParams(params));
		// 	$.post(Config.alertsApi, params, function() {
		// 		History.add(cat, data ? "edit_alert" : "add_alert", 0, name, params.title, true, true, function() {
		// 			CustomPopupManager.destroy();
		// 			ManageView.display();
		// 		});
		// 	});
		// });

		// $('#date').datepicker({
		// 	dateFormat: 'dd/mm/yy',
		// 	changeMonth: true,
		// 	changeYear: true,
		// 	showButtonPanel: true,
		// 	showOn: "button",
		// 	buttonImage: "images/calendar.png",
		// 	buttonImageOnly: true
		// });
		// $('.ui-datepicker-trigger').hide();

		// if (data) {
		// 	$('#frequency').val(data['frequency']).trigger('change');
		// 	if (data['frequency'] == 'unique') {
		// 		$('#from').hide();
		// 		$('#date').val(data['from']).show();
		// 		$('.ui-datepicker-trigger').show();
		// 	} else {
		// 		$('#from').val(data['from']).show();
		// 		$('.ui-datepicker-trigger').hide();
		// 		$('#date').hide();
		// 	}
		// 	$('#title').val(data['title']);
		// }
	});
};

AlertsManager.createAlertsList = function(cat, id, name) {
	// Bind Add alert button
	$('#addAlert').text(Strings.ALERTS_LABEL_ADD).click(function() {
		AlertsManager.displayAlertFormView(cat, id, name);
	});

	$.getJSON(Config.alertsApi, {
		'action':	'getProgrammedAlertsList',
		'category':	cat,
		'id': 		id
	}, function(data) {
		titles = [
			{label:"frequency",	title:Strings.ALERTS_LABEL_FREQUENCY,	dataType:"string"},
			{label:"from",		title:Strings.ALERTS_LABEL_FROM,		dataType:"string"},
			{label:"title",		title:Strings.ALERTS_LABEL_TITLE,		dataType:"string"},
		];
		new SortableList('alertsList', titles, AlertsManager.formatData(data), null, function(id) {
			//TODO ??? Edit ?
		}, function(x, y, id) {
			var background = $('<div>').attr('id', "rightClickBack").click(function() {
				$(this).remove();
				$("#" + id).removeClass('tr_selected');
				document.oncontextmenu = function() {return true;};
			});
			var popup = $('<div>').attr('id', 'rightClickPopup').css({left: x, top: y});
			var button1 = $('<div>').attr({class:'rightClickButton edit-icon', id: id}).text(Strings.EDIT).click(function() {
				document.oncontextmenu = function() {return true;};
				$('#rightClickBack').remove();
				$("#" + id).removeClass('tr_selected');
				$.getJSON(Config.alertsApi, {
					action:	'getProgrammedAlert',
					id: 	id
				}, function(data) {
					AlertsManager.displayAlertFormView(cat, id, name, data);
				});
			});
			var button2 = $('<div>').attr({class:'rightClickButton delete-icon', id: id}).text(Strings.REMOVE).click(function() {
				document.oncontextmenu = function() {return true;};
				$('#rightClickBack').remove();
				var id = this.id;
				$.post(Config.alertsApi, {
					action:			'deleteProgrammedAlert',
					id:				id
				}, function() {
					History.add(cat, "delete_alert", 0, name,  $("#alertsList #" + id + " [label=title]").text(), true, true, function() {
						ManageView.display();
					});
				});
			});
			$('body').append(background.append(popup.append(button1).append(button2)));
		});
	});
};