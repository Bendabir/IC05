<?php 
	include(__DIR__ . "config.php");

	if(isset($_GET["login"])){
		$login = $_GET["login"];

		// $UVsQuery = $connection->prepare("SELECT c.codeUV
		// 									FROM Cursus_Clean_2_Without_Master c
		// 									INNER JOIN UV_Clean_2_Without_Master u
		// 									ON c.codeUV = u.codeUV
		// 									WHERE c.loginEtudiant = :login
		// 									AND u.categorieUV IN ("CS", "TM");");

		$UVsQuery = $connection->prepare("SELECT codeUV, GX
											FROM Cursus 
											WHERE loginEtudiant = :login;");

		$UVsQuery->execute(array(
			':login' => trim($login)
		));

		$UVs = array();

		foreach($UVsQuery->fetchAll() as $UV)
			array_push($UVs, array(
				"uv" => $UV["codeUV"],
				"semestre" => $UV["GX"]
			));

		echo json_encode($UVs);
	}

?>
