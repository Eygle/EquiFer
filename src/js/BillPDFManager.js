var BillPDFManager = function(data) {
	this.htmlBill = null;

	var _this = this;

	this.init = function(data) {
		$('#hiddenBillHeader').load("pdf-generator/pdf_header.html", function() {
			$('#hiddenBillHeader .company').text(data.infos.companyName);
			var infos = $('#hiddenBillHeader .infos');
			infos.html($('<div>').text(data.infos.address + " - " + data.infos.zipcode + " " + data.infos.city));
			infos.append($('<div>').text("N° Siret " + data.infos.siret));
			infos.append($('<div>').html("Tél: " + data.infos.phoneFixe + " - Mobile: " + data.infos.phoneMobile + " - email: <span class=\"mail\">" + data.infos.mail + "</span>"));
			$('#hiddenBill').load("pdf-generator/pdf.html", function() {
				_this.sendPDF();
			});
		});
	};

	this.generate = function(data) {
		$('#hiddenBill').load("pdf-generator/pdf.html", function() {
			var $table = $('#hiddenBill #bill');
			this.generateTableHeader($table);

			for (var horse in data) {
				$table.append("<tr>").attr({colspan:8, class:"horseName"}).text(data[horse].name);
				for (var perf in data[horse].perfs) {
					perf = data[horse].perfs[perf];
					var date = $('<td>').attr({class: 'center'}).text(perf.date);
					var desc = $('<td>').attr({class: 'back-highlight'}).text(perf.desc);
					var unit = $('<td>').attr({class: 'center'}).text(perf.unit);
					var quantity = $('<td>').attr({class: 'center back-highlight'}).text(perf.quantity);
					var tva = $('<td>').attr({class: 'center'}).text(perf.tva);
					// if ()	// TODO REMISE
					// 	var desc = $('<td>').attr({class: 'center'}).text(perf.date);
					// if ()	// TODO SUPPL
					// 	var desc = $('<td>').attr({class: 'center'}).text(perf.date);
					var ht = $('<td>').attr({class: 'right'}).text(perf.ht);
					$table.append($('<tr>').append(date, desc, unit, quantity, tva, ht));
				}
			}
			$('#totalHT').text(data.totalHT);
			$('#totalTVA').text(data.totalTVA);
			$('#totalTTC, #price').text(data.totalTTC);
			_this.sendPDF();
		});
	};

	this.generateTableHeader = function(table, data) {
		var date = $('<th>').attr({class: 'center'}).text("Date");
		var desc = $('<th>').attr({class: 'back-highlight'}).text("Désignation");
		var unit = $('<th>').attr({class: 'center'}).text("Unité");
		var quantity = $('<th>').attr({class: 'center back-highlight'}).text("Quantité");
		var tva = $('<th>').attr({class: 'center'}).text("TVA");
		// if (data.)	// TODO REMISE
		// 	var desc = $('<th>').attr({class: 'center'}).text("Remise");
		// if (data.)	// TODO SUPPL
		// 	var desc = $('<th>').attr({class: 'center'}).text("Suppl.");
		var ht = $('<th>').attr({class: 'right'}).text("Montant HT");
		$table.append($('<tr>').append(date, desc, unit, quantity, tva, ht));
	};

	this.sendPDF = function() {
		$.post(Config.billsApi, {
			action:		"editPDF",
			header: 	$('#hiddenBillHeader').html(),
			content:	$('#hiddenBill').html()
		}, function() {
			// Display new PDF
			$('#pdfViewer').html($('<embed>').attr({type:"application/pdf", src:"pdf-generator/generatePDF.php"}));
		});
	};

	this.init(data);
};