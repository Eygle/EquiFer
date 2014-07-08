// List view (first)

var BillsView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showSaveButton		= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "bills.html";
	this.tabLabel			= "bills";

	var _this = this;

	this.init = function() {
		$('#listView').show();
		$.getJSON(Config.billsApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"date",		title:Strings.BILLS_LABEL_DATE,		dataType:"string"},
				{label:"number",	title:Strings.BILLS_LABEL_NUMBER,	dataType:"string",	filter: true},
				{label:"client",	title:Strings.BILLS_LABEL_CLIENT,	dataType:"string",	filter: true},
				{label:"taxFree",	title:Strings.BILLS_LABEL_TAXFREE,	dataType:"float",	filter: true},
				{label:"total",		title:Strings.BILLS_LABEL_TOTAL,	dataType:"float",	filter: true},
				{label:"file",		title:Strings.BILLS_LABEL_FILE,		dataType:"string",	html: true}
			];
			new SortableList("billsList", titles, _this.formatData(data), function(term, callback) {
				$.getJSON(Config.billsApi, {
					action: 'filter',
					term: 	term,
					job: 	Config.job.toUpperCase()
				}, function(data) {
					callback(_this.formatData(data));
				});
			}, function(id) {
				ManageView.push(new BillDetails(id));
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
					var name = $('#billsList #' + this.id + " [label=number]").text();
					if (confirm(Strings.CONFIRM_DELETE_BILL.replace('$1', name))) {
						var deleteFile = confirm(Strings.CONFIRM_DELETE_BILL_FILE);
						$.post(Config.billsApi, {
							action:		"delete",
							deleteFile:	deleteFile,
							file:		this.id + ".pdf",
							id:			this.id
						}, function() {
							History.add("bills", "delete", 0, name, null, true, true, function() {
								ManageView.display();
							});
						});
					} else {
						$("#" + id).removeClass('tr_selected');
					}
				});
				$('body').append(background.append(popup.append(button)));
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new BillsClientsList());
	};

	this.formatData = function(data) {
		for (var i in data) {
			data[i]['taxFree'] = data[i]['taxFree'] + ' €';
			data[i]['total'] = data[i]['total'] + ' €';
			data[i]['file'] = '<img src="images/pdf.png"/>';
		}
		return data;
	};
};

// Clients list 

var BillsClientsList = function() {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "bills.html";
	this.tabLabel			= "bills";

	this.init = function() {
		$('#selectView').show();
		$.getJSON(Config.clientsApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"name",			title:Strings.CLIENTS_LABEL_NAME,			dataType:"string"},
				{label:"animals",		title:Strings.CLIENTS_LABEL_ANIMALS,		dataType:"string"},
				{label:"phoneMobile",	title:Strings.CLIENTS_LABEL_PHONE_MOBILE,	dataType:"int"},
				{label:"phoneFixe",		title:Strings.CLIENTS_LABEL_PHONE_FIXE,		dataType:"int"},
				{label:"address",		title:Strings.CLIENTS_LABEL_ADDRESS,		dataType:"string"},
				{label:"zipcode",		title:Strings.CLIENTS_LABEL_ZIPCODE,		dataType:"int"},
				{label:"city",			title:Strings.CLIENTS_LABEL_CITY,			dataType:"string"}
			];
			new SortableList("clientsList", titles, data, null, function(id) {
				ManageView.push(new BillFormView(id));
			});
		});
	};

	this.manageButtonClick = function(button) {};
};

// Form view

