-- Player table creation
CREATE TABLE Player
(
   email CHAR(50) PRIMARY KEY,
   username CHAR(20) NOT NULL,
   picture CHAR(255) NOT NULL,
   password CHAR(30) NOT NULL
);

-- Game table creation
CREATE TABLE Game
(
   accessKey CHAR(20) PRIMARY KEY,
   ranking CHAR(90) NOT NULL,
   date DATE NOT NULL
);

-- Achievement table creation
CREATE TABLE Achievement
(
   title CHAR(30) PRIMARY KEY,
   description CHAR(60) NOT NULL
);

-- Obtains table creation
CREATE TABLE Obtains
(
   obtained BOOLEAN NOT NULL,
   Achievements_title CHAR(30),
   Players_email CHAR(50),
   PRIMARY KEY (Achievements_title, Players_email),
   FOREIGN KEY (Achievements_title) REFERENCES Achievement(title),
   FOREIGN KEY (Players_email) REFERENCES Player(email)
);

-- Compound table creation
CREATE TABLE Compound
(
   Players_email CHAR(50),
   Games_accessKey CHAR(20),
   PRIMARY KEY (Players_email, Games_accessKey),
   FOREIGN KEY (Players_email) REFERENCES Player(email),
   FOREIGN KEY (Games_accessKey) REFERENCES Game(accessKey)
);

-- Friend table creation
CREATE TABLE Friend
(
   Player_email1 CHAR(50),
   Player_email2 CHAR(50),
   PRIMARY KEY (Player_email1, Player_email2),
   FOREIGN KEY (Player_email1) REFERENCES Player(email),
   FOREIGN KEY (Player_email2) REFERENCES Player(email)
);
