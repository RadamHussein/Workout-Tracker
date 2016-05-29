-- Below are the 4 entity tables -- 

DROP TABLE IF EXISTS `users`;

-- Create the users table
CREATE TABLE `users` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL, 
	PRIMARY KEY (`id`), 
	UNIQUE KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=0;

-- populate users table
INSERT INTO `users` (first_name, last_name, user_name, password) VALUES ('Jon', 'Snow', 'Jsnow1@gmail.com', 'winterfell2'), ('Ned', 'Stark', 'N.StarkLord@yahoo.com', 'lordStark1'), ('Jaime', 'Lanister', 'kingslayer@icloud.com', 'kingslayer01');

DROP TABLE IF EXISTS `workouts`;

-- Create the workouts table
CREATE TABLE `workouts` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0;

-- populate workouts table
INSERT INTO `workouts` (name) VALUES ('Buns of Steel'), ('Sword Fighting Shoulders'), ('Legs'), ('Arms');

DROP TABLE IF EXISTS `exercises`;

-- Create the exercises table
CREATE TABLE `exercises` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255),
	`date` date,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0;

-- populate exercises table
INSERT INTO `exercises` (name, date) VALUES ('Squats', '2015-12-01'), ('Lunges', '2015-12-01'), ('Dead Lift', '2015-12-01'), ('Leg Press', '2015-12-01'), ('Shoulder Press', '2016-02-04'), ('Dumbbell Lateral Raise', '2016-02-04'), ('Front Dumbbell Raise', '2016-02-04'), ('Upright Barbell Row', '2016-02-04'), ('Preacher Curl', '2016-03-15'), ('Barbell Curl', '2016-03-15'), ('Lying Tricep Extension', '2016-03-05'), ('V-Bar Pushdown', '2016-03-15');

DROP TABLE IF EXISTS `exercise_log`;

