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
		$.getJSON("api/animalsApi.php", {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			console.log(data);
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
		});
	};

	this.reload = function() {

	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new AnimalFormView());
	};
};

var AnimalFormView = function(animal) {
	// Buttons management
	this.showReturnButton	= true;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "animals.html";
	this.tabLabel			= "animals";

	var _this = this;

	this.animal = animal ? animal : {
		name:		null,
		gender:		"male",
		type:		null,
		race:		null,
		colour:		null,
		headMark:	null,
		footMark:	null,
		size:		null,
		puce:		null,
		birthdate:	null,
		isAlive:	true,
		inFarriery:	Config.job == "farriery",
		inPension:	Config.job == "pension",
		desc:		null
	};

	console.log(this.animal);

	this.init = function() {
		$('#formView').show();
		this.applyDatePicker();
		$('#name').val(this.animal.name);
		$('#gender [value=' + this.animal.gender + ']').prop('selected', true);
		$("#type").autocomplete({source: this.typeAutocomplete()}).val(this.animal.type);
		$("#race").autocomplete({source: this.raceAutocomplete()}).val(this.animal.race);
		$("#colour").autocomplete({source: this.colourAutocomplete()}).val(this.animal.colour);
		$("#headMark").autocomplete({source: this.headMarkAutocomplete()}).val(this.animal.headMark);
		$("#footMark").autocomplete({source: this.footMarkAutocomplete()}).val(this.animal.footMark);
		$('#size').val(this.animal.size);
		$('#puce').val(this.animal.puce);
		$('#birthdate').val(this.animal.birthdate);
		$('#isAlive').prop("checked", this.animal.isAlive);
		$('#inFarriery').prop("checked", this.animal.inFarriery);
		$('#inPension').prop("checked", this.animal.inPension);
		$('#desc').val(this.animal.desc);
		$("#save").click(function() {
			var params = {
				action:		"add", 
				job:		Config.job.toUpperCase(),
				name:		$('#name').val(),
				gender:		$('#gender').val(),
				type:		$('#type').val(),
				race:		$('#race').val(),
				colour:		$('#colour').val(),
				headMark:	$('#headMark').val(),
				footMark:	$('#footMark').val(),
				size:		$('#size').val(),
				puce:		$('#puce').val(),
				birthdate:	_this.formatDate($('#birthdate').val()),
				isAlive:	$('#isAlive').val() == "on",
				inFarriery:	$('#inFarriery').val() == "on",
				inPension:	$('#inPension').val() == "on",
				desc:		$('#desc').val()
			};
			$.post("api/animalsApi.php", params, function(data) {
				//ManageView.pop();
				//ManageView.push(new AnimalDetail(data.id));
			});
		});
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

	this.formatDate = function(date) {
		date = date.split("/");
		return date[1] + "-" + date[0] + "-01";
	};
};