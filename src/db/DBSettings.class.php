<?php

require_once dirname(__FILE__).'/db-config.php';

class DBSettings extends SQLite3 {

	public function __construct() {
		$this->open(dirname(__FILE__).'/'.DB_NAME);
	}

	public function getUser() {
		$stmt = $this->prepare('SELECT * FROM owner_infos');
		$res = $stmt->execute();
		return $res->fetchArray(SQLITE3_ASSOC);
	}

	public function editUser($firstName, $lastName, $address, $zipcode, $city, $phoneFixe, $phoneMobile, $mail, $company, $siret) {
		$stmt = $this->prepare("UPDATE owner_infos
			SET firstName = :firstName, lastName = :lastName, address = :address,
			zipcode = :zipcode, city = :city, phoneFixe = :phoneFixe,
			phoneMobile = :phoneMobile, mail = :mail, companyName = :companyName, siret = :siret;");
		$stmt->bindValue(':firstName', $firstName);
		$stmt->bindValue(':lastName', $lastName);
		$stmt->bindValue(':address', $address);
		$stmt->bindValue(':zipcode', $zipcode);
		$stmt->bindValue(':city', $city);
		$stmt->bindValue(':phoneFixe', $phoneFixe);
		$stmt->bindValue(':phoneMobile', $phoneMobile);
		$stmt->bindValue(':mail', $mail);
		$stmt->bindValue(':companyName', $company);
		$stmt->bindValue(':siret', $siret);
		$stmt->execute();
	}
}
?> 