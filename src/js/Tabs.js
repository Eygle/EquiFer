var Tabs = function() {
	this.tabs = [
		{id:"home",	label:"Accueil"},
		{id:"clients",	label:"Clients"},
		{id:"animals",	label:"Animaux"},
		{id:"stocks",	label:"Stocks"},
	];

	var _this = this;

	this.init = function() {
		var $tabs = $("#tabs");
		for (var i in this.tabs) {
			$tabs.append($('<div>').attr({id:this.tabs[i].id, class:"tab"}).text(this.tabs[i].label).click(function() {
				_this.selectTab(this.id);
			}));
		}
	};

	this.selectTab = function(id) {
		switch(id) {
			case "home":
				ManageView.setAsRoot(new HomeView());
				break;
			case "clients":
				ManageView.setAsRoot(new ClientsView());
				break;
			case "animals":
				ManageView.setAsRoot(new AnimalsView());
				break;
			case "stocks":
				ManageView.setAsRoot(new StocksView());
				break;
		}
	};

	this.init();
};