var CustomPopupManager = function() {};

CustomPopupManager.align = function() {
	var set = $('.set-content');
	var content = $('#custom-popup-background');
	set.css({
		left: (content.width() - set.width()) / 2,
		top: (content.height() - set.height()) /2
	});
};

CustomPopupManager.display = function(html, callback) {
	$('<div>').attr('id', 'custom-popup-background')
		.click(CustomPopupManager.destroy)
		.load(html, function() {
			$('#custom-popup-background, #custom-popup-background .close').click(CustomPopupManager.destroy);
			$('.set-content').click(function() {return false;});
			callback();
			CustomPopupManager.align();
	}).appendTo('body');

	$(window).resize(CustomPopupManager.align);
};

CustomPopupManager.destroy = function() {
	$('#custom-popup-background').remove();
	$(window).off("resize", CustomPopupManager.align);
};