<?php

require_once dirname(__FILE__).'/../db/DBAnimals.class.php';

$db = new DBAnimals();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		switch ($_GET['action']) {
			case "getList":
				echo json_encode($db->getAnimalsList($_GET['job']));
				break;
		}
	} else {
		switch ($_POST['action']) {
			case "add":
				echo json_encode($db->addHorse($_POST['job'],
					$_POST['name'],	$_POST['gender'], $_POST['type'], $_POST['race'],
					$_POST['puce'], $_POST['birthdate'], $_POST['size'],
					$_POST['colour'], $_POST['desc'], $_POST['isAlive']));
				break;
		}
	}
}
catch(Exception $e) {

}

$db->close();

?>