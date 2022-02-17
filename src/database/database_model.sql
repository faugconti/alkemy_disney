CREATE DATABASE IF NOT EXISTS DISNEY;
-- use `Disney`;

CREATE TABLE IF NOT EXISTS `DISNEY`.`users` (
    `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email`         VARCHAR(60) NOT NULL UNIQUE,
    `password`      VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS `DISNEY`.`genres`(
    `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `description`   VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS `DISNEY`.`characters`(
    `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(60) NOT NULL,
    `image`         VARCHAR(350) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
    `age`           SMALLINT NOT NULL,
    `weight`        FLOAT NOT NULL DEFAULT 20,
    `history`       TEXT 
);

CREATE TABLE IF NOT EXISTS `DISNEY`.`media`(
    `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title`         VARCHAR(60) NOT NULL UNIQUE,
    `image`         VARCHAR(350) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
    `created`       DATE NOT NULL,
    `rating`        TINYINT UNSIGNED DEFAULT 1,
    `type`          ENUM('SHOW','MOVIE') NOT NULL,
    `genreId_FK`    INT NOT NULL,
    CONSTRAINT      FOREIGN KEY (genreId_FK) REFERENCES `DISNEY`.`genres`(`id`)
);


CREATE TABLE IF NOT EXISTS `DISNEY`.`appearances`(
    `mediaId_FK`    INT NOT NULL,
    `charId_FK`     INT NOT NULL,
    PRIMARY KEY(`mediaId_FK`,`charId_FK`),
    CONSTRAINT      FOREIGN KEY (mediaId_FK) REFERENCES `DISNEY`.`media`(`id`),
    CONSTRAINT      FOREIGN KEY (charId_FK) REFERENCES `DISNEY`.`characters`(`id`)
);
