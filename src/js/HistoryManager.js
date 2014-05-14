var HistoryManager = function() {
	this.add = function(cat, action, lvl, obj, obj2, inFarriery, inPension, callback) {
		$.post(Config.historyApi, {
			action:		"add",
			category:	cat,
			histAction:	action,
			level:		lvl,
			object:		obj,
			object2:	obj2,
			inFarriery:	inFarriery,
			inPension:	inPension
 		}, callback);
	};
};

var History = new HistoryManager();