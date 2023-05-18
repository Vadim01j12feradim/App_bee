<?php 

 

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);
 
if(!empty($data["OPC"])){

    //Agregar Usuario
    if($data["OPC"] == 2){
        include_once("../models/Usuario.php");
        $usu = new Usuario();
        $usu->username = $data["txtUsername"];
        $usu->pwd = $data["txtPwd"];
        echo json_encode($usu->login());

    }else if($data["OPC"] == 1){
        include_once("../models/Usuario.php");
        $usu = new Usuario();
        $usu->username = $data["txtUsername"];
        $usu->pwd = $data["txtPwd"];
        $usu->last_name = $data["txtLastName"];
        $usu->sur_name = $data["txtSurName"];
        $usu->name = $data["txtName"];
        echo json_encode($usu->insertar());

    }
}

if(isset($_GET["LST"])){

    //Listar proveedores
    if($_GET["LST"] == 1){
        include_once("../Models/Proveedor.php");
        $cat = new Proveedor();
         
        $resultado = $cat->listarTodos();
        echo json_encode($resultado);

    }
}

?>