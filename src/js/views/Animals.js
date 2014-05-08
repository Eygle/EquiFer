// List view (first)

var AnimalsView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showSaveButton		= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "animals.html";
	this.tabLabel			= "animals";
	this.api				= "api/animalsApi.php";

	this.init = function() {
		$('#listView').show();
		$.getJSON(this.api, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"name",		title:"Nom",			dataType:"string"},
				{label:"owner",		title:"Propriétaire",	dataType:"string"},
				{label:"type",		title:"Type",			dataType:"string"},
				{label:"race",		title:"Race",			dataType:"string"},
				{label:"age",		title:"Âge",			dataType:"string"},
				{label:"size",		title:"Taille",			dataType:"int"},
				{label:"colour",	title:"Robe",			dataType:"string"},
				{label:"puce",		title:"N° de puce",		dataType:"string"},

			];
			new SortableList("animalsList", titles, data, function(id) {
				ManageView.push(new AnimalDetails(id));
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new AnimalFormView());
	};
};

// Details view

var AnimalDetails = function(id) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= true;
	this.showRemoveButton	= true;

	this.htmlPage 			= "animals.html";
	this.tabLabel			= "animals";
	this.api				= "api/animalsApi.php";

	this.id					= id;
	this.data				= null;

	var _this = this;

	this.init = function() {
		$('#detailView').show();
		$.getJSON(this.api, {action:"getAnimal", id:this.id}, function(data) {
			_this.data = data;
			$('#detailView #name').text(_this.data.name);
			$("#detailView #type").text(_this.data.type);
			$("#detailView #race").text(_this.data.race);
			$("#detailView #colour").text(_this.data.colour);
			$("#detailView #headMark").text(_this.data.headMark);
			$("#detailView #footMark").text(_this.data.footMark);
			$('#detailView #size').text(_this.data.size + " cm");
			$('#detailView #puce').text(_this.data.puce);
			$('#detailView #birthdate').text(_this.data.humanBirthdate + " (" + _this.data.age + ")");
			$('#detailView #desc').text(_this.data.desc);

			// Icons
			if (!_this.data.isAlive)
				$('#detailView #icons').append($('<img src="images/dead.png" />'));
			$('#detailView #icons').append($('<img src="images/' + _this.data.gender + '.png" />'));
		});
	};

	this.manageButtonClick = function(button) {
		if (button == "edit")
			ManageView.push(new AnimalFormView(_this.data));
		else if (button == "remove" && confirm('Voulez vous vraiment supprimer "' + _this.data.name + '" ?')) {
			$.post(_this.api, {action:"delete", id:_this.data.id}, function() {
				ManageView.pop();
			});
		}
	};
};

// Form view

