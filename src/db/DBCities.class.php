<?php

require_once dirname(__FILE__).'/db-config.php';

class DBCities extends SQLite3 {

	function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_CITIES);
	}

	function __destruct() {
		$this->close();
	}

	public function autocomplete($term) {
		$stmt = $this->prepare('SELECT ville_nom, ville_code_postal
			FROM villes_france
			WHERE ville_nom LIKE :term OR ville_code_postal LIKE :term
			ORDER BY ville_nom ASC
			LIMIT 25;');
		$stmt->bindValue(':term', $term."%");
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = array("city" => $row['ville_nom'], "zipcode" => $row['ville_code_postal']);
		}
		return $ret;
	}	
}
?> 