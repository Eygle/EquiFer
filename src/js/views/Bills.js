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
				{label:"clients",	title:Strings.BILLS_LABEL_CLIENTS,	dataType:"string"},
				{label:"taxfree",	title:Strings.BILLS_LABEL_TAXFREE,	dataType:"float"},
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
		
			$.getJSON(Config.settingsApi, {action: 'getUser'}, function(data) {
				_this.data.infos = data;
				_this.billPDFManager = new BillPDFManager(_this.data);
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:			"add",
				inFarriery:		$('#formView #inFarriery').is(':checked'),
				inPension:		$('#formView #inPension').is(':checked'),
		};

		if (!this.checkForm(params)) return;

		if (_this.editMode) params.id = _this.data.id;
		$.post(Config.billsApi, params, function(data) {
			ManageView.pop();
			if (!_this.editMode)
				ManageView.push(new BillsDetails(data.id));
		}, "json");
	};
};