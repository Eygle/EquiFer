var Stack = function() {
	this.content = [];

	this.push = function(val) {
		this.content.push(val);
	};

	this.pop = function() {
		return this.content.pop();
	};

	this.length = function() {
		return this.content.length;
	};

	this.empty = function() {
		this.content = [];
	};

	this.top = function() {
		return this.length() ? this.content[this.length() - 1] : null;
	};
};