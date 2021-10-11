DROP TABLE IF EXISTS MenuItem;

CREATE TABLE MenuItem (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Price REAL
);

INSERT INTO MenuItem (Name, Price) VALUES
    ('pizza', 1.0),
    ('birra', 2.0),
    ('faso', 3.0);
