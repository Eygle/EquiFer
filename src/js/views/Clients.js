// List view (first)

var ClientsView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showSaveButton		= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "clients.html";
	this.tabLabel			= "clients";
	this.api				= "api/clientsApi.php";

	this.init = function() {
		$('#listView').show();
		$.getJSON(this.api, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"name",			title:"Nom",			dataType:"string"},
				{label:"animals",		title:"Animaux",		dataType:"string"},
				{label:"phoneMobile",	title:"Portable",		dataType:"int"},
				{label:"phoneFixe",		title:"Fixe",			dataType:"int"},
				{label:"address",		title:"Adresse",		dataType:"string"},
				{label:"zipcode",		title:"Code Postal",	dataType:"int"},
				{label:"city",			title:"Ville",			dataType:"string"}
			];
			new SortableList("clientsList", titles, data, function(id) {
				ManageView.push(new ClientDetails(id));
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new ClientFormView());
	};
};

// Details view

var ClientDetails = function(id) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= true;
	this.showRemoveButton	= true;

	this.htmlPage 			= "clients.html";
	this.tabLabel			= "clients";
	this.api				= "api/clientsApi.php";

	this.id					= id;
	this.data				= null;

	var _this = this;

	this.init = function() {
		$('#detailView').show();
		$.getJSON('api/clientsApi.php', {action:"getClient", id:this.id}, function(data) {
			_this.data = data;
			$('#detailView #name').text(_this.data.name);
			$("#detailView #address").text(_this.data.address);
			$("#detailView #zipcode").text(_this.data.zipcode);
			$("#detailView #city").text(_this.data.city);
			$("#detailView #phoneFixe").text(_this.data.phoneFixe);
			$("#detailView #phoneMobile").text(_this.data.phoneMobile);
			$('#detailView #mail').text(_this.data.mail);
		});
	};

	this.manageButtonClick = function(button) {
		if (button == "edit")
			ManageView.push(new ClientFormView(_this.data));
		else if (button == "remove" && confirm('Voulez vous vraiment supprimer "' + _this.data.name + '" ?')) {
			$.post(_this.api, {action:"delete", id:_this.data.id}, function() {
				ManageView.pop();
			});
		}
	};
};

// Form view

var ClientFormView = function(data) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= true;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "clients.html";
	this.tabLabel			= "clients";
	this.api				= "api/clientsApi.php";

	var _this				= this;

	this.editMode			= data != undefined;
	this.data				= data ? data : {
								firstName:		null,
								lastName:		null,
								address:		null,
								zipcode:		null,
								city:			null,
								phoneFixe:		null,
								phoneMobile:	null,
								mail:			null,
								inFarriery:		Config.job == "farriery",
								inPension:		Config.job == "pension"
							};

	this.init = function() {
		$('#formView').show();
		$('#formView #firstName').val(this.data.firstName);
		$('#formView #lastName').val(this.data.lastName);
		$("#formView #address").val(this.data.address);
		$("#formView #zipcode").val(this.data.zipcode).autocomplete({
			source : "api/citiesApi.php",
			select : function(event, ui) {
				$("#formView #zipcode").val(ui.item.zipcode);
				$("#formView #city").val(ui.item.city);
				return false;
			}
		}).data("autocomplete")._renderItem = function(ul, item) {
			return $("<li>").data("item.autocomplete", item).append(
				'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
		};
		$("#formView #city").val(this.data.city).autocomplete({
			source : "api/citiesApi.php",
			select : function(event, ui) {
				$("#formView #zipcode").val(ui.item.zipcode);
				$("#formView #city").val(ui.item.city);
				return false;
			}
		}).data("autocomplete")._renderItem = function(ul, item) {
			return $("<li>").data("item.autocomplete", item).append(
				'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
		};
		$("#formView #phoneFixe").val(this.data.phoneFixe);
		$("#formView #phoneMobile").val(this.data.phoneMobile);
		$('#formView #mail').val(this.data.mail);
		$('#formView #inFarriery').prop("checked", this.data.inFarriery);
		$('#formView #inPension').prop("checked", this.data.inPension);
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:		_this.editMode ? "edit" : "add", 
				firstName:		$('#formView #firstName').val(),
				lastName:		$('#formView #lastName').val(),
				address:		$('#formView #address').val(),
				zipcode:		$('#formView #zipcode').val(),
				city:			$('#formView #city').val(),
				phoneFixe:		$('#formView #phoneFixe').val(),
				phoneMobile:	$('#formView #phoneMobile').val(),
				mail:			$('#formView #mail').val(),
				puce:			$('#formView #puce').val(),
				inFarriery:	$('#formView #inFarriery').is(':checked'),
				inPension:	$('#formView #inPension').is(':checked'),
		};

		if (!this.checkForm(params)) return;

		if (_this.editMode) params.id = _this.data.id;
		$.post(_this.api, params, function(data) {
			ManageView.pop();
			if (!_this.editMode)
				ManageView.push(new ClientsDetails(data.id));
		}, "json");
	};

	this.checkForm = function(data) {
		if (!data.firstName || !data.lastName) {
			alert("Les nom et prénom du client sont nécessaire");
			return false;
		} else if (!data.address) {
			alert("L'addresse du client est nécessaire");
			return false;
		} else if (!data.zipcode) {
			alert("La code postal du client est nécessaire");
			return false;
		} else if (!data.inFarriery && !data.inPension) {
			alert("Le client doit au moins apartenir à l'une des catégories suivantes:\nMaréchalerie ou Pension");
			return false;
		}
		return true;
	};
};