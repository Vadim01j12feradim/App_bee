CREATE DATABASE bee_app;
USE DATABASE bee_app;


CREATE TABLE metodo_grabacion (
                id_metodo INT AUTO_INCREMENT NOT NULL,
                tipo VARCHAR(250) NOT NULL,
                PRIMARY KEY (id_metodo)
);


CREATE TABLE cuestionario (
                id INT AUTO_INCREMENT NOT NULL,
                pregunta VARCHAR(50) NOT NULL,
                PRIMARY KEY (id)
);


CREATE TABLE usuario (
                id INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(250),
                last_name VARCHAR(250),
                sur_name VARCHAR(250),
                username VARCHAR(250) NOT NULL,
                pwd VARCHAR(250) NOT NULL,
                tipo VARCHAR(250) NOT NULL,
                PRIMARY KEY (id)
);


CREATE TABLE sesion (
                id_sesion INT AUTO_INCREMENT NOT NULL,
                foto VARCHAR(500) NOT NULL,
                latitude VARCHAR(50) NOT NULL,
                longitud VARCHAR(50) NOT NULL,
                descripcion VARCHAR(250) NOT NULL,
                id INT NOT NULL,
                PRIMARY KEY (id_sesion)
);


CREATE TABLE toma (
                id_toma INT AUTO_INCREMENT NOT NULL,
                id_sesion INT NOT NULL,
                audio VARCHAR(300) NOT NULL,
                fecha DATETIME NOT NULL,
                id_metodo INT NOT NULL,
                PRIMARY KEY (id_toma)
);


CREATE TABLE respuesta (
                id_respuesta INT AUTO_INCREMENT NOT NULL,
                id INT NOT NULL,
                respuesta VARCHAR(250) NOT NULL,
                id_sesion INT NOT NULL,
                PRIMARY KEY (id_respuesta)
);


ALTER TABLE toma ADD CONSTRAINT metodo_grabacion_toma_fk
FOREIGN KEY (id_metodo)
REFERENCES metodo_grabacion (id_metodo)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE respuesta ADD CONSTRAINT cuestionario_respuesta_fk
FOREIGN KEY (id)
REFERENCES cuestionario (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE sesion ADD CONSTRAINT usuario_sesion_fk
FOREIGN KEY (id)
REFERENCES usuario (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE respuesta ADD CONSTRAINT sesion_respuesta_fk
FOREIGN KEY (id_sesion)
REFERENCES sesion (id_sesion)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE toma ADD CONSTRAINT sesion_toma_fk
FOREIGN KEY (id_sesion)
REFERENCES sesion (id_sesion)
ON DELETE NO ACTION
ON UPDATE NO ACTION;