<?php 

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);
$target_dir = "tomaaudios";
$target_file = $target_dir . basename($_FILES["audio"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
// Check if image file is a actual image or fake image

  $check = getimagesize($_FILES["audio"]["tmp_name"]);
  if($check !== false) {
   // echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    //echo "File is not an image.";
    $uploadOk = 0;
  }
  
  if (move_uploaded_file($_FILES["audio"]["tmp_name"], $target_file)) {
    
    
    include_once("../models/Usuario.php");
    include_once("../models/Toma.php");
    $usuario =new Usuario();
    $toma= new Toma();
    $usuario->username=$_POST["username"];
    if($usuario->buscar()){
         $toma->id_sesion = $_POST["id_sesion"];
         $toma->audio = basename($_FILES["audio"]["name"]);
         $toma->fecha = $_POST["fecha"];
         $toma->id_metodo = $_POST["metodo"];
         echo $toma->insertar();
    }
   
    
  }
        
?>