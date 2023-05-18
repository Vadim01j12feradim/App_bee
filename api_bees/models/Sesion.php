<?php

class Sesion{

    var $id_sesion;
    var $foto;
    var $latitude;
    var $longitud;
    var $descripcion;
    var $name;
    var $id;

    function insertar(){
        include_once("../settings/DBConnect.php");
        $conn = null;
        $stmt=  null;
        $nA = 0;
        $conn = new DBConnect(); // se construye el objeto
        $conexion = $conn->connect(); //el objeto invoca mediante una flecha -> a la funcion connect escrita en DBConnect

        $query="insert into sesion(foto,latitude,longitud,descripcion,id) values('$this->foto','$this->latitude','$this->longitud','$this->descripcion','$this->id') ";
        $stmt = $conexion->prepare($query);
        $nA = $stmt->execute();
       
        return $nA;

    }


    function listarTodos(){
        include_once("../settings/DBConnect.php");
        $conn = null;
        $stmt=  null;
        $conn = new DBConnect(); // se construye el objeto
        $conexion = $conn->connect(); //el objeto invoca mediante una flecha -> a la funcion connect escrita en DBConnect
        $arrCategorias=null;
        $query="SELECT * FROM sesion where id = ".$this->id;
        $stmt = $conexion->prepare($query);
 

        $stmt->execute();
        $i=0;
        while($dato = $stmt->fetch(PDO::FETCH_ASSOC)){
            $cat = new Sesion();
            $cat->id_sesion = $dato["id_sesion"];
            $cat->foto= $dato["foto"];
            $cat->latitude = $dato["latitude"];
            $cat->longitud = $dato["longitud"];
            $cat->descripcion = $dato["descripcion"];
            $arrCategorias[$i] = $cat;
            $i = $i +1;

        }
        return $arrCategorias;
    }

    function login(){
        include_once("../settings/DBConnect.php");
        $conn = null;
        $stmt=  null;
        $conn = new DBConnect(); // se construye el objeto
        $conexion = $conn->connect(); //el objeto invoca mediante una flecha -> a la funcion connect escrita en DBConnect
        $arrCategorias=null;
        $query="SELECT * FROM usuario where usuario='$this->usuario' and pwd='$this->pwd'";
        $stmt = $conexion->prepare($query);
        $stmt->execute();
        $log=false;
        while($dato = $stmt->fetch(PDO::FETCH_ASSOC)){
            $this->id = $dato["id"];
            $this->nombre = $dato["nombre"];
            $this->last_name = $dato["last_name"];
            $this->sur_name = $dato["sur_name"];
            $this->username = $dato["username"];
            $this->pwd = $dato["pwd"];
            $this->tipo = $dato["tipo"];
            $log=true;
            
        }
        return $log;
    }
}

?>