<?php

require_once dirname(__FILE__).'/db-config.php';

class DBPerformances extends SQLite3 {

	public function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	public function getList($job) {
		$stmt = $this->prepare('SELECT p.* FROM link_job_performances AS ljp
			LEFT JOIN performances AS p ON ljp.performanceId = p.id
			WHERE job = :job;');
		$stmt->bindValue(':job', $job);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $this->formatInfos($row);
		}
		return $ret;
	}

	public function getInfo($id) {
		$stmt = $this->prepare('SELECT * FROM performances WHERE id = :id');
		$stmt->bindValue(':id', $id);
		$res = $stmt->execute();
		return $this->formatInfos($res->fetchArray(SQLITE3_ASSOC));
	}

	private function formatInfos($data) {
		if (!$data) return null;
		$data['formattedTVA'] = str_replace(".", ",", round(floatval(str_replace(",", ".", $data['tva'])), 2) . " %");
		$data['formattedPrice'] = str_replace(".", ",", round(floatval(str_replace(",", ".", $data['price'])), 2) . " €");
		return array_merge($data, $this->getJobsLinks($data['id']));
	}

	private function getJobsLinks($id) {
		$stmt = $this->prepare('SELECT * FROM link_job_performances WHERE performanceId = :id');
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

	public function add($name, $price, $tva, $unit, $defaultQuantity) {
		$stmt = $this->prepare("INSERT INTO performances(name, price, tva, unit, defaultQuantity)
			VALUES(:name, :price, :tva, :unit, :defaultQuantity);");
		$stmt->bindValue(':name', $name);
		$stmt->bindValue(':price', $price);
		$stmt->bindValue(':tva', $tva);
		$stmt->bindValue(':unit', $unit);
		$stmt->bindValue(':defaultQuantity', $defaultQuantity);
		$stmt->execute();

		return $this->lastInsertRowID();
	}

	public function edit($id, $name, $price, $tva, $unit, $defaultQuantity) {
		$stmt = $this->prepare("UPDATE performances
			SET name = :name, price = :price, tva = :tva,
			unit = :unit, defaultQuantity = :defaultQuantity
			WHERE id = :id;");
		$stmt->bindValue('id', $id);
		$stmt->bindValue(':name', $name);
		$stmt->bindValue(':price', $price);
		$stmt->bindValue(':tva', $tva);
		$stmt->bindValue(':unit', $unit);
		$stmt->bindValue(':defaultQuantity', $defaultQuantity);
		$stmt->execute();
		$this->deleteLinksToJob($id);
	}

	public function delete($id) {
		$stmt = $this->prepare('DELETE FROM performances WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
	}

	private function deleteLinksToJob($id) {
		$stmt = $this->prepare('DELETE FROM link_job_performances WHERE performanceId = :id;');
		$stmt->bindValue(':id', $id);
		$stmt->execute();
	}

	public function linkToJob($job, $id) {
		$stmt = $this->prepare('INSERT INTO link_job_performances(job, performanceId) VALUES(:job, :id);');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':id', $id);
		$stmt->execute();
	}
}
?> 