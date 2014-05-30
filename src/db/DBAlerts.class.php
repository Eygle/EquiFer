<?php

require_once dirname(__FILE__).'/db-config.php';
require_once dirname(__FILE__).'/../Utils.class.php';

class DBAlerts extends SQLite3 {

	function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	function __destruct() {
		$this->close();
	}

	public function getAlertsList($job) {
		$this->updateAlerts();
		$stmt = $this->prepare('SELECT * FROM alerts ORDER BY id DESC;');
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $this->formatAlert($row);
		}
		return $ret;
	}

	private function updateAlerts() {
		$last = $this->getLastAlertDate();
		$now = Utils::todayFirstHour();
		if ($now - $last == 0) return;
		$programmedAlerts = $this->getAllProgrammedAlerts();

		while ($now - $last >= 0) {
			foreach($programmedAlerts as $v) {
				switch ($v['frequency']) {
					case 'daily':
						$this->addAlert($v['category'], $v['objectId'], $v['title'], $now);
					break;
					case 'weekly':
						if (date('w', $now) == $v['from'])
							$this->addAlert($v['category'], $v['objectId'], $v['title'], $now);
					break;
					case 'monthly':
						if (date('j', $now) == $v['from'])
							$this->addAlert($v['category'], $v['objectId'], $v['title'], $now);
					break;
				}
			}
			$now += Utils::$SECONDS_IN_A_DAY;
		}
	}

	public function getAllProgrammedAlerts() {
		$ret = array();
		$stmt = $this->prepare('SELECT * FROM programmed_alerts;');
		$res = $stmt->execute();
		while ($row = $res->fetchArray(SQLITE3_ASSOC))
			$ret[] = $row;
		return $ret;
	}

	private function getLastAlertDate() {
		$stmt = $this->prepare('SELECT MAX(date) AS date FROM alerts;');
		$res = $stmt->execute();
		$row = $res->fetchArray(SQLITE3_ASSOC);
		return $row ? $row['date'] : Utils::todayFirstHour();
	}

	public function getProgrammedAlertsListFor($category, $id) {
		$stmt = $this->prepare('SELECT * FROM programmed_alerts
			WHERE category = :category AND objectId = :id;');
		$stmt->bindValue(':category', $category);
		$stmt->bindValue(':id', $id);
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $row;
		}
		return $ret;
	}

	public function addAlert($category, $objectId, $title, $date = null) {
		$stmt = $this->prepare('INSERT INTO alerts(date, category, objectId, title)
			VALUES(:date, :category, :objectId, :title);');
		$stmt->bindValue(':date', $date ? $date : Utils::todayFirstHour());
		$stmt->bindValue(':category', $category);
		$stmt->bindValue(':objectId', $objectId);
		$stmt->bindValue(':title', $title);
		$stmt->execute();
	}

	public function addProgrammedAlert($freq, $from, $category, $objectId, $title) {
		$stmt = $this->prepare("INSERT INTO programmed_alerts(frequency, `from`, category, objectId, title)
			VALUES(:frequency, :from, :category, :objectId, :title);");
		$stmt->bindValue(':frequency', $freq);
		$stmt->bindValue(':from', $from);
		$stmt->bindValue(':category', $category);
		$stmt->bindValue(':objectId', $objectId);
		$stmt->bindValue(':title', $title);
		$stmt->execute();
	}

	public function editProgrammedAlert($id, $freq, $from, $category, $objectId, $title) {
		$stmt = $this->prepare("UPDATE programmed_alerts
			SET frequency = :frequency, `from` = :from, category = :category,
			objectId = :objectId, title = :title
			WHERE id = :id;");
		$stmt->bindValue('id', $id);
		$stmt->bindValue(':frequency', $freq);
		$stmt->bindValue(':from', $from);
		$stmt->bindValue(':category', $category);
		$stmt->bindValue(':objectId', $objectId);
		$stmt->bindValue(':title', $title);
		$stmt->execute();
		$this->deleteLinksToJob($id);
	}

	public function deleteAlert($id) {
		$stmt = $this->prepare('DELETE FROM alerts WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
		$this->deleteLinksToHorses($id);
	}

	public function deleteProgrammedAlert($id) {
		$stmt = $this->prepare('DELETE FROM programmed_alerts WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
		$this->deleteLinksToHorses($id);
	}

	private function formatAlert($data) {
		$data['date'] = Utils::formatDate($data['date']);
		switch ($data['category']) {
			case 'animals':
				$data['name'] = $this->getAnimalName($data['objectId']);
			break;
			case 'clients':
				$data['name'] = $this->getClientName($data['objectId']);
			break;
		}
		return $data;
	}

	private function getAnimalName($id) {
		$stmt = $this->prepare('SELECT name FROM animals WHERE id = :id');
		$stmt->bindValue('id', $id);
		$res = $stmt->execute();
		$ret = $stmt->fetchArray(SQLITE3_ASSOC);
		return $ret['name'];
	}

	private function getClientName($id) {
		$stmt = $this->prepare('SELECT firstName, lastName FROM clients WHERE id = :id');
		$stmt->bindValue('id', $id);
		$res = $stmt->execute();
		$ret = $stmt->fetchArray(SQLITE3_ASSOC);
		return $ret['firstName'].' '.$ret['lastName'];
	}
}
?> 