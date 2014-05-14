<?php

require_once dirname(__FILE__).'/../db/DBHistory.class.php';
require_once dirname(__FILE__).'/Utils.class.php';

$db = new DBHistory();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		Utils::checkGetArgs('action');
		switch ($_GET['action']) {
			case "getList":
				Utils::checkGetArgs('job');
				echo json_encode($db->getList($_GET['job']));
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "add":
				Utils::checkPostArgs(array('category', 'histAction', 'level', 'object', 'object2', 'inFarriery', 'inPension'));
				$id = $db->add($_POST['category'],	$_POST['histAction'], $_POST['level'], $_POST['object'], $_POST['object2']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $id);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $id);
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