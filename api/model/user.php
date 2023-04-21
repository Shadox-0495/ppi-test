<?php
class user{
    private $con;
    private $resp=["status"=>false,"msg"=>""];

    public function __construct($dbCon){
        $this->con = $dbCon;
    }

    public function records(){
        $sql="SELECT t1.id,t1.firstName,t1.lastName,t1.email,t1.phone,t1.zip,t1.dateCreated,t1.dateModified FROM user t1";
        return $sql;
    }

    public function save($data){
        try{
            $this->con->beginTransaction();

            $sql="INSERT INTO user (firstName,lastName,email,phone,zip,dateCreated) VALUES (:firstName,:lastName,:email,:phone,:zip,CURDATE())";
            $query=$this->con->prepare($sql);
            $query->execute([
                ":firstName"=>$data["firstName"]
                ,":lastName"=>$data["lastName"]
                ,":email"=>$data["email"]
                ,":phone"=>$data["phone"]
                ,":zip"=>$data["zip"]
            ]);

            $this->con->commit();
            $this->resp["status"]=true;
            $this->resp["msg"]="User created";
        }
        catch(PDOException $e){
            $this->con->rollBack();
			$this->resp["msg"]="Error in the query.\nfile: ".basename($e->getFile())."\nline: ".$e->getLine()."\n".$e->getMessage().".";
		}
        return $this->resp;
    }

    public function getRecord($data){
        $sql="SELECT t1.id,t1.firstName,t1.lastName,t1.email,t1.phone,t1.zip FROM user t1 WHERE t1.ID=:ID";
        $query=$this->con->prepare($sql);
        $query->execute([":ID" => $data["recordID"]]);
        $this->resp["status"]=true;
        $this->resp["msg"]=$query->fetch(PDO::FETCH_ASSOC);
        return $this->resp;
    }

    public function update($data){
        try{
            $this->con->beginTransaction();

            $sql="UPDATE user SET firstName=:firstName,lastName=:lastName,email=:email,phone=:phone,zip=:zip,dateModified=CURDATE() WHERE ID=:recordID";
            $query=$this->con->prepare($sql);
            $query->execute([
                ":recordID"=>$data["recordID"]
                ,":firstName"=>$data["firstName"]
                ,":lastName"=>$data["lastName"]
                ,":email"=>$data["email"]
                ,":phone"=>$data["phone"]
                ,":zip"=>$data["zip"]
            ]);

            $this->con->commit();
            $this->resp["status"]=true;
            $this->resp["msg"]="User updated";
        }
        catch(PDOException $e){
            $this->con->rollBack();
			$this->resp["msg"]="Error in the query.\nfile: ".basename($e->getFile())."\nline: ".$e->getLine()."\n".$e->getMessage().".";
		}
        return $this->resp;
    }

    public function delete($data){
        try{
            $this->con->beginTransaction();
            $sql="DELETE FROM user WHERE ID=:ID";
            $query=$this->con->prepare($sql);
            $query->execute([":ID" => $data["recordID"]]);
            $this->con->commit();
            $this->resp["status"]=true;
            $this->resp["msg"]="User deleated";
        }
        catch(PDOException $e){
            $this->con->rollBack();
            $this->resp["msg"]="Error in the query.\nfile: ".basename($e->getFile())."\nline: ".$e->getLine()."\n".$e->getMessage().".";
        }
        return $this->resp;
    }
}
?>