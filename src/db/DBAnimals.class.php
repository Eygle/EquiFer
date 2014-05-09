<?php

require_once dirname(__FILE__).'/db-config.php';

class DBAnimals extends SQLite3 {

	public static $frenchMonths = array(null, "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");

	public function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	public function getList($job) {
		$stmt = $this->prepare('SELECT h.*
			FROM link_job_horses AS ljh
			LEFT JOIN horses AS h ON ljh.horseId = h.id
			WHERE job = :job;');
		$stmt->bindValue(':job', $job);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = self::format($row);
		}
		return $ret;
	}

	public function getInfo($id) {
		$stmt = $this->prepare('SELECT * FROM horses WHERE id = :id');
		$stmt->bindValue(':id', $id);
		$res = $stmt->execute();
		return $this->format($res->fetchArray(SQLITE3_ASSOC));
	}

	public function search($job, $term) {
		$stmt = $this->prepare('SELECT h.*
			FROM link_job_horses AS ljh
			LEFT JOIN horses AS h ON ljh.horseId = h.id
			WHERE job = :job
			AND h.name LIKE :term
			LIMIT 15;');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':term', $term.'%');
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $this->format($row);
		}
		return $ret;
	}

	private function getJobsLinks($id) {
		$stmt = $this->prepare('SELECT * FROM link_job_horses WHERE horseId = :id');
		$stmt->bindValue("id", $id);
		$res = $stmt->execute();
		$ret = array("inPension" => false, "inFarriery" => false);
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			if ($row['job'] == "FARRIERY")
				$ret['inFarriery'] = true;
			else if ($row['job'] == "PENSION")
				$ret['inPension'] = true;
		}
		return $ret;
	}

	private function getOwnersNames($id) {
		$stmt = $this->prepare('SELECT c.firstName, c.lastName
			FROM link_clients_horses AS lch
			LEFT JOIN clients AS c ON lch.clientId = c.id
			WHERE lch.horseId = :id');
		$stmt->bindValue("id", $id);
		$res = $stmt->execute();
		$names = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$names[] = $row['firstName']." ".$row['lastName'];
		}
		return implode(', ', $names);
	}

	public function format($horse) {
		$horse = self::formatInfos($horse);
		$horse['owners'] = $this->getOwnersNames($horse['id']);
		return array_merge($horse, $this->getJobsLinks($horse['id']));
	}

	public static function formatInfos($horse) {
		$birth = explode('-', $horse['birthdate']);
		$age = time() - mktime(0,0,0,intval($birth[1]), 1, intval($birth[0]));
		if ($age < 31536000) // Less than a year
			$age = floor($age / 2592000)." mois";
		else {
			$years = floor($age / 31536000);
			$age = $years .($years > 1 ? " ans" : " an");
		}
		$horse['age'] = $age;
		$horse['birthdate'] = $birth[1]."/".$birth[0];
		$horse['humanBirthdate'] = self::$frenchMonths[intval($birth[1])]." ".$birth[0];
		$horse['isAlive'] = $horse['isAlive'] == "true";
		return $horse;
	}

	public function add($name, $gender, $type, $race, $puce, $birthdate, $size, $colour, $desc, $isAlive, $headMark, $footMark) {
		$stmt = $this->prepare("INSERT INTO horses(name, gender, type, race, puce, birthdate, size, colour, desc, isAlive, headMark, footMark)
			VALUES(:name, :gender, :type, :race, :puce, :birthdate, :size, :colour, :desc, :isAlive, :headMark, :footMark);");
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
		$stmt->bindValue(':headMark', $headMark);
		$stmt->bindValue(':footMark', $footMark);
		$stmt->execute();

		return $this->lastInsertRowID();
	}

	public function edit($id, $name, $gender, $type, $race, $puce, $birthdate, $size, $colour, $desc, $isAlive, $headMark, $footMark) {
		$stmt = $this->prepare("UPDATE horses
			SET name = :name, gender = :gender, type = :type, race = :race, puce = :puce, birthdate = :birthdate,
			size = :size, colour = :colour, desc = :desc, isAlive = :isAlive, headMark = :headMark, footMark = :footMark
			WHERE id = :id;");
		$stmt->bindValue('id', $id);
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
		$stmt->bindValue(':headMark', $headMark);
		$stmt->bindValue(':footMark', $footMark);
		$stmt->execute();
		$this->deleteLinksToJob($id);
	}

	public function delete($id) {
		$stmt = $this->prepare('DELETE FROM horses WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
		$this->deleteLinksToClients($id);
	}

	private function deleteLinksToJob($id) {
		$stmt = $this->prepare('DELETE FROM link_job_horses WHERE horseId = :horseId;');
		$stmt->bindValue(':horseId', $id);
		$stmt->execute();
	}

	private function deleteLinksToClients($id) {
		$stmt = $this->prepare('DELETE FROM link_clients_horses WHERE horseId = :horseId;');
		$stmt->bindValue(':horseId', $id);
		$stmt->execute();
	}

	public function linkToJob($job, $id) {
		$stmt = $this->prepare('INSERT INTO link_job_horses(job, horseId) VALUES(:job, :horseId);');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':horseId', $id);
		$stmt->execute();
	}
}
?> 