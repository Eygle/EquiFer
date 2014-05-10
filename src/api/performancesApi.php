<?php

require_once dirname(__FILE__).'/../db/DBPerformances.class.php';
require_once dirname(__FILE__).'/Utils.class.php';

$db = new DBPerformances();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		Utils::checkGetArgs('action');
		switch ($_GET['action']) {
			case "getList":
				Utils::checkGetArgs('job');
				echo json_encode($db->getList($_GET['job']));
				break;
			case "getInfos":
				Utils::checkGetArgs('id');
				echo json_encode($db->getInfo($_GET['id']));
				break;
			case "search":
				Utils::checkGetArgs(array('job', 'term'));
				echo json_encode($db->search($_GET['job'], $_GET['term']));
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "add":
				Utils::checkPostArgs(array('name', 'price', 'tva', 'unit', 'defaultQuantity', 'inFarriery', 'inPension'));
				$id = $db->add($_POST['name'],	$_POST['price'], $_POST['tva'], $_POST['unit'], $_POST['defaultQuantity']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $id);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $id);
				echo json_encode(array("id"=>$id));
				break;
			case "edit":
				Utils::checkPostArgs(array('id', 'name', 'price', 'tva', 'unit', 'defaultQuantity', 'inFarriery', 'inPension'));
				$db->edit($_POST['id'], $_POST['name'],	$_POST['price'], $_POST['tva'], $_POST['unit'], $_POST['defaultQuantity']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $_POST['id']);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $_POST['id']);
				echo json_encode(null);
				break;
			case "delete":
				Utils::checkPostArgs('id');
				$db->delete($_POST['id']);
				break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

?>