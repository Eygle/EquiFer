var BillPDFManager = function(data) {
	this.htmlBill = null;

	var totalHT;
	var totalTTC;
	var billId;

	var _this = this;

	this.init = function(data) {
		$('#hiddenBillHeader').load("pdf-generator/pdf_header.php", function() {
			$('#hiddenBillHeader .company').text(data.infos.name);
			var infos = $('#hiddenBillHeader .infos');
			infos.html($('<div>').text(data.infos.address + " - " + data.infos.zipcode + " " + data.infos.city));
			infos.append($('<div>').text("N° Siret " + data.infos.siret));
			infos.append($('<div>').html("Tél: " + data.infos.phoneFixe + " - Mobile: " + data.infos.phoneMobile + " - email: <span class=\"mail\">" + data.infos.mail + "</span>"));
			$('#hiddenBill').load("pdf-generator/pdf.php", function() {
				_this.fillClientInfos(data);
				_this.generateTableHeader($('#hiddenBill .bill'));
				_this.sendPDF();
			});
		});
	};

	this.generate = function(data) {
		$('#hiddenBill').load("pdf-generator/pdf.php", function() {
			_this.fillClientInfos(data);

			var $table = $('#hiddenBill .bill');
			_this.generateTableHeader($table);

			_this.totalHT	= 0;
			_this.totalTTC	= 0;

			for (var horse in data.client.animalsList) {
				var horse = data.client.animalsList[horse];
				if (horse.performancesSelected == 0) continue;
				$table.append($("<tr>").append($('<td>').attr({colspan:7, class:"horseName"}).text(horse.name)));
				for (var perf in horse.performancesList) {
					perf = horse.performancesList[perf];
					if (!perf.isSelected) continue;
					var perfDate = new Date(parseInt(perf.date) * 1000);
					var date = $('<td>').attr({class: 'center'}).text(_this.formatNumber(perfDate.getDate(), 2) + '/' + _this.formatNumber((perfDate.getMonth() + 1), 2) + '/' + perfDate.getFullYear().toString());
					var desc;
					var realHT = _this.formatPriceToInt(perf.priceHT) * parseInt(perf.quantity);
					var realTTC = _this.formatPriceToInt(perf.priceTTC) * parseInt(perf.quantity);
					if (!perf.extra && !perf.discount) 
						desc = $('<td>').attr({class: 'back-highlight'}).text(perf.name);
					else if (perf.extra) {
						desc = $('<td>').attr({class: 'back-highlight'}).html(perf.name + '<div class="extra-discount">' + Strings.EXTRA_LABEL.replace('$1', _this.formatPriceToShow(perf.extra)) + '</div>');
						realHT += perf.extra;
						realTTC += perf.extra;
					}
					else {
						desc = $('<td>').attr({class: 'back-highlight'}).html(perf.name + '<div class="extra-discount">' + Strings.DISCOUNT_LABEL.replace('$1', _this.formatPriceToShow(perf.discount)) + '</div>');
						realHT -= perf.discount;
						realTTC -= perf.discount;
					}
					var unit = $('<td>').attr({class: 'center'}).text(perf.unit);
					var quantity = $('<td>').attr({class: 'center back-highlight'}).text(perf.quantity);
					var tva = $('<td>').attr({class: 'center'}).text(perf.tva);
					var unitHT = $('<td>').attr({class: 'right'}).text(parseInt(perf.quantity) > 1 || perf.extra || perf.discount ? new String("" + perf.priceHT).replace(',', '.') : "");
					var ht = $('<td>').attr({class: 'right'}).text(_this.formatPriceToShow(realHT));
					_this.totalHT += realHT;
					_this.totalTTC += realTTC;
					$table.append($('<tr>').append(date, desc, unit, quantity, tva, unitHT, ht));
				}
			}

			// _this.totalHT = Math.round(parseInt(_this.totalHT * 100)) / 100;
			// _this.totalTTC = Math.round(parseInt(_this.totalTTC * 100)) / 100;
			//var tva = Math.round((parseInt((_this.totalTTC - _this.totalHT) * 100))) / 100;
			var tva = _this.totalTTC - _this.totalHT;

			$('#totalHT').text(_this.formatPriceToShow(_this.totalHT) + " €");
			$('#totalTVA').text(_this.formatPriceToShow(tva) + " €");
			$('#totalTTC, #price').text(_this.formatPriceToShow(_this.totalTTC) + " €");
			_this.sendPDF();
		});
	};

	this.formatPriceToShow = function(price) {
		price = new String("" + price);
		var index = price.length - 2;
		return price.slice(0, index) + "." + price.slice(index);
	};

	this.formatPriceToInt = function(price) {
		price = new String("" + price).replace(',', '.');
		var i = price.indexOf(".");
		if (i == -1)
			price += "00";
		else if (i == price.length - 2)
			price += "0";
		return parseInt(price.replace('.', ''));
	};

	this.getFrenchMonth = function(month) {
		var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
		return months[month];
	};

	this.fillClientInfos = function(data) {
		var date = new Date();
		var billNbr = this.formatNumber(data['billNumber'], 5);
		this.billId = "FC" + date.getFullYear() + this.formatNumber(date.getMonth() + 1, 2) + this.formatNumber(date.getDate(), 2) + billNbr;
		$('#hiddenBill #billRef').text(this.billId);
		$('#hiddenBill #date').text(this.formatNumber(date.getDate(), 2) + '/' + this.formatNumber((date.getMonth() + 1), 2) + '/' + date.getFullYear().toString().substr(2,2));
		var maxDate = new Date(date.getFullYear(), date.getMonth() + 2, 0); // 30 days
		$('#hiddenBill #dateEnd').text(this.formatNumber(maxDate.getDate(), 2) + '/' + this.formatNumber((maxDate.getMonth() + 1), 2) + '/' + maxDate.getFullYear().toString().substr(2,2));
		$('#hiddenBill #dateEndFull').text(this.formatNumber(maxDate.getDate(), 2) + ' ' + this.formatNumber(this.getFrenchMonth(maxDate.getMonth()), 2) + ' ' + maxDate.getFullYear());
		$('#hiddenBill #clientName').text(data.client.firstName + ' ' + data.client.lastName);
		$('#hiddenBill #clientAddress').text(data.client.address);
		$('#hiddenBill #clientAdressEnd').text(data.client.zipcode + ' ' + data.client.city);
	};

	this.formatNumber = function(elem, digits) {
		var elem = String(elem);
		while (elem.length < digits)
			elem = '0'+elem;
		return elem;
	};

	this.generateTableHeader = function(table, data) {
		var date = $('<th>').attr({class: 'center'}).text("Date");
		var desc = $('<th>').attr({class: 'back-highlight'}).text("Désignation");
		var unit = $('<th>').attr({class: 'center'}).text("Unité");
		var quantity = $('<th>').attr({class: 'center back-highlight'}).text("Qte");
		var tva = $('<th>').attr({class: 'center'}).html("TVA<br />%");
		var unitHT = $('<th>').attr({class: 'center'}).html("Unit.<br />HT");
		var ht = $('<th>').attr({class: 'cener'}).html("Montant<br />HT");
		table.append($('<tr>').append(date, desc, unit, quantity, tva, unitHT, ht));
	};

	this.sendPDF = function() {
		$.post(Config.billsApi, {
			action:		"editPDF",
			header: 	$('#hiddenBillHeader').html(),
			content:	$('#hiddenBill').html()
		}, function(data) {
			$('#pdfViewer').html($('<embed>').attr({type:"application/pdf", src:"pdf-generator/generatePDF.php?title=" + _this.billId}));
		});
	};

	this.save = function(callback) {
		$.post(Config.billsApi, {
			action:	"save",
			file:	this.billId,
			path:	Config.savedPDFPath,
		}, function(data) {
			callback();
		});
	};

	this.init(data);
};