var BillFormView = function(id) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= true;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "bills.html";
	this.tabLabel			= "bills";

	this.billPDFManager		= null;

	var _this				= this;

	this.id					= id;
	this.data				= null;

	this.init = function() {
		$.getJSON(Config.billsApi, {
			action:		"getClientInfos",
			clientId:	id,
			job:		Config.job
		}, function(data) {
			_this.data = data;
			$('#formView').show();

			var $animalsList = $('#formView #animalsList');

			for (var i in _this.data.client.animalsList) {
				$animalsList.append($('<div>').attr({class: "animal", index: i})
					.text(_this.data.client.animalsList[i].name)
					.click(function() {
						_this.manageAnimalClick($(this).attr('index'));
					})
				);
				_this.data.client.animalsList[i].performancesSelected = 0;
			}
		
			$.getJSON(Config.settingsApi, {action: 'getCompany'}, function(data) {
				_this.data.infos = data;
				_this.billPDFManager = new BillPDFManager(_this.data);
			});
		});
	};

	this.manageAnimalClick = function(animalIndex) {
		var animal = _this.data.client.animalsList[animalIndex];
		$animalDiv = $("#formView #animalsList [index=" + animalIndex + "]");
		if (!$animalDiv.hasClass("selected")) {
			$("#formView #animalsList div").removeClass('selected');
			$animalDiv.addClass('selected');
			$performancesList = $('#formView #performancesList');
			$performancesList.html("");
			for (var i in animal.performancesList) {
				var perf = $('<div>')
					.attr({
						class:				"performance" + (animal.performancesList[i].isSelected ? " selected" : ""),
						animalIndex:		animalIndex,
						performanceIndex:	i
					})
					.click(function() {
						_this.managePerformanceClick(animalIndex, $(this).attr('performanceIndex'));
					})
					.text(animal.performancesList[i].formattedDate + " - " + animal.performancesList[i].name + " (x" + animal.performancesList[i].quantity + ")");
				if (animal.performancesList[i].isSelected) {
					this.addDisountsAndExtraOnPerf(perf, animalIndex, $(perf).attr('performanceIndex'));
				}

				$performancesList.append(perf);

				if (animal.performancesList[i].isSelected && animal.performancesList[i].extra) {
					$performancesList.append($('<div>').attr({
						'class':				'extra-discount',
						'animalIndex' : 		animalIndex,
						'performanceIndex' :	i
						})
						.text(Strings.EXTRA_LABEL.replace('$1', animal.performancesList[i].extra))
						.click(function() {
							_this.data.client.animalsList[$(this).attr('animalIndex')].performancesList[$(this).attr('performanceIndex')].extra = undefined;
							$(this).remove();
						})
					);
				} else if (animal.performancesList[i].isSelected && animal.performancesList[i].discount) {
					$performancesList.append($('<div>').attr({
						'class':				'extra-discount',
						'animalIndex' : 		animalIndex,
						'performanceIndex' :	i
						})
						.text(Strings.DISCOUNT_LABEL.replace('$1', animal.performancesList[i].discount))
						.click(function() {
							_this.data.client.animalsList[$(this).attr('animalIndex')].performancesList[$(this).attr('performanceIndex')].discount = undefined;
							$(this).remove();
							_this.billPDFManager.generate(_this.data);
						})
					);
				}
			}
		} else {
			$animalDiv.removeClass('selected');
			$('#formView #performancesList [animalIndex=' + animalIndex + ']').remove();
		}
	};

	this.addDisountsAndExtraOnPerf = function(perf, animalIndex, performanceIndex) {
		perf.append($('<div>').attr('class', 'extra').click(function(event) {
			event.stopImmediatePropagation();
			var total = _this.billPDFManager.formatPriceToInt(prompt(Strings.EXTRA_TITLE));
			if (isNaN(total)) return;
			_this.data.client.animalsList[animalIndex].performancesList[performanceIndex].extra = total;
			_this.data.client.animalsList[animalIndex].performancesList[performanceIndex].discount = undefined;
			_this.cleanExtraDiscountsFromPerf(perf);
			perf.after($('<div>').attr({
				'class':				'extra-discount',
				'animalIndex' : 		animalIndex,
				'performanceIndex' :	performanceIndex
				})
				.text(Strings.EXTRA_LABEL.replace('$1', _this.billPDFManager.formatPriceToShow(total)))
				.click(function() {
					event.stopImmediatePropagation();
					_this.data.client.animalsList[$(this).attr('animalIndex')].performancesList[$(this).attr('performanceIndex')].extra = undefined;
					$(this).remove();
					_this.billPDFManager.generate(_this.data);
				})
			);
			_this.billPDFManager.generate(_this.data);
		})).append($('<div>').attr('class', 'discount').click(function(event) {
			event.stopImmediatePropagation();
			var total = _this.billPDFManager.formatPriceToInt(prompt(Strings.DISCOUNT_TITLE));
			if (isNaN(total)) return;
			_this.data.client.animalsList[animalIndex].performancesList[performanceIndex].discount = total;
			_this.data.client.animalsList[animalIndex].performancesList[performanceIndex].extra = undefined;
			_this.cleanExtraDiscountsFromPerf(perf);
			perf.after($('<div>').attr({
				'class':				'extra-discount',
				'animalIndex' : 		animalIndex,
				'performanceIndex' :	performanceIndex
				})
				.text(Strings.DISCOUNT_LABEL.replace('$1', _this.billPDFManager.formatPriceToShow(total)))
				.click(function() {
					event.stopImmediatePropagation();
					_this.data.client.animalsList[$(this).attr('animalIndex')].performancesList[$(this).attr('performanceIndex')].discount = undefined;
					$(this).remove();
					_this.billPDFManager.generate(_this.data);
				})
			);
			_this.billPDFManager.generate(_this.data);
		}));
	};

	this.managePerformanceClick = function(animalIndex, performanceIndex) {
		var performance = _this.data.client.animalsList[animalIndex].performancesList[performanceIndex];
		if (!performance.isSelected) {
			$('#formView [animalIndex=' + animalIndex + ']').each(function() {
				if ($(this).attr('performanceIndex') == performanceIndex) {
					$(this).addClass('selected');
					_this.addDisountsAndExtraOnPerf($(this), animalIndex, performanceIndex);
				}
			});
			performance.isSelected = true;
			_this.data.client.animalsList[animalIndex].performancesSelected++;
		} else {
			$('#formView [animalIndex=' + animalIndex + ']').each(function() {
				if ($(this).attr('performanceIndex') == performanceIndex) {
					$(this).removeClass('selected');
					$(this).find(".extra,.discount").each(function() {
						$(this).remove();
					});
					_this.cleanExtraDiscountsFromPerf($(this));
				}
			});
			performance.isSelected = false;
			_this.data.client.animalsList[animalIndex].performancesSelected--;
		}
		this.billPDFManager.generate(this.data);
	};

	this.cleanExtraDiscountsFromPerf = function(perf) {
		var n = perf.next();
		while (n && n.attr('class') == "extra-discount") {
			tmp = n;
			n = n.next();
			tmp.remove();
		}
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:		"add",
				clientId:	this.id,
				totalTTC:	this.billPDFManager.formatPriceToShow(this.billPDFManager.totalTTC),
				totalHT:	this.billPDFManager.formatPriceToShow(this.billPDFManager.totalHT),
				file: 		this.billPDFManager.billId + ".pdf",
				inPension: 	Config.job.toUpperCase() == "PENSION",
				inFarriery:	Config.job.toUpperCase() == "FARRIERY",
		};

		_this.billPDFManager.save(function() {
			$.post(Config.billsApi, params, function(data) {
				History.add("bills", params.action, 0,  _this.billPDFManager.billId, null,  params.inFarriery,  params.inPension, function() {
					ManageView.replace(new BillDetails(_this.billPDFManager.billId));
				});
			}, "json");
		});
	};
};

// Save View
var BillDetails = function(id) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= true;

	this.htmlPage 			= "bills.html";
	this.tabLabel			= "bills";

	this.id = id;

	var _this = this;

	this.init = function() {
		$('#saveView embed').attr('src', Config.savedPDFPath + "/" + id + ".pdf");
		$('#saveView').show();
	};

	this.manageButtonClick = function(button) {
		if (button != "remove") return;

		if (confirm(Strings.CONFIRM_DELETE_BILL.replace('$1', this.id))) {
			var deleteFile = confirm(Strings.CONFIRM_DELETE_BILL_FILE);
			$.post(Config.billsApi, {
				action:		"delete",
				deleteFile:	deleteFile,
				file:		this.id + ".pdf",
				id:			this.id
			}, function() {
				History.add("bills", "delete", 0, _this.id, null, true, true, function() {
					ManageView.pop();
				});
			});
		}
	};
}