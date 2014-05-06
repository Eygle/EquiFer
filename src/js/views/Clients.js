var ClientsView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "clients.html";
	this.tabLabel			= "clients";

	this.init = function() {
		data = [];
		titles = [
			{label:"name",			title:"Nom",			dataType:"string"},
			{label:"animals",		title:"Animaux",		dataType:"string"},
			{label:"mobilePhone",	title:"Portable",		dataType:"int"},
			{label:"fixePhone",		title:"Fixe",			dataType:"int"},
			{label:"address",		title:"Adresse",		dataType:"string"},
			{label:"zipcode",		title:"Code Postal",	dataType:"int"},
			{label:"city",			title:"Ville",			dataType:"string"}
		];
		new SortableList("clientsList", titles, data);
	};

	this.reload = function() {

	};

	this.manageButtonClick = function(button) {
		console.log("click on button: " + button);
		if (button != "add") return;
		ManageView.push(new ClientAddView());
	};
};