<?php

require_once dirname(__FILE__).'/db-config.php';
require_once dirname(__FILE__).'/../Utils.class.php';

class DBAnimals extends SQLite3 {

	function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	function __destruct() {
		$this->close();
	}

	public function getList($job) {
		$stmt = $this->prepare('SELECT s.*
			FROM link_job_stocks AS ljs
			LEFT JOIN stocks AS s ON ljs.stockId = s.id
			WHERE job = :job
			ORDER BY s.id DESC;');
		$stmt->bindValue(':job', $job);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $row;
		}
		return $ret;
	}

	public function filter($job, $term) {
		$stmt = $this->prepare('SELECT s.*
			FROM link_job_stocks AS ljs
			LEFT JOIN stocks AS s ON ljs.stockId = s.id
			WHERE job = :job
			AND (s.name LIKE :term
				OR s.quantity LIKE :term 
				OR s.quantityAlert LIKE :term
				)
			ORDER BY s.id DESC');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':term', $term.'%');
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $row;
		}
		return $ret;
	}

	public function getInfo($id) {
		$stmt = $this->prepare('SELECT * FROM stocks WHERE id = :id');
		$stmt->bindValue(':id', $id);
		$res = $stmt->execute();
		return $res->fetchArray(SQLITE3_ASSOC);
	}

	private function getJobsLinks($id) {
		$stmt = $this->prepare('SELECT * FROM link_job_stocks WHERE stockId = :id');
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

	public function add($name, $quantity, $quantityAlert) {
		$stmt = $this->prepare("INSERT INTO stocks(name, quantity, quantityAlert)
			VALUES(:name, :quantity, :quantityAlert);");
		$stmt->bindValue(':name', $name);
		$stmt->bindValue(':quantity', $quantity);
		$stmt->bindValue(':quantityAlert', $quantityAlert);
		$stmt->execute();

		return $this->lastInsertRowID();
	}

	public function edit($id, $name, $quantity, $quantityAlert) {
		$stmt = $this->prepare("UPDATE stocks
			SET name = :name, quantity = :quantity, quantityAlert = :quantityAlert
			WHERE id = :id;");
		$stmt->bindValue('id', $id);
		$stmt->bindValue(':name', $name);
		$stmt->bindValue(':quantity', $quantity);
		$stmt->bindValue(':quantityAlert', $quantityAlert);
		$stmt->execute();
		$this->deleteLinksToJob($id);
		$this->checkForAlert($id);
	}

	public function addQuantity($id) {
		$stmt = $this->prepare('UPDATE stocks SET quantity = quantity + 1 WHERE id = :id');
		$stmt->bindValue(':id', $id);
		$stmt->execute();
	}

	public function subQuantity($id) {
		$stmt = $this->prepare('UPDATE stocks SET quantity = quantity - 1 WHERE id = :id');
		$stmt->bindValue(':id', $id);
		$stmt->execute();
		$this->checkForAlert($id);
	}

	private function checkForAlert($id) {
		$stmt = $this->prepare('SELECT * FROM stocks WHERE id = :id');
		$stmt->bindValue('id', $id);
		$res = $stmt->execute();
		$res = $res->fetchArray(SQLITE3_ASSOC);
		if ($res['quantityAlert'] != -1 && $res['quantity'] <= $res['quantityAlert']) {
			$stmt = $this->prepare('INSERT INTO alerts(date, category, objectId, title)
			VALUES(:date, :category, :objectId, :title);');
			$stmt->bindValue(':date', time());
			$stmt->bindValue(':category', "stocks");
			$stmt->bindValue(':title', "stock_alert");
			$stmt->bindValue(':objectId', $id);
			$stmt->execute();
		}
	}

	public function delete($id) {
		$stmt = $this->prepare('DELETE FROM stocks WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
	}

	private function deleteLinksToJob($id) {
		$stmt = $this->prepare('DELETE FROM link_job_stocks WHERE stockId = :stockId;');
		$stmt->bindValue(':stockId', $id);
		$stmt->execute();
	}

	public function linkToJob($job, $id) {
		$stmt = $this->prepare('INSERT INTO link_job_stocks(job, stockId) VALUES(:job, :stockId);');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':stockId', $id);
		$stmt->execute();
	}
}
?> 