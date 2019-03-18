-- Initializes database and tables.
-- To run: `cat initialize-database.sql | mysql -u root -p`

DROP DATABASE IF EXISTS euphoria;

DROP USER IF EXISTS 'euphoria'@'localhost';

CREATE DATABASE euphoria;

USE euphoria;

SET GLOBAL time_zone = '+0:00';

CREATE USER 'euphoria'@'localhost' IDENTIFIED WITH mysql_native_password BY 'euphoria';

GRANT ALL PRIVILEGES ON euphoria.* TO 'euphoria'@'localhost';

-- educationLevel is one of: "NOHIGHSCHOOL",
--                           "HIGHSCHOOL",
--                           "GED",
--                           "SOMECOLLEGE",
--                           "ASSOCIATES",
--                           "BACHELORS",
--                           "MASTERS",
--                           "PHD",
--                           "MD",
--                           "JD"
CREATE TABLE users (userId INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(40) NOT NULL,
                    email VARCHAR (40) NOT NULL,
                    phoneNumber VARCHAR(20) NOT NULL,
                    educationLevel VARCHAR(20) NOT NULL,
                    description TEXT NOT NULL,
                    dateCreated DATETIME NOT NULL); 

CREATE TABLE companies (companyId INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(40) NOT NULL,
                        website VARCHAR (40) NOT NULL,
                        description TEXT NOT NULL,
                        dateCreated DATETIME NOT NULL);

-- location is one of "NEWYORK",
--                    "LONDON",
--                    "HONGKONG",
--                    "BERLIN",
--                    "BEIJING",
--                    "WASHINGTON"
-- industry is one of "EDUCATION",
--                    "ENERGY",
--                    "FINANCE",
--                    "FOOD",
--                    "HEALTHCARE",
--                    "INSURANCE",
--                    "MEDIA",
--                    "RETAIL",
--                    "SERVICES",
--                    "TECHNOLOGY",
--                    "TRANSPORT",
--                    "UTILITIES"
-- skillLevel is one of "INTERNSHIP",
--                      "ENTRYLEVEL",
--                      "ASSOCIATE",
--                      "SENIOR",
--                      "DIRECTOR",
--                      "EXECUTIVE"
CREATE TABLE postings (postingId INT AUTO_INCREMENT PRIMARY KEY,
                       companyId INT NOT NULL,  -- FOREIGN KEY(companyId) REFERENCES companies (companyId),
                       jobTitle VARCHAR (30) NOT NULL,
                       description TEXT NOT NULL,
                       location VARCHAR(20) NOT NULL,
                       industry VARCHAR(20) NOT NULL,
                       skillLevel VARCHAR(20) NOT NULL,
                       dateCreated DATETIME NOT NULL);

INSERT INTO postings
    (companyId, jobTitle, description, location, industry, skillLevel, dateCreated)
VALUES
    (123, 'Underwater Basket Weaver', 'Must lift.', 'WASHINGTON', 'SERVICES', 'INTERNSHIP', "2018-07-10 02:30:00"),
    (456, 'Frontend Developer', 'Must know everything about React.js.', 'NEWYORK', 'TECHNOLOGY', 'EXECUTIVE', "2019-02-12 12:00:00"),
    (789, 'Backend Developer', 'Must know nothing about React.js.', 'NEWYORK', 'TECHNOLOGY', 'INTERNSHIP', "2019-03-16 23:59:59");

CREATE TABLE applications (applicationId INT AUTO_INCREMENT PRIMARY KEY,
                           postingId INT NOT NULL,  -- FOREIGN KEY(postingId), REFERENCES postings (postingId),
                           userId INT NOT NULL, -- FOREIGN KEY(userId), REFERENCES users (userID), 
                           resume TEXT NOT NULL,
                           coverLetter TEXT NOT NULL);

CREATE TABLE authentication (username VARCHAR(30) NOT NULL,
                             passwordHash VARCHAR(40) NOT NULL,
                             isUser BOOLEAN NOT NULL);
