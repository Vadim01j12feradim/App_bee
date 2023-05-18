<?php 

 

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);
$target_dir = "sesionphotos";
$target_file = $target_dir . basename($_FILES["photo"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
// Check if image file is a actual image or fake image

  $check = getimagesize($_FILES["photo"]["tmp_name"]);
  if($check !== false) {
   // echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    //echo "File is not an image.";
    $uploadOk = 0;
  }
  
  if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
    
    
    include_once("../models/Usuario.php");
    include_once("../models/Sesion.php");
    $usuario =new Usuario();
    $sesion= new Sesion();
    $usuario->username=$_POST["username"];
    if($usuario->buscar()){
         $sesion->foto=basename($_FILES["photo"]["name"]);
         $sesion->id = $usuario->id;
         $sesion->name = $_POST["name"];
         $sesion->descripcion = $_POST["observations"];
         echo $sesion->insertar();
    }
   
    
  }
        
?>