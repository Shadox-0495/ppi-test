<?php
class db{
    private $Server="SERVER_IP";
    private $User="MYSQL_USER";
    private $Pass="MYSQL_USER_PASSWORD";
    private $DB="MYSQL_DB";

    public function __construct(){}
    public function dbConnect(){
        $val=["status"=>false,"con"=>null,"msg"=>""];
        try{
            $val["status"] = true;
            $val["con"]=new PDO("mysql:host=$this->Server;dbname=$this->DB",$this->User,$this->Pass,[ PDO::ATTR_TIMEOUT=>30 ,PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION ]);
        } 
        catch (PDOException $e) {
            $val["msg"]='DB connection error: ' . $e->getMessage();
        }
        return $val;
    }
}
?>