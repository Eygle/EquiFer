<?php

require_once dirname(__FILE__).'/db-config.php';

class DBSettings extends SQLite3 {

	function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	function __destruct() {
		$this->close();
	}

	public function getCompany() {
		$stmt = $this->prepare('SELECT * FROM company');
		$res = $stmt->execute();
		return $res->fetchArray(SQLITE3_ASSOC);
	}

	public function getSecurity() {
		$stmt = $this->prepare('SELECT * FROM commons_infos');
		$res = $stmt->execute();
		return $this->formatSecurityData($res->fetchArray(SQLITE3_ASSOC));
	}

	private function formatSecurityData($data) {
		$ret = array();
		$ret['active'] = $data['autoSaveActive'] == 1;
		$ret['frequency'] = $data['autoSaveFrequency'];
		$ret['from'] = $data['autoSaveFrom'];
		$ret['lastCheck'] = $data['lastAutoSaveCheck'];
		return $ret;
	}

	public function editCompany($name, $address, $zipcode, $city, $phoneFixe, $phoneMobile, $mail, $siret, $capital, $tvaIntracom) {
		$stmt = $this->prepare("UPDATE company
			SET name = :name, address = :address,
			zipcode = :zipcode, city = :city, phoneFixe = :phoneFixe,
			phoneMobile = :phoneMobile, mail = :mail, siret = :siret,
			capital = :capital, tvaIntracom = :tvaIntracom;");
		$stmt->bindValue(':name', $name);
		$stmt->bindValue(':address', $address);
		$stmt->bindValue(':zipcode', $zipcode);
		$stmt->bindValue(':city', $city);
		$stmt->bindValue(':phoneFixe', $phoneFixe);
		$stmt->bindValue(':phoneMobile', $phoneMobile);
		$stmt->bindValue(':mail', $mail);
		$stmt->bindValue(':siret', $siret);
		$stmt->bindValue(':capital', $capital);
		$stmt->bindValue(':tvaIntracom', $tvaIntracom);
		$stmt->execute();
	}

	public function editSecurity($active, $frequency, $from) {
		$stmt = $this->prepare('UPDATE commons_infos SET autoSaveActive = :active, autoSaveFrequency = :frequency, autoSaveFrom = :from');
		$stmt->bindValue('active', $active);
		$stmt->bindValue('frequency', $frequency);
		$stmt->bindValue('from', $from);
		$stmt->execute();
	}

	public function checkSecurityAutoSave() {
		$security = $this->getSecurity();
		if ($security['active'] == 0) return;
		if ($security['lastCheck'] >= Utils::todayFirstHour()) return;
		switch ($security['frequency']) {
			case 'daily':
				$this->addAutoSave();
				return true;
			break;
			case 'weekly':
				if (date('w') == $security['from']) {
					$this->addAutoSave();
					return true;
				}
			break;
			case 'monthly':
				if (date('j') == $security['from']) {
					$this->addAutoSave();
					return true;
				}
			break;
		}
		return false;
	}

	private function addAutoSave() {
		$stmt = $this->prepare('UPDATE commons_infos SET lastAutoSaveCheck = :now');
		$stmt->bindValue('now', time());
		$stmt->execute();

		$stmt = $this->prepare('INSERT INTO history(date, category, action, level, object, object2)
			VALUES(:date, :category, :action, :level, :object, :object2);');
		$stmt->bindValue(':date', time());
		$stmt->bindValue(':category', "settings");
		$stmt->bindValue(':action', "auto_save");
		$stmt->bindValue(':level', 1);
		$stmt->bindValue(':object', "");
		$stmt->bindValue(':object2', null);
		$stmt->execute();

		$id = $this->lastInsertRowID();

		$stmt = $this->prepare('INSERT INTO link_job_history(job, historyId) VALUES(:job, :historyId);');
		$stmt->bindValue(':job', 'FARRIERY');
		$stmt->bindValue(':historyId', $id);
		$stmt->execute();

		$stmt = $this->prepare('INSERT INTO link_job_history(job, historyId) VALUES(:job, :historyId);');
		$stmt->bindValue(':job', 'PENSION');
		$stmt->bindValue(':historyId', $id);
		$stmt->execute();
	}
}
?> 