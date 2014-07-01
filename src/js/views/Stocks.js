// List view (first)

var StocksView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showSaveButton		= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "stocks.html";
	this.tabLabel			= "stocks";

	var _this = this;

	this.init = function() {
		$('#listView').show();
		$.getJSON(Config.stocksApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"name",			title:Strings.STOCKS_LABEL_NAME,			dataType:"string",	filter:true},
				{label:"quantity",		title:Strings.STOCKS_LABEL_QUANTITY,		dataType:"int",		filter:true},
				{label:"quantityAlert",	title:Strings.STOCKS_LABEL_QUANTITY_ALERT,	dataType:"int",		filter:true},
				{label:"action",		title:Strings.STOCKS_LABEL_ACTION,			dataType:"string",	html:true}

			];
			new SortableList("stocksList", titles, _this.formatData(data), function(term, callback) {
				$.getJSON(Config.stocksApi, {
					action: 'filter',
					term: 	term,
					job: 	Config.job.toUpperCase()
				}, function(data) {
					callback(_this.formatData(data));
				});
			}, function(id) {
				ManageView.push(new StockDetails(id));
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
					$("#" + id).removeClass('tr_selected');
					$.getJSON(Config.stocksApi, {action:"getInfos", id:this.id}, function(data) {
						ManageView.push(new StockFormView(data));
					});
				});
				var button2 = $('<div>').attr({class:'rightClickButton delete-icon', id: id}).text(Strings.REMOVE).click(function() {
					document.oncontextmenu = function() {return true;};
					$('#rightClickBack').remove();
					var name = $('#stocksList #' + this.id + " [label=name]").text();
					if (confirm(Strings.CONFIRM_DELETE.replace('$1', name))) {
						$.post(Config.stocksApi, {action:"delete", id:this.id}, function() {
							History.add("stocks", "delete", 0, name, null, true, true, function() {
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

		this.formatData = function(data) {
			for (var i in data) {
				var content = $('<div>').append($('<img>').attr('src', "images/add_stock_grey.png").on('click', function() {
						var id = $(this).parent().parent().parent().attr('id');
						var name = $("#listView #" + id + " td[label=name]").text();
						History.add("stocks", "edit_quantity", 0,  name, null,  true,  false, function() {
							$.post(Config.stocksApi, {
								action:	'addQuantity',
								id:		id
							}, function() {
								ManageView.display();
							});
						});
						event.stopPropagation();
					}).hover(function() {
						$(this).attr('src', "images/add_stock.png");
					}, function() {
						$(this).attr('src', "images/add_stock_grey.png");
					})
				).append(
					$('<div>').attr('class', 'sep')
				).append($('<img>').attr('src', "images/sub_stock_grey.png").on('click', function() {
						var id = $(this).parent().parent().parent().attr('id');
						var name = $("#listView #" + id + " td[label=name]").text();
						History.add("stocks", "edit_quantity", 0, name, null,  true,  false, function() {
							$.post(Config.stocksApi, {
								action:	'subQuantity',
								id:		id
							}, function() {
								ManageView.display();
							});
						});
						event.stopPropagation();
					}).hover(function() {
						$(this).attr('src', "images/sub_stock.png");
					}, function() {
						$(this).attr('src', "images/sub_stock_grey.png");
					})
				);
				data[i]['action'] = content;
				if (data[i]['quantityAlert'] == -1)
					data[i]['quantityAlert'] = "";
			}
			return data;
		};
	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new StockFormView());
	};
};

// Details view

var StockDetails = function(id) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= true;
	this.showRemoveButton	= true;

	this.htmlPage 			= "stocks.html";
	this.tabLabel			= "stocks";

	this.id					= id;
	this.data				= null;

	var _this = this;

	this.init = function() {
		$('#detailView').show();
		$.getJSON(Config.stocksApi, {action:"getInfos", id:this.id}, function(data) {
			_this.data = data;
			$('#detailView #name').text(_this.data.name);
			$("#detailView #quantity").text(_this.data.quantity);
			$("#detailView #quantityAlert").text(_this.data.quantityAlert == -1 ? "" : _this.data.quantityAlert);
		});
	};

	this.manageButtonClick = function(button) {
		if (button == "edit")
			ManageView.push(new StockFormView(_this.data));
		else if (button == "remove" && confirm(Strings.CONFIRM_DELETE.replace('$1', _this.data.name))) {
			$.post(Config.stocksApi, {action:"delete", id:_this.data.id}, function() {
				History.add("stocks", "delete", 0, _this.data.name, null, true, true, function() {
					ManageView.pop();
				});
			});
		}
	};
};

// Form view

var StockFormView = function(data) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= true;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "stocks.html";
	this.tabLabel			= "stocks";

	var _this				= this;

	this.editMode			= data != undefined;
	this.data				= data ? data : {
								name:			null,
								quantity:		null,
								quantityAlert:	null,
								inFarriery:		true
							};

	this.init = function() {
		$('#formView').show();
		$('#formView #name').val(this.data.name);
		$("#formView #quantity").val(this.data.quantity);
		$("#formView #quantityAlert").val(this.data.quantityAlert == -1 ? "" : this.data.quantityAlert );
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:			_this.editMode ? "edit" : "add", 
				name:			$('#formView #name').val(),
				quantity:		$('#formView #quantity').val(),
				quantityAlert:	$('#formView #quantityAlert').val(),
				inFarriery:		true
		};

		if (params.quantityAlert == "") params.quantityAlert = -1;

		if (!CheckForms.check("#formView", params, [
				{item:'name',			id:"name",	error:Strings.STOCKS_REQUIRE_NAME},
				{item:'quantity',		id:"quantity",	error:Strings.STOCKS_REQUIRE_QUANTITY,	format:"integer",	formatError:Strings.STOCKS_WRONG_QUANTITY_ALERT},
				{item:'quantityAlert',	id:"quantityAlert",	faculative:true,	format:"integer",	formatError:Strings.STOCKS_WRONG_QUANTITY_ALERT},
			])) return;

		if (_this.editMode) params.id = _this.data.id;
		$.post(Config.stocksApi, params, function(data) {
			History.add("stocks", params.action, 0,  params.name, null,  params.inFarriery,  false, function() {
				if (!_this.editMode) {
					ManageView.replace(new StockDetails(data.id));
				} else {
					ManageView.pop();
				}
			});
		}, "json");
	};
};