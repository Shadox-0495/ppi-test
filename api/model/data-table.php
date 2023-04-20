<?php
class data_table{
	private $con;
	private $sql;
	public function __construct($dbCon,$sql){$this->con = $dbCon;$this->sql=$sql;}
	public function read($data){

		$json_data=[
			"draw"=> !isset($data["type"]) ? $data["draw"] : 0,
			"recordsTotal"=>0,
			"recordsFiltered"=>0,
			"data"=>[]
		];

		try{
			$groupBy="";
			$sql=$this->sql;
			if(strpos($sql,"<GROUP BY>")!==false){
				$tempSQL=$sql; //create a copy of the sql
				$tempSQL=explode("<GROUP BY>",$tempSQL); //get the first part of the sql, before the GROUP BY
				$sql=$tempSQL[0]; //asign the first part to the sql
				$tempSQL=explode("</GROUP BY>",$tempSQL[1]); //split the second part into the GROUP BY statement and the remaining.
				$groupBy=$tempSQL[0]; //asign the GROUP BY to a temporal variable for later use
				$sql.=" {$tempSQL[1]}"; //add the remaining string, if any, to the sql
			}
			$query=null;
			$totalFiltered=$totalRows=0;
			if(isset($data["type"]) && $data["type"]=="select2"){
				$search=isset($data["search"]) && !empty($data["search"]) ? " AND {$data["column"]} LIKE '%{$data["search"]}%'" : "";
				$start = ($data["page"] - 1) * $data["limit"];
				$limit="LIMIT {$start},{$data["limit"]}";
				
				$json_data=["results"=>[],"total_count"=>0];

				$sql=explode("FROM",$sql)[1];
				$sql.=(strpos($sql,"WHERE")!==false?"":" WHERE 1 ");
				$sql="SELECT DISTINCT {$data["column"]} AS id,{$data["column"]} AS text FROM {$sql} AND {$data["column"]} IS NOT NULL {$search} {$limit}";

				$query=$this->con->prepare($sql);
				$query->execute();
				$json_data["results"]=array_merge($json_data["results"],$query->fetchAll(PDO::FETCH_ASSOC));
				$json_data["more"]=$query->rowCount()<$data["limit"] ? false : true;
				return $json_data;   
			}


			if($data["draw"]==1){
				$query=$this->con->prepare($sql);
				$query->execute();
				$totalRows=$query->rowCount();
				$totalFiltered=$totalRows;
			}
			else{
				$totalRows=$data["totalRecords"];
			}
			
			//adds the WHERE based on the selected filters
			if(isset($data["filters"]) && count($data["filters"])!=0){
				$sql.=(strpos($sql,"WHERE")!==false?"":" WHERE 1")." AND (";
				foreach($data["filters"] as $fieldIndex=>$field){
					if(count($field["values"])==0){
						continue;
					}

					$sql.=($fieldIndex==0?" ":" AND ")."(";
					
					if($field["type"] == "string"){

						$symbol=$field["operation"]!=""?urldecode($field["operation"]):"=";

						if(strpos($symbol,"<<value>>")!==false){
							$op=(strpos($symbol,"not")!==false?"NOT LIKE":"LIKE");
							$symbol=str_replace("<<value>>",$field["values"][0],$symbol);
							$symbol=str_replace("not","",$symbol);
							$sql.="{$field["column"]} {$op} '{$symbol}'";

						}else{
							$sql.="{$field["column"]}{$symbol}'{$field["values"][0]}'";
						}
					}

					if($field["type"] == "id"){
						foreach($field["values"] as $valueIndex=>$value){

							$indexValidation=($valueIndex==0?" ":" OR ");

							$sql.="{$indexValidation} {$field["column"]}='{$value}'";

						}
					}

					if($field["type"] == "date"){
					$start = $field["values"][0];
					$end = $field["values"][1];
						if($start != "" && $end != ""){
						$sql.="{$field["column"]} BETWEEN '{$start}' AND '{$end}'";
						}else{
							$date = $start == "" ? $end : $start;
							if($date!=""){
								$sql.="{$field["column"]}='{$date}'";
							}
						}
					}

					if($field["type"] == "int"){
						$symbol=$field["operation"]!=""?urldecode($field["operation"]):"=";
						$sql.="{$field["column"]}{$symbol}{$field["values"][0]}";
					}

				  $sql.=")";
				}
				$sql.=")";
				if(!isset($data["search"]["value"]) || (isset($data["search"]["value"]) && empty($data["search"]["value"]))){
					$query=$this->con->prepare($sql);
					$query->execute();
					$totalFiltered=$query->rowCount();
				}
			}

			//adds the WHERE based on the search textbox
			if(isset($data["search"]["value"]) && !empty($data["search"]["value"])){
				$sql.=( (isset($data["filters"])?count($data["filters"])==0:true) && strpos($sql,"WHERE")===false?" WHERE 1 ":" ")." AND (";
				foreach($data["columns"] as $index=>$value){
					if($value["name"]==-1){continue;}
					$sql.=($index==0?" ":" OR ").$value["name"]." LIKE '%" . $data["search"]["value"] . "%'";
				}
				$sql.=" )";
				$query=$this->con->prepare($sql);
				$query->execute();
				$totalFiltered=$query->rowCount();
			}

			if($groupBy!=""){
				$sql.=" GROUP BY {$groupBy}";
			}

			//adds the order by if any
			if(isset($data["order"])  && count($data["order"])!=0){
				$sql.=" ORDER BY ";
				foreach($data["order"] as $index=>$column){
					$sql.=($index>0?",":"").$data["columns"][$column["column"]]["name"]." ".$column["dir"]." ";
				}
			}
			
			//adds the limit if any.
			if($data["start"]!=-1 && $data["length"]!=-1){
				$sql.=" LIMIT {$data["start"]},{$data["length"]}";
			}
			
			$query=$this->con->prepare($sql);
			$query->execute();
			if($data["totalRecords"]!=0 && empty($data["search"]["value"]) && (isset($data["filters"])?count($data["filters"])==0:true)){
				$totalFiltered=$data["totalRecords"];
			}
			$json_data["data"]=[];

			foreach($query->fetchAll(PDO::FETCH_NUM) as $row){
				$json_data["data"][]=$row;
			}

			$con=null;
			$json_data["draw"]=$data["draw"];
			$json_data["recordsTotal"]=$totalRows;
			$json_data["recordsFiltered"]=$totalFiltered;
		}
		catch(PDOException $e){
			$json_data["error"]="Error in the query.\nfile: ".basename($e->getFile())."\nline: ".$e->getLine()."\n".$e->getMessage().".";
		}

		return $json_data;
	}
}
?>