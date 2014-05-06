var AnimalsView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "animals.html";
	this.tabLabel			= "animals";

	this.init = function() {
		$('#listView').show();
		data = [];	//TODO get from db
		titles = [
			{label:"name",		title:"Nom",			dataType:"string"},
			{label:"owner",		title:"Propriétaire",	dataType:"string"},
			{label:"type",		title:"Type",			dataType:"string"},
			{label:"race",		title:"Race",			dataType:"string"},
			{label:"age",		title:"Âge",			dataType:"int"},
			{label:"size",		title:"Taille",			dataType:"int"},
			{label:"colour",	title:"Robe",			dataType:"string"},
			{label:"puce",		title:"N° de puce",		dataType:"string"},

		];
		new SortableList("animalsList", titles, data);
	};

	this.reload = function() {

	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new AnimalAddView());
	};
};

var AnimalAddView = function() {
	// Buttons management
	this.showReturnButton	= true;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "animals.html";
	this.tabLabel			= "animals";

	this.init = function() {
		$('#formView').show();
		this.applyDatePicker();
		$("#type").autocomplete({source: this.typeAutocomplete()});
		$("#race").autocomplete({source: this.raceAutocomplete()});
		$("#colour").autocomplete({source: this.colourAutocomplete()});
		$("#headMark").autocomplete({source: this.headMarkAutocomplete()});
		$("#footMark").autocomplete({source: this.footMarkAutocomplete()});
		data = [];	//TODO get from db
	};

	this.reload = function() {

	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new AnimalAddView());
	};

	this.applyDatePicker = function() {
		$("#birthdate").datepicker({
			dateFormat: 'mm/yy',
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			showOn: "button",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true,
			onClose: function (dateText, inst) {
				var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
				var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
				$(this).datepicker('setDate', new Date(year, month, 1));
			},
			beforeShow: function (input, inst) {
				if ((datestr = $(this).val()).length > 0) {
					actDate = datestr.split('/');
					year = actDate[1];
					month = actDate[0] - 1;
					$(this).datepicker('option', 'defaultDate', new Date(year, month));
					$(this).datepicker('setDate', new Date(year, month));
				}
			}
		});
		$("#birthdate").focus(function () {
			$(".ui-datepicker-calendar").hide();
			$("#ui-datepicker-div").position({
				my: "center top",
				at: "center bottom",
				of: $(this)
			});
		});
	};

	this.typeAutocomplete = function() {
		return [
			"Cheval de trai",
			"Cheval de selle",
			"Zèbre"
		];
	};

	this.raceAutocomplete = function() {
		return [];
	};

	this.colourAutocomplete = function() {
		return [];
	};

	this.headMarkAutocomplete = function() {
		return [];
	};

	this.footMarkAutocomplete = function() {
		return [];
	};
};