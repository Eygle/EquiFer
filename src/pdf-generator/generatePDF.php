<?php

include(dirname(__FILE__)."/../libs/mpdf/mpdf.php");
require_once dirname(__FILE__).'/../Utils.class.php';

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

if (isset($_GET['title']) && !empty($_GET['title'])) {
	$mpdf->setTitle($_GET['title']);
}

$stylesheet = file_get_contents(Utils::formatPath(dirname(__FILE__).'/pdf-bill.css'));
$mpdf->WriteHTML($stylesheet,1);

$mpdf->setHTMLHeader(file_get_contents(Utils::formatPath(dirname(__FILE__).'/pdf_header_generated.html')), 'EO');
$mpdf->SetHTMLFooter('<div style="width:100%;text-align:center;">Page {PAGENO} sur {nb}</div>', 'EO');
$mpdf->WriteHTML(file_get_contents(Utils::formatPath(dirname(__FILE__).'/pdf_generated.html')));


if (isset($_GET['file']) && !empty($_GET['file'])) {
	$mpdf->Output(Utils::formatPath(SAVED_PDF_PATH."/".$_GET['file']), 'F');
} else
	$mpdf->Output();

exit;

?>