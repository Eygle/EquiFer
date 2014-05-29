var HomeView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "home.html";
	this.tabLabel			= "home";

	var _this = this;

	this.init = function() {
		$.getJSON(Config.historyApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"date",		title:Strings.HISTORY_LABEL_DATE,		dataType:"string"},
				{label:"category",	title:Strings.HISTORY_LABEL_CATEGORY,	dataType:"string"},
				{label:"action",	title:Strings.HISTORY_LABEL_ACTION,		dataType:"string"},
			];
			new SortableList("history", titles, _this.formatData(data), function(id) {
				ManageView.push(new AnimalDetails(id));
			}, function(x, y, id) {
				var background = $('<div>').attr('id', "rightClickBack").click(function() {
					$(this).remove();
					$("#" + id).removeClass('tr_selected');
					document.oncontextmenu = function() {return true;};
				});
				var popup = $('<div>').attr('id', 'rightClickPopup').css({left: x, top: y});
				var button = $('<div>').attr({class:'rightClickButton delete-icon', id: id}).text(Strings.REMOVE).click(function() {
					document.oncontextmenu = function() {return true;};
					$('#rightClickBack').remove();
					var name = $('#history #' + this.id + " [label=action]").text();
					if (confirm(Strings.CONFIRM_DELETE.replace('$1', name))) {
						$.post(Config.historyApi, {action:"delete", id:this.id}, function() {
							ManageView.display();
						});
					} else {
						$("#" + id).removeClass('tr_selected');
					}
				});
				$('body').append(background.append(popup.append(button)));
			});
		});
	};

	this.formatData = function(data) {
		for (var i in data) {
			if (data[i]['category'] == "animals" || data[i]['category'] == "clients") {
				switch (data[i]['action']) {
					case 'add':
					data[i]['action'] = Strings.HISTORY_SENTENCE_ADD.replace('$1', data[i]['object']);
					break;
					case 'edit':
					data[i]['action'] = Strings.HISTORY_SENTENCE_EDIT.replace('$1', data[i]['object']);
					break;
					case 'delete':
					data[i]['action'] = Strings.HISTORY_SENTENCE_DELETE.replace('$1', data[i]['object']);
					break;
					case 'add_perf':
					data[i]['action'] = Strings.HISTORY_SENTENCE_ADD_PERF.replace('$1', data[i]['object']).replace('$2', data[i]['object2']);
					break;
					case 'edit_perf':
					data[i]['action'] = Strings.HISTORY_SENTENCE_EDIT_PERF.replace('$1', data[i]['object']).replace('$2', data[i]['object2']);
					break;
					case 'delete_perf':
					data[i]['action'] = Strings.HISTORY_SENTENCE_DELETE_PERF.replace('$1', data[i]['object']).replace('$2', data[i]['object2']);
					break;
					case 'add_animal':
					data[i]['action'] = Strings.HISTORY_SENTENCE_ADD_ANIMAL.replace('$1', data[i]['object']).replace('$2', data[i]['object2']);
					break;
					case 'delete_animal':
					data[i]['action'] = Strings.HISTORY_SENTENCE_DELETE_ANIMAL.replace('$1', data[i]['object']).replace('$2', data[i]['object2']);
					break;
				}
			}

			switch(data[i]['category']) {
				case 'animals':
				data[i]['category'] = Strings.TAB_ANIMALS;
				break;
				case 'clients':
				data[i]['category'] = Strings.TAB_CLIENTS;
				break;
				case 'bills':
				data[i]['category'] = Strings.TAB_BILLS;
				if (data[i]['action'] == 'add')
					data[i]['action'] = Strings.HISTORY_SENTENCE_BILL_ADD.replace('$1', data[i]['object']);
				break;
				case 'perfs':
				data[i]['category'] = Strings.TAB_PERF;
				if (data[i]['action'] == 'add')
					data[i]['action'] = Strings.HISTORY_SENTENCE_PERF_ADD.replace('$1', data[i]['object']);
				if (data[i]['action'] == 'edit')
					data[i]['action'] = Strings.HISTORY_SENTENCE_PERF_EDIT.replace('$1', data[i]['object']);
				if (data[i]['action'] == 'delete')
					data[i]['action'] = Strings.HISTORY_SENTENCE_PERF_DELETE.replace('$1', data[i]['object']);
				break;
				case 'stocks':
				data[i]['category'] = Strings.TAB_STOCKS;
				break;
				case 'settings':
				data[i]['category'] = Strings.SETTINGS;
				if (data[i]['action'] == 'edit_owner_infos')
					data[i]['action'] = Strings.HISTORY_SENTENCE_SETTINGS_OWNER;
				break;
			}
		}
		return data;
	};
};