<?php

require_once dirname(__FILE__).'/db-config.php';
require_once dirname(__FILE__).'/DBAnimals.class.php';
require_once dirname(__FILE__).'/DBClients.class.php';

class DBBills extends SQLite3 {

	function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	function __destruct() {
		$this->close();
	}

	public function getList($job) {
		$stmt = $this->prepare('SELECT c.*
			FROM link_job_bills AS ljc
			LEFT JOIN bills AS c ON ljc.billId = c.id
			WHERE job = :job;');
		$stmt->bindValue(':job', $job);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $this->formatInfos($row);
		}
		return $ret;
	}

	private function getJobsLinks($id) {
		$stmt = $this->prepare('SELECT * FROM link_job_bills WHERE billId = :id');
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

	private function formatInfos($bill) {
		$bill = array_merge($bill, $this->getJobsLinks($bill['id']));
		return $bill;
	}

	public function add($date, $total, $taxFree, $file) {
		$stmt = $this->prepare("INSERT INTO bills(date, total, taxFree, file) VALUES(:date, :total, :taxFree, :file);");
		$stmt->bindValue(':date', $date);
		$stmt->bindValue(':total', $total);
		$stmt->bindValue(':taxFree', $taxFree);
		$stmt->bindValue(':file', $file);
		$stmt->execute();

		return $this->lastInsertRowID();
	}

	public function delete($id) {
		$stmt = $this->prepare('DELETE FROM bills WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
		$this->deleteLinksToHorses($id);
	}

	private function deleteLinksToJob($id) {
		$stmt = $this->prepare('DELETE FROM link_job_bills WHERE billId = :billId;');
		$stmt->bindValue(':billId', $id);
		$stmt->execute();
	}

	public function linkToJob($job, $id) {
		$stmt = $this->prepare('INSERT INTO link_job_bills(job, billId) VALUES(:job, :id);');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':id', $id);
		$stmt->execute();
	}

	public function getClientInfos($id, $job) {
		$clientDB = new DBClients();
		$animalsDB = new DBAnimals();
		$res = array();
		$res['client'] = $clientDB->getInfo($id);

		foreach ($res['client']['animalsList'] as $i => $v) {
			$res['client']['animalsList'][$i]['performancesList'] = $animalsDB->getPerformancesList($v['id']);
		}
		return $res;
	}
}
?> 