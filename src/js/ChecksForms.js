var MESSAGE_APPEAR_DURATION = 3000;
var timeout = null;

var CheckForms = function() {};

CheckForms.check = function(content, data, checks) {
	var ret = true;
	var hasAlreadyDisplayMsg = false;

	for (var i in checks) {
		if (!checks[i].item && checks[i].items) {
			var oneIsGood = false;
			for (var j in checks[i].items) {
				if (CheckForms.checkItem(content, data, checks[i], checks[i].items[j].item, checks[i].items[j].id, false))
					oneIsGood = true;
			}
			
			for (var j in checks[i].items) {
				if (!oneIsGood) {
					$(content + ' #' + checks[i].items[j].id).parent().addClass('control-group error');
				} else {
					$(content + ' #' + checks[i].items[j].id).parent().removeClass('control-group error');
				}
			}

			if (!oneIsGood) {
				ret = false;
				if (!hasAlreadyDisplayMsg) CheckForms.displayMessage(content, false, checks[i].error);
				hasAlreadyDisplayMsg = true;
			}
		} else {
			var input = $(content + ' #' + checks[i].id);
			if (!CheckForms.checkItem(content, data, checks[i], checks[i].item, checks[i].id, !hasAlreadyDisplayMsg)) {
				input.parent().addClass('control-group error');
				ret = false;
				hasAlreadyDisplayMsg = true;
			} else {
				input.parent().removeClass('control-group error');
			}
		}
	}
	return ret;
};

CheckForms.checkItem = function(content, data, check, item, id, displayMessage) {
	if ((!check.facultative && !data[item]) || (check.maxSize && data[item].length > check.maxSize)) {
		if (displayMessage) CheckForms.displayMessage(content, false, check.error);
		return false;
	}

	if (check.format && data[item]) {
		if (check.format == "integer") {
			if (isNaN(parseInt(data[item]))) {
				if (displayMessage) CheckForms.displayMessage(content, false, check.formatError);
				return false;
			}
		} else if (check.format == "float") {
			if (isNaN(parseFloat(data[item]))) {
				if (displayMessage) CheckForms.displayMessage(content, false, check.formatError);
				return false;
			}
		} else {
			var regex;
			if (check.format == "mail")
				regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
			else if (check.format == "birthdate")
				regex = new RegExp(/[0-9]{2}\/[0-9]{4}/);

			if (!regex.test(data[item])) {
				if (displayMessage) CheckForms.displayMessage(content, false, check.formatError);
				return false;
			}
		}
	}
	return true;
};

CheckForms.displayMessage = function(content, success, message) {
	clearTimeout(timeout);

	$(content + ' .alert').remove();
	var button = $('<button type="button" class="close" data-dismiss="alert">×</button>').click(function() {
		$(this).parent().parent().remove();
	});
	$('<div class="message">').appendTo(content).append($('<div>').attr('class', 'alert ' + (success ? "alert-success" : "alert-error")).text(message).append(button));
	timeout = setTimeout(function() {
		$(content + ' .message').fadeOut(700, function() {
			$(this).remove();
		});
	}, MESSAGE_APPEAR_DURATION);
};