var FrequencyFormManager = function() {};

FrequencyFormManager.init = function(content, saveCallback, unique) {
	$(content + ' #frequency').change(function(event) {
		switch($(this).val()) {
			case 'daily':
				$(content + ' #date').attr('type', 'hidden');
				$(content + ' .ui-datepicker-trigger').hide();
				$(content + ' #from').hide();
				$(content + ' label[for=from]').hide();
				break;
			case 'weekly':
				$(content + ' #date').attr('type', 'hidden');
				$(content + ' .ui-datepicker-trigger').hide();
				$(content + ' #from').show().html('<option value="1">Lundi</option><option value="2">Mardi</option><option value="3">Mercredi</option><option value="4">Jeudi</option><option value="5">Vendredi</option><option value="6">Samedi</option><option value="0">Dimanche</option>');
				$(content + ' label[for=from]').text("A partir du").show();
				break;
			case 'monthly':
				$(content + ' #date').attr('type', 'hidden');
				$(content + ' .ui-datepicker-trigger').hide();
				$(content + ' label[for=from]').text("A partir du").show();
				var from = $(content + ' #from');
				from.show().html("");
				for (var i = 1; i <= 31; i++) {
					from.append($('<option>').attr('value', i).text(i));
				}
				break;
			case 'unique':
				$(content + ' label[for="from"]').text("Le");
				$(content + ' #from').hide();
				$(content + ' .ui-datepicker-trigger').show();
				$(content + ' #date').attr('type', 'text');
				break;
		}
	});

	$(content + ' button').click(function() {
		var freq = $(content + ' #frequency').val();
			var params = {
				frequency:	freq,
				from:		freq == "unique" ? $(content + " #date").val() : $(content + ' #from').val()
			};
		if (!FrequencyFormManager.checkParams(params)) return;
		saveCallback(params);
	});

	if (unique) {
		$(content + ' #date').datepicker({
			dateFormat: 'dd/mm/yy',
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			showOn: "button",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true
		});
		$(content + ' .ui-datepicker-trigger').hide();
	}
};

FrequencyFormManager.initValuesFromData = function(content, data) {
	if (data['frequency'])
		$(content + ' #frequency').val(data['frequency']).trigger('change');
	if (data['frequency'] == 'unique') {
		$(content + ' #from').hide();
		$(content + ' #date').val(data['from']).show();
		$(content + ' .ui-datepicker-trigger').show();
	} else if(data['frequency'] == 'daily') {
		$(content + ' #from').hide();
	} else {
		$(content + ' #from').show();
		if (data['from'])
			$(content + ' #from').val(data['from']);
		$(content + ' .ui-datepicker-trigger').hide();
		$(content + ' #date').hide();
	}
};

FrequencyFormManager.checkParams = function(params) {
	if (params.frequency == "unique" && !new RegExp(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/).test(params.from)) {
		alert(Strings.ALERTS_REQUIRE_DATE);
		return false;
	}
	return true;
};