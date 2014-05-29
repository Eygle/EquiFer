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

	this.init = function() {
		$('#listView').show();
		$.getJSON(Config.billsApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"date",		title:Strings.BILLS_LABEL_DATE,		dataType:"string"},
				{label:"number",	title:Strings.BILLS_LABEL_NUMBER,	dataType:"string"},
				{label:"client",	title:Strings.BILLS_LABEL_CLIENT,	dataType:"string"},
				{label:"taxFree",	title:Strings.BILLS_LABEL_TAXFREE,	dataType:"float"},
				{label:"total",		title:Strings.BILLS_LABEL_TOTAL,	dataType:"float"},
				{label:"file",		title:Strings.BILLS_LABEL_FILE,		dataType:"string"}
			];
			new SortableList("billsList", titles, data, function(id) {
				ManageView.push(new BillDetails(id));
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new BillsClientsList());
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
			new SortableList("clientsList", titles, data, function(id) {
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
		
			$.getJSON(Config.settingsApi, {action: 'getUser'}, function(data) {
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
				$performancesList.append($('<div>')
					.attr({
						class:				"performance" + (animal.performancesList[i].isSelected ? " selected" : ""),
						animalIndex:		animalIndex,
						performanceIndex:	i
					})
					.click(function() {
						_this.managePerformanceClick(animalIndex, $(this).attr('performanceIndex'));
					})
					.text(animal.performancesList[i].formattedDate + " - " + animal.performancesList[i].name + " (x" + animal.performancesList[i].quantity + ")")
				);
			}
		} else {
			$animalDiv.removeClass('selected');
			$('#formView #performancesList [animalIndex=' + animalIndex + ']').remove();
		}
	};

	this.managePerformanceClick = function(animalIndex, performanceIndex) {
		var performance = _this.data.client.animalsList[animalIndex].performancesList[performanceIndex];
		if (!performance.isSelected) {
			$('#formView [animalIndex=' + animalIndex + ']').each(function() {
				if ($(this).attr('performanceIndex') == performanceIndex)
					$(this).addClass('selected');
			});
			performance.isSelected = true;
			_this.data.client.animalsList[animalIndex].performancesSelected++;
		} else {
			$('#formView [animalIndex=' + animalIndex + ']').each(function() {
				if ($(this).attr('performanceIndex') == performanceIndex)
					$(this).removeClass('selected');
			});
			performance.isSelected = false;
			_this.data.client.animalsList[animalIndex].performancesSelected--;
		}
		this.billPDFManager.generate(this.data);
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:		"add",
				clientId:	this.id,
				totalTTC:	this.billPDFManager.totalTTC,
				totalHT:	this.billPDFManager.totalHT,
				file: 		this.billPDFManager.billId + ".pdf",
				inPension: 	Config.job.toUpperCase() == "PENSION",
				inFarriery:	Config.job.toUpperCase() == "FARRIERY",
		};

		$.post(Config.billsApi, params, function(data) {
			History.add("bills", params.action, 0,  _this.billPDFManager.billId, null,  params.inFarriery,  params.inPension, function() {
				ManageView.replace(new BillsSaveView());
			});
		}, "json");
	};
};

// Save View
var BillsSaveView = function() {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "bills.html";
	this.tabLabel			= "bills";

	this.init = function() {
		$('#saveView').show();
	};
}