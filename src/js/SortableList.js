var SortableList = function(tableId, titles, list) {
	this.list = null;
	this.titles = null;
	this.lastLabel = null;
	this.lastLabelOrder = "ASC";

	var _this = this;

	this.init = function(tableId, titles, list) {
		this.list = list;
		this.titles = titles;
		this.display();
		$('#' + tableId + " th").click(function() {
			_this.sort($(this).attr('label'), $(this).attr('dataType'));
		});
	};

	this.sort = function(label, type) {
		if (this.lastLabel == label)
			this.lastLabelOrder = this.lastLabelOrder == "ASC" ? "DESC" : "ASC";
		else
			this.lastLabelOrder = "ASC";
		this.lastLabel = label;

		switch (type) {
			case "string":
			default:
				this.list.sort(sortBy(label, this.lastLabelOrder == "DESC", function(a) {return a.toUpperCase()}));
				break;
			case "int":
				this.list.sort(sortBy(label, this.lastLabelOrder == "DESC", parseInt));
				break;
		}
	};

	this.display = function() {
		var $tr = $('<tr>');
		for (var i in this.titles) {
			$tr.append($('<th>').attr({label:this.titles[i].label, "data-type":this.titles[i].dataType}).text(this.titles[i].title));
		}
		$("#" + tableId).append($tr);
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