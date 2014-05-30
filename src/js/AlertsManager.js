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
				break;
			case 'weekly':
				data[i]['frequency'] = Strings.WEEKLY;
				break;
			case 'monthly':
				data[i]['frequency'] = Strings.MONTHLY;
				break;
		}
	}
	return data;
};

AlertsManager.createAlertsList = function(cat, id, name) {
	$.get(Config.alertsApi, {
		'action':	'getProgrammedAlertsList',
		'category':	'animals',
		'id': 		id
	}, function(data) {
		titles = [
			{label:"frequency",	title:Strings.ALERTS_LABEL_FREQUENCY,	dataType:"string"},
			{label:"from",		title:Strings.ALERTS_LABEL_FROM,		dataType:"string"},
			{label:"title",		title:Strings.ALERTS_LABEL_TITLE,		dataType:"string"},
		];
		new SortableList('alertsList', titles, AlertsManager.formatData(data), function(id) {
			//TODO ??? Edit ?
		}, function(x, y, id) {
			var background = $('<div>').attr('id', "rightClickBack").click(function() {
				$(this).remove();
				$("#" + id).removeClass('tr_selected');
				document.oncontextmenu = function() {return true;};
			});
			var popup = $('<div>').attr('id', 'rightClickPopup').css({left: x, top: y});
			var button1 = $('<div>').attr({class:'rightClickButton quantity-icon', id: id}).text(Strings.MODIFY).click(function() {
				document.oncontextmenu = function() {return true;};
				$('#rightClickBack').remove();
				// TODO Open edit alert perspective
			});
			var button2 = $('<div>').attr({class:'rightClickButton delete-icon', id: id}).text(Strings.REMOVE).click(function() {
				document.oncontextmenu = function() {return true;};
				$('#rightClickBack').remove();
				var id = this.id;
				$.post(Config.alertsApi, {
					action:			'deleteProgrammedAlert',
					id:				id
				}, function() {
					History.add(cat, "delete_alert", 0, name,  $("#alertsList #" + id + " [label=name]").text(), true, true, function() {
						ManageView.display();
					});
				});
			});
			$('body').append(background.append(popup.append(button1).append(button2)));
		});
	});
};