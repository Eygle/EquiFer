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

	public function editCompany($name, $address, $zipcode, $city, $phoneFixe, $phoneMobile, $mail, $siret) {
		$stmt = $this->prepare("UPDATE company
			SET name = :name, address = :address,
			zipcode = :zipcode, city = :city, phoneFixe = :phoneFixe,
			phoneMobile = :phoneMobile, mail = :mail, siret = :siret;");
		$stmt->bindValue(':name', $name);
		$stmt->bindValue(':address', $address);
		$stmt->bindValue(':zipcode', $zipcode);
		$stmt->bindValue(':city', $city);
		$stmt->bindValue(':phoneFixe', $phoneFixe);
		$stmt->bindValue(':phoneMobile', $phoneMobile);
		$stmt->bindValue(':mail', $mail);
		$stmt->bindValue(':siret', $siret);
		$stmt->execute();
	}
}
?> 