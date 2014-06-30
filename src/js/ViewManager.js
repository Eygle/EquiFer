var ViewManager = function() {
	this.stack = new Stack();
	this.current = null;

	var _this = this;

	this.init = function() {
		$("#saveButton").click(function() {_this.current.manageButtonClick("save")});
		$("#addButton").click(function() {_this.current.manageButtonClick("add")});
		$("#editButton").click(function() {_this.current.manageButtonClick("edit")});
		$("#removeButton").click(function() {_this.current.manageButtonClick("remove")});
		$("#returnButton").click(function() {_this.pop()});
	};

	this.push = function(view) {
		this.stack.push(view);
		this.current = view;
		this.display();
	};

	this.pop = function() {
		this.stack.pop();
		this.current = this.stack.top();
		this.display();
	};

	this.replace = function(view) {
		this.stack.pop();
		this.push(view);
	}

	this.display = function() {
		this.current.showSaveButton ? $("#saveButton").show() : $("#saveButton").hide();
		this.current.showAddButton ? $("#addButton").show() : $("#addButton").hide();
		this.current.showEditButton ? $("#editButton").show() : $("#editButton").hide();
		this.current.showRemoveButton ? $("#removeButton").show() : $("#removeButton").hide();
		this.current.showReturnButton ? $("#returnButton").show() : $("#returnButton").hide();
		this.current.showSaveButton || this.current.showAddButton
			|| this.current.showEditButton || this.current.showRemoveButton ? $("#manageSep").show() : $("#manageSep").hide();
		this.current.showReturnButton ? $("#retSep").show() : $("#retSep").hide();

		$("#content").load("includes/" + this.current.htmlPage, function() {
			$('#my-tabs div').each(function() {$(this).removeClass("selected")});
			$("#" + _this.current.tabLabel).addClass("selected");
			_this.current.init();
		});
	};

	this.setAsRoot = function(view) {
		this.stack.empty();
		this.push(view);
	};
};

var ManageView = new ViewManager();