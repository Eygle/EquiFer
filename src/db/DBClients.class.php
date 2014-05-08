<?php

class DBClients extends SQLite3 {

	public function __construct() {
		$this->open(dirname(__FILE__).'/database.sqlite');
	}

	public function getList($job) {
		$stmt = $this->prepare('SELECT c.*
			FROM link_job_clients AS ljc
			LEFT JOIN clients AS c ON ljc.clientId = c.id
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
		$stmt = $this->prepare('SELECT * FROM clients WHERE id = :id');
		$stmt->bindValue(':id', $id);
		$res = $stmt->execute();
		return $this->formatInfos($res->fetchArray(SQLITE3_ASSOC));
	}

	private function getJobsLinks($id) {
		$stmt = $this->prepare('SELECT * FROM link_job_clients WHERE clientId = :id');
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

	private function formatInfos($client) {
		$client['name'] = $client['firstName']." ".$client['lastName'];
		// Get horses
		$horses = array();
		$stmt = $this->prepare('SELECT h.name
			FROM link_clients_horses AS lch
			LEFT JOIN horses AS h ON lch.horseId = h.id
			WHERE lch.clientId = :id');
		$stmt->bindValue("id", $client['id']);
		$res = $stmt->execute();
		while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
			$horses[] = $row['name'];
		}
		$client['animals'] = implode(' ', $horses);
		$client['animalsList'] = $horses;
		$client = array_merge($client, $this->getJobsLinks($client['id']));
		return $client;
	}

	public function add($firstName, $lastName, $address, $zipcode, $city, $phoneFixe, $phoneMobile, $mail) {
		$stmt = $this->prepare("INSERT INTO clients(firstName, lastName, address, zipcode, city, phoneFixe, phoneMobile, mail)
			VALUES(:firstName, :lastName, :address, :zipcode, :city, :phoneFixe, :phoneMobile, :mail);");
		$stmt->bindValue(':firstName', $firstName);
		$stmt->bindValue(':lastName', $lastName);
		$stmt->bindValue(':address', $address);
		$stmt->bindValue(':zipcode', $zipcode);
		$stmt->bindValue(':city', $city);
		$stmt->bindValue(':phoneFixe', $phoneFixe);
		$stmt->bindValue(':phoneMobile', $phoneMobile);
		$stmt->bindValue(':mail', $mail);
		$stmt->execute();

		return $this->lastInsertRowID();
	}

	public function edit($id, $firstName, $lastName, $address, $zipcode, $city, $phoneFixe, $phoneMobile, $mail) {
		$stmt = $this->prepare("UPDATE clients
			SET firstName = :firstName, lastName = :lastName, address = :address,
			zipcode = :zipcode, city = :city, phoneFixe = :phoneFixe,
			phoneMobile = :phoneMobile, mail = :mail
			WHERE id = :id;");
		$stmt->bindValue('id', $id);
		$stmt->bindValue(':firstName', $firstName);
		$stmt->bindValue(':lastName', $lastName);
		$stmt->bindValue(':address', $address);
		$stmt->bindValue(':zipcode', $zipcode);
		$stmt->bindValue(':city', $city);
		$stmt->bindValue(':phoneFixe', $phoneFixe);
		$stmt->bindValue(':phoneMobile', $phoneMobile);
		$stmt->bindValue(':mail', $mail);
		$stmt->execute();
		$this->deleteLinksToJob($id);
	}

	public function delete($id) {
		$stmt = $this->prepare('DELETE FROM clients WHERE id = :id');
		$stmt->bindValue('id', $id);
		$stmt->execute();
		$this->deleteLinksToJob($id);
		$this->deleteLinksToHorses($id);
	}

	private function deleteLinksToJob($id) {
		$stmt = $this->prepare('DELETE FROM link_job_clients WHERE clientId = :clientId;');
		$stmt->bindValue(':clientId', $id);
		$stmt->execute();
	}

	private function deleteLinksToHorses($id) {
		$stmt = $this->prepare('DELETE FROM link_clients_horses WHERE clientId = :clientId;');
		$stmt->bindValue(':clientId', $id);
		$stmt->execute();
	}

	public function linkToJob($job, $id) {
		$stmt = $this->prepare('INSERT INTO link_job_clients(job, clientId) VALUES(:job, :clientId);');
		$stmt->bindValue(':job', $job);
		$stmt->bindValue(':clientId', $id);
		$stmt->execute();
	}
}
?> 