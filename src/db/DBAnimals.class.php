<?php

require_once dirname(__FILE__).'/db-config.php';
require_once dirname(__FILE__).'/../Utils.class.php';

class DBAnimals extends SQLite3 {

	public static $frenchMonths = array(null, "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");

	function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	function __destruct() {
		$this->close();
	}

	public function getList($job) {
		$stmt = $this->prepare('SELECT h.*
			FROM link_job_horses AS ljh
			LEFT JOIN horses AS h ON ljh.horseId = h.id
			WHERE job = :job
			ORDER BY h.id DESC;');
		$stmt->bindValue(':job', $job);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = self::format($row);
		}
		return $ret;
	}

	public function filter($job, $term) {
		$stmt = $this->prepare('SELECT h.*
			FROM link_job_horses AS ljh
			LEFT JOIN horses AS h ON ljh.horseId = h.id
			WHERE job = :job
			AND (h.name LIKE :term
				OR h.type LIKE :term
				OR h.race LIKE :term
				OR h.colour LIKE :term
				OR h.size LIKE :term
				OR h.puce LIKE :term
				)
			ORDER BY h.id DESC');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':term', $term.'%');
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
		$ret = $this->format($res->fetchArray(SQLITE3_ASSOC));
		$ret['performancesList'] = $this->getPerformancesList($ret['id']);
		return $ret;
	}

	public function getPerformancesList($id) {
		$stmt = $this->prepare('SELECT p.*, quantity, date, lhp.id AS id
			FROM link_horses_performances AS lhp
			LEFT JOIN performances AS p ON lhp.performanceId = p.id
			WHERE horseId = :id
			ORDER BY date DESC;');
		$stmt->bindValue('id', $id);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$row['formattedDate'] = Utils::formatDate($row['date']);
			$ret[] = $row;
		}
		return $ret;
	}

	public function search($job, $term) {
		$stmt = $this->prepare('SELECT h.*
			FROM link_job_horses AS ljh
			LEFT JOIN horses AS h ON ljh.horseId = h.id
			WHERE job = :job
			AND h.name LIKE :term
			ORDER BY h.name ASC
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
		if (!$horse['birthdate']) {
			$horse['age'] = "";
			$horse['birthdate'] = "Non renseignée";
			$horse['humanBirthdate'] = "Non renseignée";
		} else {
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
		}
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

	public function addPerformance($horseId, $performanceId, $quantity) {
		$stmt = $this->prepare('INSERT INTO link_horses_performances(date, horseId, performanceId, quantity)
			VALUES(:date, :horseId, :performanceId, :quantity);');
		$stmt->bindValue(':date', time());
		$stmt->bindValue(':horseId', $horseId);
		$stmt->bindValue(':performanceId', $performanceId);
		$stmt->bindValue(':quantity', $quantity);
		$stmt->execute();
	}

	public function editPerformanceQuantity($performanceId, $quantity) {
		$stmt = $this->prepare('UPDATE link_horses_performances
			SET quantity = :quantity
			WHERE id = :id;');
		$stmt->bindValue(':id', $performanceId);
		$stmt->bindValue(':quantity', $quantity);
		$stmt->execute();
	}

	public function deletePerformance($performanceId) {
		$stmt = $this->prepare('DELETE FROM link_horses_performances WHERE id = :id;');
		$stmt->bindValue(':id', $performanceId);
		$stmt->execute();
	}

	public function editPerformanceDate($performanceId, $date) {
		$stmt = $this->prepare('UPDATE link_horses_performances
			SET date = :date
			WHERE id = :id;');
		$stmt->bindValue(':id', $performanceId);
		$stmt->bindValue(':date', $date);
		$stmt->execute();
	}
}
?> 