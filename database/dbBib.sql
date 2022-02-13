
-- Creacion de la base de Dato
CREATE DATABASE bibliotecaweb;
-- Use

use bibliotecaweb;

-- Creacion de tablas

CREATE TABLE libros(
    codigo VARCHAR(13) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    autor VARCHAR(100),
    cantidad INTEGER
);



CREATE TABLE usuarios(
    username VARCHAR(20) PRIMARY KEY
);

CREATE TABLE prestamos(
    username VARCHAR(20),
    FOREIGN KEY (username) REFERENCES usuarios(username),
    codigo_libro VARCHAR(13),
    FOREIGN KEY (codigo_libro) REFERENCES libros(codigo),
    fecha_prestamo DATETIME DEFAULT current_timestamp,
    fecha_devolucion DATETIME DEFAULT (current_timestamp+ interval 30 day)
);


INSERT INTO usuarios VALUE ("Jose");
INSERT INTO usuarios VALUE ("Javier");
INSERT INTO usuarios VALUES ('Sebastian');

INSERT INTO prestamos(username,codigo_libro) Values("Jose",101);
INSERT INTO libro(codigo,titulo,autor,cantidad) VALUES("101","Libro Server","Jose Jaramillo",1);
