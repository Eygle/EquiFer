<?php

require_once dirname(__FILE__).'/../db/DBClients.class.php';
require_once dirname(__FILE__).'/Utils.class.php';

$db = new DBClients();

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
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "add":
				Utils::checkPostArgs(array('firstName', 'lastName', 'address', 'zipcode', 'city', 'phoneFixe', 'phoneMobile', 'mail', 'inFarriery', 'inPension'));
				$id = $db->add($_POST['firstName'],	$_POST['lastName'], $_POST['address'], $_POST['zipcode'],
					$_POST['city'], $_POST['phoneFixe'], $_POST['phoneMobile'],	$_POST['mail']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $id);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $id);
				echo json_encode(array("id"=>$id));
				break;
			case "edit":
				Utils::checkPostArgs(array('id', 'firstName', 'lastName', 'address', 'zipcode', 'city', 'phoneFixe', 'phoneMobile', 'mail', 'inFarriery', 'inPension'));
					$db->edit($_POST['id'],
					$_POST['firstName'],	$_POST['lastName'], $_POST['address'], $_POST['zipcode'],
					$_POST['city'], $_POST['phoneFixe'], $_POST['phoneMobile'], $_POST['mail']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $_POST['id']);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $_POST['id']);
				echo json_encode(null);
				break;
			case "delete":
				Utils::checkPostArgs('id');
				$db->delete($_POST['id']);
				break;
			case "linkAnimal":
				Utils::checkPostArgs(array('clientId', 'animalId'));
				$db->addLinkToHorse($_POST['clientId'], $_POST['animalId']);
				break;
			case 'deleteLinkWithAnimal':
				Utils::checkPostArgs(array('clientId', 'animalId'));
				$db->deleteLinkToHorse($_POST['clientId'], $_POST['animalId']);
				break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

$db->close();

?>