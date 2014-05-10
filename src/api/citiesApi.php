<?php

require_once dirname(__FILE__).'/../db/DBCities.class.php';

$db = new DBCities();

if (isset($_GET['term'])) {
	echo json_encode($db->autocomplete($_GET['term']));
}

?>