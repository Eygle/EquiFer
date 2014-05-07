<?php

class DBAnimals extends SQLite3 {

	public function __construct() {
		$this->open(dirname(__FILE__).'/database.sqlite');
		//$this->db = new SQLite3(dirname(__FILE__).'/database.sqlite');
	}

	public function getAnimalsList($job) {
		$stmt = $this->prepare('SELECT h.*
			FROM link_job_horses AS ljh
			LEFT JOIN horses AS h ON ljh.horseId = h.id
			WHERE job = :job;');
		$stmt->bindValue(':job', $job);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC))
			$ret[] = $row;
		return $ret;
	}

	public function addHorse($job, $name, $gender, $type, $race, $puce, $birthdate, $size, $colour, $desc, $isAlive) {
		$stmt = $this->prepare("INSERT INTO horses(name, gender, type, race, puce, birthdate, size, colour, desc, isAlive)
			VALUES(:name, :gender, :type, :race, :puce, :birthdate, :size, :colour, :desc, :isAlive);");
		$stmt->bindValue(':name', $name);
		$stmt->bindValue(':gender', $gender);
		$stmt->bindValue(':type', $type);
		$stmt->bindValue(':race', $race);
		$stmt->bindValue(':puce', $puce);
		$stmt->bindValue(':birthdate', $birthdate);
		$stmt->bindValue(':size', $size);
		$stmt->bindValue(':colour', $colour);
		$stmt->bindValue(':desc', $desc);
		$stmt->bindValue(':isAlive', $isAlive);
		$stmt->execute();

		// $id = $this->db->lastInsertRowID();
		// $stmt = $this->db->prepare('INSERT INTO link_job_horsess(job, horseId) VALUES(:job, :horseId)');
		// $stmt->bindValue(':job', $id);
		// $stmt->bindValue(':horseId', $type);
		// return array("id" => $id);
		return null;
	}
}
?> 