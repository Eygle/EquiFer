<?php

require_once dirname(__FILE__).'/../db/DBSettings.class.php';
require_once dirname(__FILE__).'/Utils.class.php';

$db = new DBSettings();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		Utils::checkGetArgs('action');
		switch ($_GET['action']) {
			case "getUser":
				echo json_encode($db->getUser());
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "editUser":
				Utils::checkPostArgs(array('address', 'zipcode', 'city', 'phoneFixe', 'phoneMobile', 'mail', 'companyName', 'siret'));
				$id = $db->editUser($_POST['address'], $_POST['zipcode'],
					$_POST['city'], $_POST['phoneFixe'], $_POST['phoneMobile'],	$_POST['mail'], $_POST['companyName'], $_POST['siret']);
				break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

?>