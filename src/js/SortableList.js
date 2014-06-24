var SortableList = function(tableId, titles, list, filterCallback, clickCallback, rightClickCallback) {
	this.originalList = null;
	this.list = null;
	this.titles = null;
	this.lastLabel = null;
	this.lastLabelOrder = "ASC";
	this.clickCallback = clickCallback;
	this.rightClickCallback = rightClickCallback;

	this.filterCallback = filterCallback;
	this.filterList = null;

	var _this = this;

	this.init = function(tableId, titles, list) {
		this.originalList = list;
		this.list = list;
		this.titles = titles;
		this.tableId = tableId;
		if (this.filterCallback)
			this.displayFilterBox();
		this.display();
	};

	this.sort = function(label, type) {
		if (this.lastLabel == label) 
			this.lastLabelOrder = this.lastLabelOrder == "ASC" ? "DESC" : "ASC";
		else
			this.lastLabelOrder = "ASC";
		this.lastLabel = label;
		switch (type) {
			case "string":
				this.list.sort(sortBy(label, this.lastLabelOrder == "ASC", function(a) {return a ? a.toUpperCase() : ""}));
				break;
			case "int":
				this.list.sort(sortBy(label, this.lastLabelOrder == "ASC", parseInt));
				break;
			case "float":
				this.list.sort(sortBy(label, this.lastLabelOrder == "ASC", parseFloat));
				break;
		}
		$("#" + this.tableId).html("");
		this.display();
	};

	this.display = function() {
		var $tr = $('<tr>');
		var $table = $("#" + this.tableId);
		for (var i in this.titles) {
			$tr.append($('<th>').attr({label:this.titles[i].label, "data-type":this.titles[i].dataType}).text(this.titles[i].title));
		}
		$table.append($('<thead>').append($tr));
		$tbody = $('<tbody>');
		this.updateListContent($tbody);
		$table.append($tbody);
		$('#' + tableId + " th").click(function() {
			_this.sort($(this).attr('label'), $(this).attr('data-type'));
		});
	};

	this.updateListContent = function(tbody, term) {
		tbody.empty();
		for (var i in this.list) {
			var $tr = $('<tr>').attr('id', this.list[i].id);
			for (var j in this.titles) {
				var text = new String(this.list[i][this.titles[j].label]);
				if (term)
					text = text.replace(new RegExp(term, 'gi'), function (match) {return "<em>" + match + "</em>";});
				$tr.append($('<td>').attr('label', this.titles[j].label).html(text));
			}
			$tr.click(function() {
				_this.clickCallback(this.id);
			});
			if (_this.rightClickCallback) {
				$tr.mousedown(function(e){
					if( e.button == 2 ) {
						document.oncontextmenu = function() {return false;};
						$(this).addClass('tr_selected');
						_this.rightClickCallback(e.pageX, e.pageY, this.id);
						return false;
					}
					return true;
				});
			}
			tbody.append($tr);
		}
	};

	var lastText = "";
	this.displayFilterBox = function() {
		$("#" + this.tableId).before($('<input>').attr({
			type:			'text',
			class:			'filterList',
			placeholder:	'Filtrer'
		}).keyup(function(event) {
			var text = $(this).val();
			if (text == lastText) return;
			lastText = text;
			if (!text.length) {
				_this.list = _this.originalList;
				_this.updateListContent($("#" + _this.tableId + " tbody"));
			} else {
				_this.filterCallback(text, function(data) {
					_this.list = data;
					_this.updateListContent($("#" + _this.tableId + " tbody"), text);
				});
			}
		}));
	};

	this.init(tableId, titles, list);
};

var sortBy = function(field, reverse, primer){

	var key = primer ? 
		function(x) {return primer(x[field])} : 
		function(x) {return x[field]};

	reverse = [-1, 1][+!!reverse];

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	}
}