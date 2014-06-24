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
				{label:"formattedPriceTTC",	title:Strings.PERF_LABEL_PRICE_TTC,	dataType:"float"},
				{label:"formattedPriceHT",	title:Strings.PERF_LABEL_PRICE_HT,	dataType:"float"},
				{label:"formattedTVA",		title:Strings.PERF_LABEL_TVA,		dataType:"float"},
				{label:"unit",				title:Strings.PERF_LABEL_UNIT,		dataType:"string"}
			];
			new SortableList("performancesList", titles, data, null, function(id) {
				ManageView.push(new PerformanceDetails(id));
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
					$.getJSON(Config.performancesApi, {action:"getInfos", id:this.id}, function(data) {
						ManageView.push(new PerformanceFormView(data));
					});
				});
				var button2 = $('<div>').attr({class:'rightClickButton delete-icon', id: id}).text(Strings.REMOVE).click(function() {
					document.oncontextmenu = function() {return true;};
					$('#rightClickBack').remove();
					var name = $('#performancesList #' + this.id + " [label=name]").text();
					if (confirm(Strings.CONFIRM_DELETE.replace('$1', name))) {
						$.post(Config.performancesApi, {action:"delete", id:this.id}, function() {
							History.add("perfs", "delete", 0, name, null, true, true, function() {
								ManageView.display();
							});
						});
					} else {
						$("#" + id).removeClass('tr_selected');
					}
				});
				$('body').append(background.append(popup.append(button1).append(button2)));
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
			$("#detailView #priceHT").text(_this.data.formattedPriceHT);
			$("#detailView #priceTTC").text(_this.data.formattedPriceTTC);
			$("#detailView #tva").text(_this.data.formattedTVA);
			$("#detailView #unit").text(_this.data.unit);
			$("#detailView #defaultQuantity").text(_this.data.defaultQuantity);
		});
	};

	this.manageButtonClick = function(button) {
		if (button == "edit")
			ManageView.push(new PerformanceFormView(_this.data));
		else if (button == "remove" && confirm(Strings.CONFIRM_DELETE.replace('$1', _this.data.name))) {
			$.post(Config.performancesApi, {action:"delete", id:_this.data.id}, function() {
				History.add("perfs", "delete", 0, _this.data.name, null, true, true, function() {
					ManageView.pop();
				});
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
								priceHT:			null,
								priceTTC:			null,
								tva:				null,
								unit:				null,
								defaultQuantity:	null,
								inFarriery:			Config.job == "farriery",
								inPension:			Config.job == "pension"
							};

	this.init = function() {
		$('#formView').show();
		$('#formView #name').val(this.data.name);
		$("#formView #priceHT").val(this.data.priceHT);
		$("#formView #priceTTC").val(this.data.priceTTC);
		$('#formView #unit').autocomplete({source: Strings.PERF_AUTOCOMPLETE_UNITY}).val(this.data.unit);
		$('#formView #tva').val(this.data.tva);
		$("#formView #defaultQuantity").val(this.data.defaultQuantity);
		$('#formView #inFarriery').prop("checked", this.data.inFarriery);
		$('#formView #inPension').prop("checked", this.data.inPension);

		// Set TVA given as default value on Config
		if (!this.editMode) {
			$('#formView #tva').val(Config.TVA);
		}

		$('#formView #priceHT').keyup(function() {_this.calculatePrices("ht");});
		$('#formView #priceTTC').keyup(function() {_this.calculatePrices("ttc");});
		$('#formView #tva').keyup(function() {_this.calculatePrices("tva");});
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:				_this.editMode ? "edit" : "add", 
				name:				$('#formView #name').val(),
				priceHT:			$('#formView #priceHT').val().replace('.', ','),
				priceTTC:			$('#formView #priceTTC').val().replace('.', ','),
				tva:				$('#formView #tva').val().replace('.', ','),
				unit:				$('#formView #unit').val(),
				defaultQuantity:	$('#formView #defaultQuantity').val(),
				inFarriery:			$('#formView #inFarriery').is(':checked'),
				inPension:			$('#formView #inPension').is(':checked'),
		};
		if (!this.checkForm(params)) return;

		if (_this.editMode) params.id = _this.data.id;
		$.post(Config.performancesApi, params, function(data) {
			History.add("perfs", params.action, 0,  params.name, null,  params.inFarriery,  params.inPension, function() {
				if (!_this.editMode)
					ManageView.replace(new PerformanceDetails(data.id));
				else
					ManageView.pop();
			});
		}, "json");
	};

	this.calculatePrices = function(which) {
		var tva = $('#formView #tva');
		var ht = $('#formView #priceHT');
		var ttc = $('#formView #priceTTC');
		if (which == "ttc" && tva.val() && ttc.val()) {
			var tvaVal = parseFloat(tva.val().replace(',', '.'));
			var ttcVal = parseFloat(ttc.val().replace(',', '.'));
			ht.val(Math.round((ttcVal / ((1000 + (tvaVal * 10)) / 1000)) * 100) / 100);
		} else if ((which == "ht" || which == "tva") && tva.val() && ht.val()) {
			var htVal = parseFloat(ht.val().replace(',', '.'));
			var tvaVal = parseFloat(tva.val().replace(',', '.'));
			ttc.val(Math.round((htVal * ((1000 + (tvaVal * 10)) / 1000)) * 100) / 100);
		}
	};

	this.checkForm = function(data) {
		if (!data.name) {
			alert(Strings.PERF_REQUIRE_NAME);
			return false;
		} else if (!data.priceHT || !data.priceTTC) {
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