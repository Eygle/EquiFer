function switchJob() {
	Config.job = Config.job == "farriery" ? "pension" : "farriery";
	$('#switchJob').css('background-image', 'url("images/' + (Config.job == "farriery" ? "farrieryIcon" : "pensionIcon2") + '.png")');
	ManageView.setAsRoot(new HomeView());
	$('#jobLabel').text(Config.job == "farriery" ? "Maréchalerie" : "Pension");
}

function initProgram() {
	$("#jobSelection").hide();
	$("#corps").show();
	new Tabs();
	ManageView.init();
	ManageView.push(new HomeView());
}

$(document).ready(function() {
	$("#farriery").click(function() {
		Config.job = "farriery";
		$('#switchJob').css('background-image', 'url("images/farrieryIcon.png")');
		$('#jobLabel').text(Config.job == "farriery" ? "Maréchalerie" : "Pension");
		initProgram();
	});
	$("#pension").click(function() {
		Config.job = "pension";
		$('#switchJob').css('background-image', 'url("images/pensionIcon2.png")');
		$('#jobLabel').text(Config.job == "farriery" ? "Maréchalerie" : "Pension");
		initProgram();
	});

	$('#switchJob').click(function() {
		switchJob();
	});
});