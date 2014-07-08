<?php

require_once dirname(__FILE__).'/../db/DBStocks.class.php';
require_once dirname(__FILE__).'/../Utils.class.php';

$db = new DBAnimals();

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
			case "filter":
				Utils::checkGetArgs(array('job', 'term'));
				echo json_encode($db->filter($_GET['job'], $_GET['term']));
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "add":
				Utils::checkPostArgs(array('name', 'quantity', 'quantityAlert', 'unity', 'inFarriery'));
				$id = $db->add($_POST['name'],	$_POST['quantity'], $_POST['quantityAlert'], $_POST['unity']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $id);
				echo json_encode(array("id"=>$id));
				break;
			case "edit":
				Utils::checkPostArgs(array('id', 'name', 'quantity', 'quantityAlert', 'unity', 'inFarriery'));
				$db->edit($_POST['id'], $_POST['name'],	$_POST['quantity'], $_POST['quantityAlert'], $_POST['unity']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $_POST['id']);
				echo json_encode(null);
				break;
			case "editQuantity":
				Utils::checkPostArgs(array('id', 'quantity'));
				$db->editQuantity($_POST['id'], $_POST['quantity']);
				break;
			case "addQuantity":
				Utils::checkPostArgs('id');
				$db->addQuantity($_POST['id']);
				break;
			case "subQuantity":
				Utils::checkPostArgs('id');
				$db->subQuantity($_POST['id']);
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