<?php

include(dirname(__FILE__)."/../libs/mpdf/mpdf.php");

$mpdf = new mPDF('',	// mode - default ''
	'',	// format - A4, for example, default ''
	0,	// font size - default 0
	'arial',	// default font family
	5,	// margin_left
	5,	// margin right
	40,	// margin top
	20,	// margin bottom
	8,	// margin header
	8,	// margin footer
	'P');

$mpdf->setHTMLHeader(file_get_contents('pdf_header_generated.html'), 'EO');
$mpdf->SetHTMLFooter('<div style="width:100%;text-align:center;">Page {PAGENO} sur {nb}</div>', 'EO');

// send the captured HTML from the output buffer to the mPDF class for processing
$mpdf->WriteHTML(file_get_contents("pdf_generated.html"));



$mpdf->Output();

exit;

?>