var Tabs = function() {
	this.tabs = [
		{id:"home",			label:Strings.TAB_HOME},
		{id:"clients",		label:Strings.TAB_CLIENTS},
		{id:"animals",		label:Strings.TAB_ANIMALS},
		{id:"performances",	label:Strings.TAB_PERF},
		{id:"bills",		label:Strings.TAB_BILLS},
		{id:"stocks",		label:Strings.TAB_STOCKS},
	];

	this.currentTab = "home";

	var _this = this;

	this.init = function() {
		var $tabs = $("#my-tabs");
		$tabs.empty();
		for (var i in this.tabs) {
			if (this.tabs[i].id == "stocks" && Config.job.toUpperCase() == "PENSION") continue;
			$tabs.append($('<div>').attr({id:this.tabs[i].id, class:"tab"}).text(this.tabs[i].label).click(function() {
				_this.selectTab(this.id);
			}));
		}
	};

	this.update = function() {
		if (Config.job.toUpperCase() == "PENSION")
			$("#my-tabs #stocks").remove();
		else
			$("#my-tabs").append($('<div>').attr({id:"stocks", class:"tab"}).text(Strings.TAB_STOCKS).click(function() {
				_this.selectTab("stocks");
			}));;
		var $tabs = $("#my-tabs");
		if (this.currentTab == "stocks" && Config.job.toUpperCase() == "PENSION")
			this.selectTab("home");
	};

	this.selectTab = function(id) {
		this.currentTab = id;
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
			case "bills":
				ManageView.setAsRoot(new BillsView());
				break;
			case "stocks":
				ManageView.setAsRoot(new StocksView());
				break;
		}
	};

	this.init();
};