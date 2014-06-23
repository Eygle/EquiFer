<?php

class Utils {

	public static $SECONDS_IN_A_DAY = 86400;

	public static function formatDate($time) {
		$yest = time() - self::$SECONDS_IN_A_DAY;
		$timeD	= date('d', $time);
		$timeM	= date('m', $time);
		$timeY	= date('Y', $time);
		if (date('d') == $timeD && date('m') == $timeM && date('Y') == $timeY)
			return "Ajourd'hui";
		else if (date('d', $yest) == $timeD && date('m', $yest) == $timeM && date('Y', $yest) == $timeY)
			return 'Hier';
		else
			return $timeD.'/'.$timeM.'/'.$timeY;
	}

	public static function todayFirstHour() {
		return mktime(0, 0, 0, date("n"), date("j"), date("Y"));
	}
	
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