var AnimalFormView = function(data) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= true;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "animals.html";
	this.tabLabel			= "animals";
	this.api				= "api/animalsApi.php";

	var _this				= this;

	this.editMode			= data != undefined;
	this.data				= data ? data : {
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

	this.init = function() {
		$('#formView').show();
		this.applyDatePicker();
		$('#formView #name').val(this.data.name);
		$('#formView #gender [value=' + this.data.gender + ']').prop('selected', true);
		$("#formView #type").autocomplete({source: this.typeAutocomplete()}).val(this.data.type);
		$("#formView #race").autocomplete({source: this.raceAutocomplete()}).val(this.data.race);
		$("#formView #colour").autocomplete({source: this.colourAutocomplete()}).val(this.data.colour);
		$("#formView #headMark").autocomplete({source: this.headMarkAutocomplete()}).val(this.data.headMark);
		$("#formView #footMark").autocomplete({source: this.footMarkAutocomplete()}).val(this.data.footMark);
		$('#formView #size').val(this.data.size);
		$('#formView #puce').val(this.data.puce);
		$('#formView #birthdate').val(this.data.birthdate);
		$('#formView #isAlive').prop("checked", this.data.isAlive);
		$('#formView #inFarriery').prop("checked", this.data.inFarriery);
		$('#formView #inPension').prop("checked", this.data.inPension);
		$('#formView #desc').val(this.data.desc);
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:		_this.editMode ? "edit" : "add", 
				name:		$('#formView #name').val(),
				gender:		$('#formView #gender').val(),
				type:		$('#formView #type').val(),
				race:		$('#formView #race').val(),
				colour:		$('#formView #colour').val(),
				headMark:	$('#formView #headMark').val(),
				footMark:	$('#formView #footMark').val(),
				size:		$('#formView #size').val(),
				puce:		$('#formView #puce').val(),
				birthdate:	$('#formView #birthdate').val(),
				isAlive:	$('#formView #isAlive').is(':checked'),
				inFarriery:	$('#formView #inFarriery').is(':checked'),
				inPension:	$('#formView #inPension').is(':checked'),
				desc:		$('#formView #desc').val()
		};

		if (!this.checkForm(params)) return;
		params.birthdate = _this.formatDate(params.birthdate);
		if (params.size) params.size = parseInt(params.size);

		if (_this.editMode) params.id = _this.data.id;
		$.post(_this.api, params, function(data) {
			ManageView.pop();
			if (!_this.editMode) {
				ManageView.push(new AnimalDetails(data.id));
			}
		}, "json");
	};

	this.checkForm = function(data) {
		if (!data.name) {
			alert("Le nom de l'animal est nécessaire");
			return false;
		} else if (!data.type) {
			alert("Le type de l'animal est nécessaire");
			return false;
		} else if (!data.race) {
			alert("La race de l'animal est nécessaire");
			return false;
		} else if (!this.checkBirthdate(data.birthdate)) {
			alert("La date de naissance de l'animal est vide ou mal formattée");
			return false;
		} else if (!data.inFarriery && !data.inPension) {
			alert("L'animal doit au moins apartenir à l'une des catégories suivantes:\nMaréchalerie ou Pension");
			return false;
		}
		return true;
	};

	this.checkBirthdate = function(date) {
		console.log(date);
		regex = new RegExp(/[0-9]{2}\/[0-9]{4}/);
		if (!regex.test(date))
			return false;
		var month = parseInt(date.split('/')[0]);
		if (month < 1 || month > 12)
			return false;
		return true;
	};

	this.applyDatePicker = function() {
		$("#formView #birthdate").datepicker({
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
		$("#formView #birthdate").focus(function () {
			$(".ui-datepicker-calendar").hide();
			$("#ui-datepicker-div").position({
				my: "center top",
				at: "center bottom",
				of: $(this)
			});
		});
	};

	this.formatDate = function(date) {
		date = date.split("/");
		return date[1] + "-" + date[0] + "-01";
	};

	this.typeAutocomplete = function() {
		return [
			"Cheval de trait",
			"Cheval de selle",
			"Poney",
			"Shetland",
			"Mule / Bardot",
			"Âne",
			"Zèbre"
		];
	};

	this.raceAutocomplete = function() {
		return [
			"Pur-sang Arabe",
			"Pur-sang Anglais",
			"Selle Français",
			"Trotteur Français",
			"AQPS",
			"Anglo-Arabe",
			"Lusitanien",
			"Lipizzan",
			"PRE",
			"Trakehner",
			"Barbe",
			"Camargue",
			"Mérens",
			"Fjord",
			"Henson",
			"Islandais",
			"Quaterhorse",
			"Appaloosa",
			"Paint horse",
			"Connemara",
			"New forest",
			"Poney landais",
			"Poney français de selle",
			"Haflinger",
			"Dartmoore",
			"Pottok",
			"Highland",
			"Welsh",
			"Shetland",
			"Falabella",
			"Le cheval miniature",
			"Percheron",
			"Ardennais",
			"Boulonnais",
			"Trait du Nord",
			"Cob Normand",
			"Comtois",
			"Trait Breton",
			"Poitevin Mulassier",
			"Âne Normand",
			"Âne de Provence",
			"Âne des Pyrénées",
			"Âne du Cotentin",
			"Baudet du Poitou",
			"Grand noir du Berry",
			"Mule Poitevine",
			"Mule des Pyrénées",
			"Mule Seynarde",
			"Mule Savoyarde",
			"ONC"
		];
	};

	this.colourAutocomplete = function() {
		return [
			"Noir",
			"Noir pangaré",
			"Noir grisonnant",
			"Bai clair",
			"Bai foncé",
			"Bai brun",
			"Bai cerise",
			"Bai grisonnant",
			"Isabelle clair",
			"Isabelle foncé",
			"Bai sourris",
			"Alezan brûlé",
			"Alezan foncé",
			"Alezan cuivré",
			"Alezan grisonnant",
			"Café au lait",
			"Palomino",
			"Blanc",
			"Crémello",
			"Perlino",
			"Gris",
			"Gris vlair",
			"Gris foncé",
			"Gris truité",
			"Gris mouchetté",
			"Gris tourterelle",
			"Chocolat",
			"Rouan",
			"Aubère",
			"Louvet",
			"Champagne",
			"Pomelé",
			"Floconné",
			"Pie noir",
			"Pie bai",
			"Pie alezan",
			"Pie gris",
			"Pie palomino",
			"Pie tobiano",
			"Pie overo",
			"Pie tovero",
			"Tâcheté léopard",
			"Tâcheté cape",
			"Tâcheté marmoré",
			"Tâcheté rayé",
			"Tâcheté bringé"
		];
	};

	this.headMarkAutocomplete = function() {
		return [
			 "Losange",
			"Pelote",
			"Etoile",
			"Croissant",
			"Fleur de lys",
			"Poire renversée",
			"Fer de lance",
			"Coeur",
			"Liste fine",
			"Liste normale",
			"Liste large",
			"Liste interrompue",
			"Liste courte",
			"Liste déviée",
			"Liste débordante",
			"Liste belle face",
			"Ladres"
		];
	};

	this.footMarkAutocomplete = function() {
		return [
			"Trace de balzane",
			"En courronne",
			"Bracelet",
			"Petite Balzane",
			"Grande balzane",
			"Balzane chaussette",
			"Balzane haut-chaussée",
			"Balzane herminée",
			"Zébrures"
		];
	};
};