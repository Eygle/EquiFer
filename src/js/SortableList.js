var SortableList = function(tableId, titles, list, clickCallback, rightClickCallback) {
	this.list = null;
	this.titles = null;
	this.lastLabel = null;
	this.lastLabelOrder = "ASC";
	this.clickCallback = clickCallback;
	this.rightClickCallback = rightClickCallback;

	var _this = this;

	this.init = function(tableId, titles, list) {
		this.list = list;
		this.titles = titles;
		this.tableId = tableId;
		this.display();
	};

	this.sort = function(label, type) {
		if (this.lastLabel == label) 
			this.lastLabelOrder = this.lastLabelOrder == "ASC" ? "DESC" : "ASC";
		else
			this.lastLabelOrder = "ASC";
		this.lastLabel = label;
		console.log(type);
		console.log(label);
		switch (type) {
			case "string":
				this.list.sort(sortBy(label, this.lastLabelOrder == "ASC", function(a) {return a ? a.toUpperCase() : ""}));
				break;
			case "int":
				this.list.sort(sortBy(label, this.lastLabelOrder == "ASC", parseInt));
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
		for (var i in this.list) {
			var $tr = $('<tr>').attr('id', this.list[i].id);
			for (var j in this.titles) {
				$tr.append($('<td>').text(this.list[i][this.titles[j].label]));
			}
			$tr.click(function() {
				_this.clickCallback(this.id);
			});
			if (_this.rightClickCallback) {
				$tr.mousedown(function(e){
					if( e.button == 2 ) {
						document.oncontextmenu = function() {return false;};
						_this.rightClickCallback(e.pageX, e.pageY, this.id);
						return false;
					}
					return true;
				});
			}
			$tbody.append($tr);
		}
		$table.append($tbody);
		$('#' + tableId + " th").click(function() {
			_this.sort($(this).attr('label'), $(this).attr('data-type'));
		});
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