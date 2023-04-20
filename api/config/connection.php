<?php
class db{
    private $Server="192.168.1.15";
    private $User="root";
    private $Pass="root";
    private $DB="ppi";

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