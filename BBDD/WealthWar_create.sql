--Creación tabla Jugador
CREATE TABLE Jugador
(
   correo CHAR(50) PRIMARY KEY,
   nombreUsuario CHAR(20) NOT NULL,
   contrasenya CHAR(20) NOT NULL
);

--Creación tabla Partida
CREATE TABLE Partida
(
   claveAcceso CHAR(20) PRIMARY KEY,
   ranking CHAR(90) NOT NULL,
   fecha DATE NOT NULL
);

--Creación tabla Logro
CREATE TABLE Logro
(
   titulo CHAR(30) PRIMARY KEY,
   descripcion CHAR(60) NOT NULL
);

--Creación tabla Consigue
CREATE TABLE Consigue
(
   obtenido BOOLEAN NOT NULL,
   Logros_titulo CHAR(30),
   Jugador_correo CHAR(50),
   PRIMARY KEY (Logros_titulo,Jugador_correo),
   FOREIGN KEY (Logros_titulo) REFERENCES Logros(titulo),
   FOREIGN KEY (Jugador_correo) REFERENCES Jugador(correo)
);

--Creación tabla Compuesta
CREATE TABLE Compuesta
(
   Jugador_correo CHAR(50),
   Partida_claveAcceso CHAR(20),
   PRIMARY KEY (Jugador_correo,Partida_claveAcceso),
   FOREIGN KEY (Jugador_correo) REFERENCES Jugador(correo),
   FOREIGN KEY (Partida_claveAcceso) REFERENCES Partida(claveAcceso)
);

--Creación tabla Amigo
CREATE TABLE Amigo
(
   Jugador_correo CHAR(50),
   Jugador_correo CHAR(50),
   PRIMARY KEY (Jugador_correo,Jugador_correo),
   FOREIGN KEY (Jugador_correo) REFERENCES Jugador(correo),
   FOREIGN KEY (Jugador_correo) REFERENCES Jugador(correo)
);