CREATE TABLE `workouts_log`(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`user_id` int(11) NOT NULL DEFAULT '0',
	`workout_id` int(11) NOT NULL DEFAULT '0',
	`exercise_id` int(11) NOT NULL DEFAULT '0',
	`weight` DECIMAL(4,1),
	`reps` int(11),
	`date` DATE,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
	FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=0;

/*data for Jaime Lanister*/
INSERT INTO `workouts_log` (user_id, workout_id, exercise_id, weight, reps, date) VALUES (3, 4, 1, 45, 10, '2016-03-05'), (3, 4, 1, 45, 9, '2016-03-05'), (3, 4, 1, 45, 9, '2016-03-05'), (3, 4, 1, 45, 7, '2016-03-05'), (3, 4, 2, 90, 6, '2016-03-05'), (3, 4, 2, 90, 6, '2016-03-05'), (3, 4, 2, 90, 6, '2016-03-05'), (3, 4, 2, 90, 6, '2016-03-05'), (3, 4, 3, 50, 10, '2016-03-05'), (3, 4, 3, 50, 10, '2016-03-05'), (3, 4, 3, 50, 10, '2016-03-05'), (3, 4, 4, 60, 10, '2016-03-05'), (3, 4, 4, 60, 10, '2016-03-05'), (3, 4, 4, 60, 10, '2016-03-05'), (3, 4, 5, 50, 12, '2016-03-05'), (3, 4, 5, 50, 12, '2016-03-05'), (3, 4, 5, 50, 12, '2016-03-05'), (3, 4, 6, 40, 10, '2016-03-05'), (3, 4, 6, 40, 10, '2016-03-05'), (3, 4, 6, 40, 10, '2016-03-05');

/*data for Jon Snow*/
INSERT INTO `workouts_log` (user_id, workout_id, exercise_id, weight, reps, date) VALUES (1, 2, 11, 60, 10, '2016-01-01'), (1, 2, 11, 60, 10, '2016-01-01'), (1, 2, 11, 60, 10, '2016-01-01'), (1, 2, 11, 60, 8, '2016-01-01'), (1, 2, 13, 30, 12, '2016-01-01'), (1, 2, 13, 30, 12, '2016-01-01'), (1, 2, 13, 30, 12, '2016-01-01'), (1, 2, 12, 20, 12, '2016-01-01'), (1, 2, 12, 20, 12, '2016-01-01'), (1, 2, 12, 20, 12, '2016-01-01'), (1, 2, 14, 80, 10, '2016-01-01'), (1, 2, 14, 80, 10, '2016-01-01'), (1, 2, 14, 80, 10, '2016-01-01'), (1, 2, 15, 60, 12, '2016-01-01'), (1, 2, 15, 60, 12, '2016-01-01'), (1, 2, 15, 60, 12, '2016-01-01');

/*data for Aria Stark*/
INSERT INTO `workouts_log` (user_id, workout_id, exercise_id, weight, reps, date) VALUES (4, 4, 6, 10, 10, '2016-02-04'), (4, 4, 6, 10, 10, '2016-02-04'), (4, 4, 6, 10, 9, '2016-02-04'), (4, 4, 6, 10, 8, '2016-02-04'), (4, 4, 5, 20, 12, '2016-02-04'), (4, 4, 5, 20, 12, '2016-02-04'), (4, 4, 5, 20, 12, '2016-02-04'), (4, 4, 1, 10, 12, '2016-02-04'), (4, 4, 1, 10, 12, '2016-02-04'), (4, 4, 1, 10, 12, '2016-02-04'), (4, 4, 1, 10, 10, '2016-02-04'), (4, 4, 3, 15, 10, '2016-02-04'), (4, 4, 3, 15, 10, '2016-02-04'), (4, 4, 3, 15, 10, '2016-02-04'), (4, 4, 3, 15, 10, '2016-02-04');

DROP TABLE IF EXISTS `sets`;

-- Create the sets table
CREATE TABLE `sets`(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`weight` int,
	`reps` int,
	PRIMARY KEY (`id`),
	UNIQUE KEY `set_index` (`weight`, `reps`)
) ENGINE=InnoDB AUTO_INCREMENT=0;

-- populate sets table
INSERT INTO `sets` (weight, reps) VALUES (150,8), (150,7), (150,6), (25,15), (125,10), (125,9), (250,8), (250,7), (250,6), (45,10), (15,12), (20,20), (60,12), (60,11), (60,10), (60,9), (50,12), (50,11), (50,10), (45,12);

-- Below are the 3 tables representing the many to many relationships between the entities
DROP TABLE IF EXISTS `user_workouts`;

-- many to many relationship between users and workouts
CREATE TABLE `user_workouts`(
	`uid` int(11) NOT NULL DEFAULT '0',
	`wid` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`uid`, `wid`),
	KEY `wid` (`wid`),
	CONSTRAINT `user_workouts_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT `user_workouts_ibfk_2` FOREIGN KEY (`wid`) REFERENCES `workouts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;



		FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCASE,
	FOREIGN KEY (`wid`) REFERENCES `workouts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE

-- populate user_workouts table
INSERT INTO `user_workouts` VALUES (1,2), (2,1), (3,4), (4,4);

DROP TABLE IF EXISTS `workouts_exercises`;

-- many to many relationship between workouts and exercises
CREATE TABLE `workouts_exercises`(
	`wid` int(11) NOT NULL DEFAULT '0',
	`eid` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`wid`, `eid`),
	KEY `wid` (`wid`),
	FOREIGN KEY (`wid`) REFERENCES `workouts` (`id`),
	FOREIGN KEY (`eid`) REFERENCES `exercises` (`id`)
) ENGINE=InnoDB;

-- populate workouts_exercises table
INSERT INTO `workouts_exercises` VALUES (1,1), (1,2), (1,3), (1,4), (2,5), (2,6), (2,7), (2,8), (4,9), (4,10), (4,11), (4,12);

DROP TABLE IF EXISTS `exercise_sets`;

-- many to many relationship between exercises and sets
CREATE TABLE `exercise_sets`(
	`eid` int(11) NOT NULL DEFAULT '0',
	`sid` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`eid`, `sid`),
	KEY `eid` (`eid`),
	FOREIGN KEY (`eid`) REFERENCES `exercises` (`id`),
	FOREIGN KEY (`sid`) REFERENCES `sets` (`id`)
) ENGINE=InnoDB;

-- populate exercise_sets table
INSERT INTO `exercise_sets` VALUES (1,1), (1,2), (1,3), (1,4), (2,5), (2,6), (2,7), (2,8), (3,9), (3,10), (3,11), (3,12), (4,13), (4,14), (4,15), (4,16), (5,17), (5,18), (5,19), (5,20), (6,21), (6,22), (6,23), (6,24), (7,25), (7,26), (7,27), (8,28), (8,29), (8,30), (9,31), (9,32), (9,33), (9,34), (10,35), (10,36), (10,37), (10,38), (11,39), (11,40), (11,41), (11,42), (12,43), (12,44), (12,45);

CREATE TABLE `workouts_exercises`(
	`wid` int(11) NOT NULL DEFAULT '0',
	`eid` int(11) NOT NULL DEFAULT '0',
	`uid` int(11),
	PRIMARY KEY (`wid`, `eid`, `uid`),
	KEY `wid` (`wid`),
	FOREIGN KEY (`wid`) REFERENCES `workouts` (`id`),
	FOREIGN KEY (`eid`) REFERENCES `exercises` (`id`),
	FOREIGN KEY (`uid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

INSERT INTO `workouts_exercises` VALUES (4,1,3), (4,2,3), (4,3,3), (4,4,3), (4,5,3), (4,6,3), (4,1,4), (4,2,4), (4,5,4), (4,6,4);

CREATE TABLE `exercises`(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255),
	PRIMARY Key (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=0;

INSERT INTO `exercises` (name) VALUES ('Dumbbell Curls'), ('Preacher Curls'), ('Hammer Curls'), ('Skull Crusher'), ('V-Bar Pushdown'), ('Tricep Extension'), ('Squats'), ('Lunges'), ('Dead Lift'), ('Leg Press'), ('Shoulder Press'), ('Lateral Raise'), ('Front Dumbbell Raise'), ('Upright Row');