<?php

class Utils {
	public static function checkGetArgs($args) {
		if (!is_array($args)) $args = array($args);
		foreach ($args as $v) {
			if (!isset($_GET[$v]))
				throw new Exception("$v don't exist");
		}
	}

	public static function checkPostArgs($args) {
		if (!is_array($args)) $args = array($args);
		foreach ($args as $v) {
			if (!isset($_POST[$v]))
				throw new Exception("$v don't exist");
		}
	}
}

?>