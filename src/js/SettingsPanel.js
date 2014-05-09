var SettingsPanel = function() {

	var _this = this;

	this.init = function() {
		$('<div>').attr('id', 'panel-settings')
		.click(this.destroy)
		.load("includes/settings.html", function() {
			$('#panel-settings').click(_this.destroy);
			$('.set-content').click(function() {return false;});
			_this.display();
		}).appendTo('body');

		$(window).resize(this.display);
	};

	this.display = function() {
		var set = $('.set-content');
		var content = $('#panel-settings');
		set.css({
			left: (content.width() - set.width()) / 2,
			top: (content.height() - set.height()) /2
		});
	};

	this.destroy = function() {
		$('#panel-settings').remove();
		$(window).off("resize", this.display);
	};

	this.init();
};