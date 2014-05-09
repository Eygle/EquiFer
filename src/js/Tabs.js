var Tabs = function() {
	this.tabs = [
		{id:"home",			label:Strings.TAB_HOME},
		{id:"clients",		label:Strings.TAB_CLIENTS},
		{id:"animals",		label:Strings.TAB_ANIMALS},
		{id:"performances",	label:Strings.TAB_PERF},
		{id:"stocks",		label:Strings.TAB_STOCKS},
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
			case "performances":
				ManageView.setAsRoot(new PerformancesView());
			break;
			case "stocks":
				ManageView.setAsRoot(new StocksView());
				break;
		}
	};

	this.init();
};