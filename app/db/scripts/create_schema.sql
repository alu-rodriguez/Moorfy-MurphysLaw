DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Branch;
DROP TABLE IF EXISTS "Order";
DROP TABLE IF EXISTS Menu;
DROP TABLE IF EXISTS Photo;
DROP TABLE IF EXISTS OrderStatus;


CREATE TABLE Photo
(
    Id  INTEGER PRIMARY KEY AUTOINCREMENT,
    Url TEXT NOT NULL
);

CREATE TABLE User
(
    Id        INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT        NOT NULL,
    LastName  TEXT        NOT NULL,
    Password  TEXT        NOT NULL,
    Email     TEXT UNIQUE NOT NULL,
    IsAdmin   INTEGER DEFAULT 0 -- 1 equivale a true y 0 a false
);

CREATE TABLE Branch
(
    Id             INTEGER PRIMARY KEY AUTOINCREMENT,
    Latitude       REAL    NOT NULL,
    Longitude      REAL    NOT NULL,
    NumberOfTables INTEGER NOT NULL,
    Email          TEXT    NOT NULL,
    PhoneNumber    INTEGER NOT NULL,
    LogoUrl        TEXT,
    MenuUrl        TEXT,
    Mode           INTEGER -- 0 (pickup) o 1 (in-place)
);

CREATE TABLE OrderStatus
(
    Id          INTEGER PRIMARY KEY,
    Description TEXT UNIQUE NOT NULL
);

CREATE TABLE "Order"
(
    Id          INTEGER PRIMARY KEY AUTOINCREMENT,
    BranchId    INTEGER,
    UserId      INTEGER,
    StatusId    INTEGER DEFAULT 1,
    Content     TEXT    NOT NULL,
    TableNumber INTEGER NOT NULL,
    Timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchId) REFERENCES Branch (Id),
    FOREIGN KEY (UserId) REFERENCES User (Id),
    FOREIGN KEY (StatusId) REFERENCES OrderStatus (Id)
);

INSERT INTO OrderStatus (Id, Description)
VALUES (1, 'Pendiente'),
       (2, 'Aceptado'),
       (3, 'Rechazado'),
       (4, 'En preparación'),
       (5, 'Listo');
