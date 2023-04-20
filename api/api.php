<?php
/*header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST");
header("content-type: application/json; charset=utf-8");*/

// Allow from any origin
if (isset($_SERVER["HTTP_ORIGIN"])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header("Access-Control-Allow-Credentials: true");
	header("Access-Control-Max-Age: 86400");    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {

	if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_METHOD"])) header("Access-Control-Allow-Methods: POST, OPTIONS");         

	if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"])) header("Access-Control-Allow-Headers:        {$_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]}");

	exit(0);
}


ini_set("display_errors", "1");
ini_set("display_startup_errors", "1");
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"),true);

if(empty($data)){ $data = $_POST; }

foreach( glob("model/*.php") as $file ) {  include_once $file;  }

include "config/connection.php";

$db=new db();

$con=$db->dbConnect();

if(!$con["status"]){echo json_encode($con);}


$error_json=[
	"draw"=>0,
	"recordsTotal"=>0,
	"recordsFiltered"=>0,
	"data"=>[],
	"error"=>"",
	"status"=>false,
	"msg"=>""
];

try{  
	if($data["action"]=="records"){
		$user=new user($con["con"]);
		$dt=new data_table($con["con"],$user->records());
		echo json_encode($dt->read($data));
	}

	if($data["action"]=="save"){
		$user=new user($con["con"]);
		echo json_encode($user->save($data));
	}

	if($data["action"]=="getRecord"){
		$user=new user($con["con"]);
		echo json_encode($user->getRecord($data));
	}

	if($data["action"]=="update"){
		$user=new user($con["con"]);
		echo json_encode($user->update($data));
	}

	if($data["action"]=="delete"){
		$user=new user($con["con"]);
		echo json_encode($user->delete($data));
	}
}
catch(PDOException $e){ 
	$error_json["error"]="Backend error.\nfile: ".basename($e->getFile())."\nline: ".$e->getLine()."\n".$e->getMessage().".";
	$error_json["msg"]="Backend error.\nfile: ".basename($e->getFile())."\nline: ".$e->getLine()."\n".$e->getMessage().".";
	echo json_encode($error_json); 
}

?>