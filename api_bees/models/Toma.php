<?php

class Toma{

    var $id_sesion;
    var $id_toma;
    var $audio;
    var $fecha;
    var $id_metodo;
    function insertar(){
        include_once("../DBConnect.php");
        $conn = null;
        $stmt=  null;
        $nA = 0;
        $conn = new DBConnect(); // se construye el objeto
        $conexion = $conn->connect(); //el objeto invoca mediante una flecha -> a la funcion connect escrita en DBConnect

        $query="insert into toma(id_sesion,audio,fecha,id_metodo) values('$this->id_sesion','$this->audio','$this->fecha','$this->descripcion','$this->id_metodo') ";
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
        $query="SELECT * FROM usuario";
        $stmt = $conexion->prepare($query);
 

        $stmt->execute();
        $i=0;
        while($dato = $stmt->fetch(PDO::FETCH_ASSOC)){
            $cat = new Usuario();
            $cat->id = $dato["id"];
            $cat->nombre = $dato["nombre"];
            $cat->last_name = $dato["last_name"];
            $cat->sur_name = $dato["sur_name"];
            $cat->username = $dato["username"];
            $cat->pwd = $dato["pwd"];
            $cat->tipo = $dato["tipo"];
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