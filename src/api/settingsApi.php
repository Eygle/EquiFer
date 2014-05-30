<?php

require_once dirname(__FILE__).'/../db/DBSettings.class.php';
require_once dirname(__FILE__).'/../Utils.class.php';

$db = new DBSettings();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		Utils::checkGetArgs('action');
		switch ($_GET['action']) {
			case "getCompany":
				echo json_encode($db->getCompany());
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "editCompany":
				Utils::checkPostArgs(array('name', 'address', 'zipcode', 'city', 'phoneFixe', 'phoneMobile', 'mail', 'siret'));
				$id = $db->editCompany($_POST['name'], $_POST['address'], $_POST['zipcode'],
					$_POST['city'], $_POST['phoneFixe'], $_POST['phoneMobile'],	$_POST['mail'], $_POST['siret']);
				break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

?>