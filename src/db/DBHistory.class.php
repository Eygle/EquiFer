<?php

require_once dirname(__FILE__).'/db-config.php';
require_once dirname(__FILE__).'/../Utils.class.php';

class DBHistory extends SQLite3 {

	function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	function __destruct() {
		$this->close();
	}

	public function getList($job) {
		$stmt = $this->prepare('SELECT h.*
			FROM link_job_history AS ljh
			LEFT JOIN history AS h ON ljh.historyId = h.id
			WHERE job = :job
			ORDER BY id DESC;');
		$stmt->bindValue(':job', $job);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = self::format($row);
		}
		return $ret;
	}

	private static function format($data) {
		$data['date'] = Utils::formatDate($data['date']);
		return $data;
	}

	public function add($category, $action, $level, $object, $object2) {
		$stmt = $this->prepare('INSERT INTO history(date, category, action, level, object, object2)
			VALUES(:date, :category, :action, :level, :object, :object2);');
		$stmt->bindValue(':date', time());
		$stmt->bindValue(':category', $category);
		$stmt->bindValue(':action', $action);
		$stmt->bindValue(':level', $level);
		$stmt->bindValue(':object', $object);
		$stmt->bindValue(':object2', $object2);
		$stmt->execute();

		return $this->lastInsertRowID();
	}

	public function delete($id) {
		$stmt = $this->prepare('DELETE FROM history WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
	}

	private function deleteLinksToJob($id) {
		$stmt = $this->prepare('DELETE FROM link_job_history WHERE historyId = :historyId;');
		$stmt->bindValue(':historyId', $id);
		$stmt->execute();
	}

	public function linkToJob($job, $id) {
		$stmt = $this->prepare('INSERT INTO link_job_history(job, historyId) VALUES(:job, :historyId);');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':historyId', $id);
		$stmt->execute();
	}
}
?> 