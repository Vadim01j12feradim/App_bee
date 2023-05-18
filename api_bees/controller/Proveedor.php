<?php 

 

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);
 
if(!empty($data["OPC"])){

    //Agregar Proveedor
    if($data["OPC"] == 1){
        include_once("../Models/Proveedor.php");
        $pro = new Proveedor();

        $pro->Nombre = $data["txtNombre"];
        $pro->Telefono = $data["txtTelefono"];
        $pro->Correo = $data["txtCorreo"];
        $pro->Empresa = $data["txtEmpresa"];
        $resultado = $pro->insertar();
        echo json_encode($resultado);

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