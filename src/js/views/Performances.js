// List view (first)

var PerformancesView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showSaveButton		= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "performances.html";
	this.tabLabel			= "performances";

	this.init = function() {
		$('#listView').show();
		$.getJSON(Config.performancesApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"name",				title:Strings.PERF_LABEL_NAME,		dataType:"string"},
				{label:"formattedPrice",	title:Strings.PERF_LABEL_PRICE,	dataType:"float"},
				{label:"formattedTVA",		title:Strings.PERF_LABEL_TVA,		dataType:"float"},
				{label:"unit",				title:Strings.PERF_LABEL_UNIT,		dataType:"string"}
			];
			new SortableList("performancesList", titles, data, function(id) {
				ManageView.push(new PerformanceDetails(id));
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new PerformanceFormView());
	};
};

// Details view

var PerformanceDetails = function(id) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= true;
	this.showRemoveButton	= true;

	this.htmlPage 			= "performances.html";
	this.tabLabel			= "performances";

	this.id					= id;
	this.data				= null;

	var _this = this;

	this.init = function() {
		$('#detailView').show();
		$.getJSON(Config.performancesApi, {action:"getInfos", id:this.id}, function(data) {
			_this.data = data;
			$('#detailView #name').text(_this.data.name);
			$("#detailView #price").text(_this.data.formattedPrice);
			$("#detailView #tva").text(_this.data.formattedTVA);
			$("#detailView #unit").text(_this.data.unit);
			$("#detailView #defaultQuantity").text(_this.data.defaultQuantity);
		});
	};

	this.manageButtonClick = function(button) {
		if (button == "edit")
			ManageView.push(new PerformanceFormView(_this.data));
		else if (button == "remove" && confirm(Strings.CONFIRM_DELETE + ' "' + _this.data.name + '" ?')) {
			$.post(Config.performancesApi, {action:"delete", id:_this.data.id}, function() {
				ManageView.pop();
			});
		}
	};
};

// Form view

var PerformanceFormView = function(data) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= true;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "performances.html";
	this.tabLabel			= "performances";

	var _this				= this;

	this.editMode			= data != undefined;
	this.data				= data ? data : {
								name:				null,
								price:				null,
								tva:				null,
								unit:			null,
								defaultQuantity:	null,
								inFarriery:			Config.job == "farriery",
								inPension:			Config.job == "pension"
							};

	this.init = function() {
		$('#formView').show();
		$('#formView #name').val(this.data.name);
		$("#formView #price").val(this.data.price);
		$('#formView #unit').autocomplete({source: Strings.PERF_AUTOCOMPLETE_UNITY}).val(this.data.unit);
		$('#formView #tva').val(this.data.tva);
		$("#formView #defaultQuantity").val(this.data.defaultQuantity);
		$('#formView #inFarriery').prop("checked", this.data.inFarriery);
		$('#formView #inPension').prop("checked", this.data.inPension);

		// Set TVA given as default value on Config
		if (!this.editMode) {
			$('#formView #tva').val(Config.TVA);
		}
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:				_this.editMode ? "edit" : "add", 
				name:				$('#formView #name').val(),
				price:				$('#formView #price').val().replace('.', ','),
				tva:				$('#formView #tva').val().replace('.', ','),
				unit:				$('#formView #unit').val(),
				defaultQuantity:	$('#formView #defaultQuantity').val(),
				inFarriery:			$('#formView #inFarriery').is(':checked'),
				inPension:			$('#formView #inPension').is(':checked'),
		};
		if (!this.checkForm(params)) return;

		if (_this.editMode) params.id = _this.data.id;
		$.post(Config.performancesApi, params, function(data) {
			ManageView.pop();
			if (!_this.editMode)
				ManageView.push(new PerformanceDetails(data.id));
		}, "json");
	};

	this.checkForm = function(data) {
		if (!data.name) {
			alert(Strings.PERF_REQUIRE_NAME);
			return false;
		} else if (!data.price) {
			alert(Strings.PERF_REQUIRE_PRICE);
			return false;
		} else if (!data.tva) {
			alert(Strings.PERF_REQUIRE_TVA);
			return false;
		} else if (!data.unit) {
			alert(Strings.PERF_REQUIRE_UNIT);
			return false;
		} else if (!data.inFarriery && !data.inPension) {
			alert(Strings.PERF_REQUIRE_JOB);
			return false;
		}
		return true;
	};
};