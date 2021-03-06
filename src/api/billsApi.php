<?php

require_once dirname(__FILE__).'/../db/DBBills.class.php';
require_once dirname(__FILE__).'/../Utils.class.php';
require_once dirname(__FILE__).'/../conf.php';

$db = new DBBills();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		Utils::checkGetArgs('action');
		switch ($_GET['action']) {
			case "getList":
				Utils::checkGetArgs('job');
				echo json_encode($db->getList($_GET['job']));
				break;
			case "getClientInfos":
				Utils::checkGetArgs('clientId', 'job');
				echo json_encode($db->getClientInfos($_GET['clientId'], $_GET['job']));
				break;
			case "filter":
				Utils::checkGetArgs(array('job', 'term'));
				echo json_encode($db->filter($_GET['job'], $_GET['term']));
				break;
			case "filterForClient":
				Utils::checkGetArgs(array('id', 'term'));
				echo json_encode($db->filterForClient($_GET['id'], $_GET['term']));
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "add":
				Utils::checkPostArgs(array('clientId', 'totalTTC', 'totalHT', 'file', 'inFarriery', 'inPension'));
				$id = $db->add($_POST['clientId'], $_POST['totalTTC'], $_POST['totalHT'], $_POST['file']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $id);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $id);
				echo json_encode(array("id"=>$id));
				break;
			case "delete":
				Utils::checkPostArgs('id', 'deleteFile');
				$db->delete($_POST['id']);
				if ($_POST['deleteFile'] == "true" && isset($_POST['file'])) {
					@unlink(Utils::formatPath(SAVED_PDF_PATH."/".$_POST['file']));
				}
				break;
			case "editPDF":
				Utils::checkPostArgs(array('header', 'content'));
				$fd = fopen(Utils::formatPath(dirname(__FILE__)."/../pdf-generator/pdf_header_generated.html"), 'w');
				fwrite($fd, $_POST['header']);
				fclose($fd);
				$fd = fopen(Utils::formatPath(dirname(__FILE__)."/../pdf-generator/pdf_generated.html"), 'w');
				fwrite($fd, $_POST['content']);
				fclose($fd);
				echo json_encode(null);
				break;
			case "save":
				Utils::checkPostArgs(array('file', 'path'));
				//$_GET['file'] = $_POST['path'].'/'.$_POST['file'].'.pdf';
				$_GET['file'] = $_POST['file'].'.pdf';
				$_GET['title'] = $_POST['file'];
				include(Utils::formatPath(dirname(__FILE__)."/../pdf-generator/generatePDF.php"));
				return json_encode(null);
				break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

?>