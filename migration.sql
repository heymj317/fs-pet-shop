DROP TABLE IF EXISTS pets;


CREATE TABLE pets (
id serial, 
name text,
kind text,
age integer
);


DELETE FROM pets *;
INSERT INTO pets (age, kind, name) VALUES ('7','rainbow','fido');
INSERT INTO pets (age, kind, name) VALUES ('9','cat', 'Rosey');
INSERT INTO pets (age, kind, name) VALUES ('3', 'banana', 'ymca');
INSERT INTO pets (age, kind, name) VALUES ('3', 'apple', 'worm');
INSERT INTO pets (age, kind, name) VALUES ('3', 'mouse', 'tat');
INSERT INTO pets (age, kind, name) VALUES ('3', 'rock', 'glam');

