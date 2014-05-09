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

	this.init = function() {
		$('#listView').show();
		$.getJSON(Config.animalsApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"name",		title:Strings.ANIMALS_LABEL_NAME,	dataType:"string"},
				{label:"owners",	title:Strings.ANIMALS_LABEL_OWNERS,	dataType:"string"},
				{label:"type",		title:Strings.ANIMALS_LABEL_TYPE,	dataType:"string"},
				{label:"race",		title:Strings.ANIMALS_LABEL_RACE,	dataType:"string"},
				{label:"age",		title:Strings.ANIMALS_LABEL_AGE,	dataType:"string"},
				{label:"size",		title:Strings.ANIMALS_LABEL_SIZE,	dataType:"int"},
				{label:"colour",	title:Strings.ANIMALS_LABEL_COLOUR,	dataType:"string"},
				{label:"puce",		title:Strings.ANIMALS_LABEL_PUCE,	dataType:"string"},

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

	this.id					= id;
	this.data				= null;

	var _this = this;

	this.init = function() {
		$('#detailView').show();
		$.getJSON(Config.animalsApi, {action:"getInfos", id:this.id}, function(data) {
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
		else if (button == "remove" && confirm(Strings.CONFIRM_DELETE + ' "' + _this.data.name + '" ?')) {
			$.post(Config.animalsApi, {action:"delete", id:_this.data.id}, function() {
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
		$("#formView #type").autocomplete({source: Strings.ANIMALS_AUTOCOMPLETE_TYPE}).val(this.data.type);
		$("#formView #race").autocomplete({source: Strings.ANIMALS_AUTOCOMPLETE_RACE}).val(this.data.race);
		$("#formView #colour").autocomplete({source: Strings.ANIMALS_AUTOCOMPLETE_COLOUR}).val(this.data.colour);
		$("#formView #headMark").autocomplete({source: Strings.ANIMALS_AUTOCOMPLETE_HEAD_MARK}).val(this.data.headMark);
		$("#formView #footMark").autocomplete({source: Strings.ANIMALS_AUTOCOMPLETE_FOOT_MARK}).val(this.data.footMark);
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
		$.post(Config.animalsApi, params, function(data) {
			ManageView.pop();
			if (!_this.editMode) {
				ManageView.push(new AnimalDetails(data.id));
			}
		}, "json");
	};

	this.checkForm = function(data) {
		if (!data.name) {
			alert(Strings.ANIMALS_REQUIRE_NAME);
			return false;
		} else if (!data.type) {
			alert(Strings.ANIMALS_REQUIRE_TYPE);
			return false;
		} else if (!data.race) {
			alert(Strings.ANIMALS_REQUIRE_RACE);
			return false;
		} else if (!this.checkBirthdate(data.birthdate)) {
			alert(Strings.ANIMALS_WRONG_DATE_FORMAT);
			return false;
		} else if (!data.inFarriery && !data.inPension) {
			alert(Strings.ANIMALS_REQUIRE_JOB);
			return false;
		}
		return true;
	};

	this.checkBirthdate = function(date) {
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
};