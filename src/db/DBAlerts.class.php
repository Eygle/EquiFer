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

	public function getAlertsList() {
		$this->updateAlerts();
		$stmt = $this->prepare('SELECT * FROM alerts ORDER BY id DESC;');
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $this->formatAlert($row);
		}
		return $ret;
	}

	public function filterAlerts($term) {
		$this->updateAlerts();
		$stmt = $this->prepare('SELECT * FROM alerts
			WHERE title LIKE :term
			ORDER BY id DESC;');
		$stmt->bindValue(':term', $term.'%');
		$res = $stmt->execute();
		$ret = array();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$ret[] = $this->formatAlert($row);
		}
		return $ret;
	}

	private function updateAlerts() {
		$last = $this->getLastAlertsCheck();
		$now = Utils::todayFirstHour();
		if ($now - $last < 0) return;
		$programmedAlerts = $this->getAllProgrammedAlerts();
		while ($now - $last >= 0) {
			foreach($programmedAlerts as $v) {
				switch ($v['frequency']) {
					case 'daily':
						$this->addAlert($v['category'], $v['objectId'], $v['title'], $last);
					break;
					case 'weekly':
						if (date('w', $last) == $v['from'])
							$this->addAlert($v['category'], $v['objectId'], $v['title'], $last);
					break;
					case 'monthly':
						if (date('j', $last) == $v['from'])
							$this->addAlert($v['category'], $v['objectId'], $v['title'], $last);
					break;
					case 'unique':
						$date = explode('/', $v['from']);
						$alertTime = mktime(0,0,0,$date[1],$date[0],$date[2]);
						if (date('n') == date('n', $alertTime) && date('j') == date('j', $alertTime) && date('Y') == date('Y', $alertTime))
							$this->addAlert($v['category'], $v['objectId'], $v['title'], $last);
					break;
				}
			}
			$last += Utils::$SECONDS_IN_A_DAY;
		}
	}

	public function getAllProgrammedAlerts() {
		$ret = array();
		$stmt = $this->prepare('SELECT * FROM programmed_alerts ORDER BY id DESC;');
		$res = $stmt->execute();
		while ($row = $res->fetchArray(SQLITE3_ASSOC))
			$ret[] = $row;
		return $ret;
	}

	public function filterProgrammedAlerts($term) {
		$ret = array();
		$stmt = $this->prepare('SELECT * FROM programmed_alerts
			WHERE title LIKE :term
			ORDER BY id DESC;');
		$stmt->bindValue(':term', $term.'%');
		$res = $stmt->execute();
		while ($row = $res->fetchArray(SQLITE3_ASSOC))
			$ret[] = $row;
		return $ret;
	}

	private function getLastAlertsCheck() {
		$stmt = $this->prepare('SELECT lastAlertsCheck AS date FROM commons_infos;');
		$res = $stmt->execute();
		$row = $res->fetchArray(SQLITE3_ASSOC);
		$today = Utils::todayFirstHour();
		if ($row['date'] != $today) {
			$stmt = $this->prepare('UPDATE commons_infos SET lastAlertsCheck = :now');
			$stmt->bindValue(':now', $today);
			$stmt->execute();
		}
		if (!$row['date'])
			$row['date'] = $today;
		return $row['date'] + Utils::$SECONDS_IN_A_DAY;
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

	public function getProgrammedAlert($id) {
		$stmt = $this->prepare('SELECT * FROM programmed_alerts WHERE id = :id;');
		$stmt->bindValue(':id', $id);
		$res = $stmt->execute();
		return $res->fetchArray(SQLITE3_ASSOC);
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

	public function editProgrammedAlert($id, $freq, $from, $title) {
		$stmt = $this->prepare("UPDATE programmed_alerts
			SET frequency = :frequency, `from` = :from, title = :title
			WHERE id = :id;");
		$stmt->bindValue('id', $id);
		$stmt->bindValue(':frequency', $freq);
		$stmt->bindValue(':from', $from);
		$stmt->bindValue(':title', $title);
		$stmt->execute();
	}

	public function deleteAlert($id) {
		$stmt = $this->prepare('DELETE FROM alerts WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
	}

	public function deleteProgrammedAlert($id) {
		$stmt = $this->prepare('DELETE FROM programmed_alerts WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
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
			case 'stocks':
				$data['name'] = $this->getStockName($data['objectId']);
			break;
		}
		return $data;
	}

	private function getAnimalName($id) {
		$stmt = $this->prepare('SELECT name FROM horses WHERE id = :id');
		$stmt->bindValue('id', $id);
		$res = $stmt->execute();
		$ret = $res->fetchArray(SQLITE3_ASSOC);
		return $ret['name'];
	}

	private function getClientName($id) {
		$stmt = $this->prepare('SELECT firstName, lastName FROM clients WHERE id = :id');
		$stmt->bindValue('id', $id);
		$res = $stmt->execute();
		$ret = $res->fetchArray(SQLITE3_ASSOC);
		return $ret['firstName'].' '.$ret['lastName'];
	}

	private function getStockName($id) {
		$stmt = $this->prepare('SELECT name FROM stocks WHERE id = :id');
		$stmt->bindValue('id', $id);
		$res = $stmt->execute();
		$ret = $res->fetchArray(SQLITE3_ASSOC);
		return $ret['name'];
	}
}
?> 