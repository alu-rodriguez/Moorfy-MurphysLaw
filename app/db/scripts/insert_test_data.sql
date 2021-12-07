INSERT INTO User (FirstName, LastName, Password, Email, IsAdmin)
VALUES ('Barbara', 'Liskov', 'password', 'admin@fakedomain.com', 0),
       ('Alan', 'Turing', '1234', 'customer@fakedomain.com', 1),
       ('Doctor', 'Who', 'WeepingAngel42', 'doctor@tardis.com', 1);

INSERT INTO Branch (
                       Id,
                       Name,
                       Latitude,
                       Longitude,
                       NumberOfTables,
                       Email,
                       PhoneNumber,
                       LogoUrl,
                       MenuUrl,
                       Mode,
                       OwnerId
                   )
                   VALUES (
                       '1',
                       'El Purgatorio',
                       '-34.57719276132299',
                       '-58.436270758373',
                       '20',
                       'elurgatorio@fakedomain.com',
                       '666',
                       'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/129/410/themes/common/logo-1294076529-1584549165-18c075192e17f85709ca7b0f5505d42f1584549165-480-0.png',
                       'https://elpurgatorio.mitiendanube.com/productos/',
                       'IN_PLACE',
                       1
                   );

INSERT INTO Branch (
                       Id,
                       Name,
                       Latitude,
                       Longitude,
                       NumberOfTables,
                       Email,
                       PhoneNumber,
                       LogoUrl,
                       MenuUrl,
                       Mode,
                       OwnerId
                   )
                   VALUES (
                       '2',
                       'Sacro',
                       '-34.57841497546917',
                       '-58.439221728721066',
                       '15',
                       'sacro@fakedomain.com',
                       '777',
                       'https://www.sacro.com.ar/images/sacro-logo.png',
                       'https://eatit.com.ar/scan?=5fcb7915a7c4482bb5a9c1c5',
                       'PICK_UP',
                       2
                   );

INSERT INTO Branch (
                       Id,
                       Name,
                       Latitude,
                       Longitude,
                       NumberOfTables,
                       Email,
                       PhoneNumber,
                       LogoUrl,
                       MenuUrl,
                       Mode,
                       OwnerId
                   )
                   VALUES (
                       '3',
                       'Prueba',
                       '-34.23443523',
                       '-58.23144324',
                       '1',
                       'prueba@test.com',
                       '000',
                       'https://www.blabla.com.ar/logo.png',
                       'https://www.blabla.com.ar/menu.pdf',
                       'PICK_UP',
                       1
                   );
