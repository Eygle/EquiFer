<?php

require_once dirname(__FILE__).'/../db/DBAlerts.class.php';
require_once dirname(__FILE__).'/../Utils.class.php';

$db = new DBAlerts();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		Utils::checkGetArgs('action');
		switch ($_GET['action']) {
			case "getAlertsList":
				echo json_encode($db->getAlertsList());
				break;
			case "getProgrammedAlertsList":
				Utils::checkGetArgs('category', 'id');
				echo json_encode($db->getProgrammedAlertsListFor($_GET['category'], $_GET['id']));
				break;
			case "getProgrammedAlert":
				Utils::checkGetArgs('id');
				echo json_encode($db->getProgrammedAlert($_GET['id']));
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "addProgrammedAlert":
				Utils::checkPostArgs(array('frequency', 'from', 'category', 'objectId', 'title'));
				$db->addProgrammedAlert($_POST['frequency'], $_POST['from'], $_POST['category'], $_POST['objectId'], $_POST['title']);
				echo json_encode(null);
				break;
			case "editProgrammedAlert":
				Utils::checkPostArgs(array('id', 'frequency', 'from', 'title'));
				$db->editProgrammedAlert($_POST['id'], $_POST['frequency'], $_POST['from'], $_POST['title']);
				echo json_encode(null);
				break;
			case "deleteAlert":
				Utils::checkPostArgs('id');
				$db->deleteAlert($_POST['id']);
				break;
			case "deleteProgrammedAlert":
				Utils::checkPostArgs('id');
				$db->deleteProgrammedAlert($_POST['id']);
				break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

?>