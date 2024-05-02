-- Player table creation
CREATE TABLE Player
(
   email VARCHAR(50) PRIMARY KEY,
   username VARCHAR(20) NOT NULL,
   picture VARCHAR(255) NOT NULL,
   password VARCHAR(30) NOT NULL,
   victories NUMBER(5) NOT NULL
);

-- Game table creation
CREATE TABLE Game
(
   accessKey VARCHAR(20) PRIMARY KEY,
   ranking VARCHAR(90) NOT NULL,
   date DATE NOT NULL
);

-- Achievement table creation
CREATE TABLE Achievement
(
   title VARCHAR(30) PRIMARY KEY,
   description VARCHAR(60) NOT NULL
);

-- Obtains table creation
CREATE TABLE Obtains
(
   obtained BOOLEAN NOT NULL,
   Achievements_title VARCHAR(30),
   Players_email VARCHAR(50),
   PRIMARY KEY (Achievements_title, Players_email),
   FOREIGN KEY (Achievements_title) REFERENCES Achievement(title),
   FOREIGN KEY (Players_email) REFERENCES Player(email)
);

-- Compound table creation
CREATE TABLE Compound
(
   Players_email VARCHAR(50),
   Games_accessKey VARCHAR(20),
   PRIMARY KEY (Players_email, Games_accessKey),
   FOREIGN KEY (Players_email) REFERENCES Player(email),
   FOREIGN KEY (Games_accessKey) REFERENCES Game(accessKey)
);

-- Friend table creation
CREATE TABLE Friend
(
   Player_email1 VARCHAR(50),
   Player_email2 VARCHAR(50),
   PRIMARY KEY (Player_email1, Player_email2),
   FOREIGN KEY (Player_email1) REFERENCES Player(email),
   FOREIGN KEY (Player_email2) REFERENCES Player(email)
);

-- Friend request table
CREATE TABLE Friend_request
(
   Player_from VARCHAR(50),
   Player_to VARCHAR(50),
   PRIMARY KEY (Player_from, Player_to),
   FOREIGN KEY (Player_from) REFERENCES Player(email),
   FOREIGN KEY (Player_to) REFERENCES Player(email)
);

CREATE OR REPLACE FUNCTION check_friend_request() RETURNS TRIGGER AS $$
BEGIN
   IF EXISTS (SELECT 1 FROM Friend WHERE (Player_email1 = NEW.Player_from AND Player_email2 = NEW.Player_to) OR (Player_email2 = NEW.Player_from AND Player_email1 = NEW.Player_to)) THEN
      RAISE EXCEPTION 'Already friends, cannot send friend request.';
   END IF;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER friend_request_trigger BEFORE INSERT ON Friend_request FOR EACH ROW EXECUTE PROCEDURE check_friend_request();
