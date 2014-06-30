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
			case "getSecurity":
				echo json_encode($db->getSecurity());
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "editCompany":
				Utils::checkPostArgs(array('name', 'address', 'zipcode', 'city', 'phoneFixe', 'phoneMobile', 'mail', 'siret'));
				$db->editCompany($_POST['name'], $_POST['address'], $_POST['zipcode'],
					$_POST['city'], $_POST['phoneFixe'], $_POST['phoneMobile'],	$_POST['mail'], $_POST['siret']);
				break;
			case "editSecurity":
				Utils::checkPostArgs('active');
				$freq = null;
				$from = null;
				if ($_POST['active']) {
					Utils::checkPostArgs(array('frequency', 'from'));
					$freq = $_POST['frequency'];
					$from = $_POST['from'];
				}
				$db->editSecurity($_POST['active'], $freq, $from);
				break;
			case "checkAutoSave":
				if ($db->checkSecurityAutoSave()) {
					$name = date('Y')."-".date('m')."-".date('d')."-save-database";
					echo "Save with name $name!";
					copy(dirname(__FILE__)."/../db/database.sqlite", dirname(__FILE__)."/../saveDB/$name.sqlite");
				}
			break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

?>