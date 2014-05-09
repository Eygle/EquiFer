CREATE TABLE "horses" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" varchar(256) NOT NULL,
  "gender" text  NOT NULL,
  "type" varchar(256) NOT NULL,
  "race" varchar(256) NOT NULL,
  "puce" varchar(128) NULL,
  "birthdate" date NULL,
  "size" int(11) NULL,
  "colour" varchar(256) NULL,
  "desc" text NULL,
  "isAlive" tinyint(1) NOT NULL,
  "headMark" varchar(256) NULL,
  "footMark" varchar(256) NULL
);

CREATE TABLE "clients" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "firstName" varchar(256) NOT NULL,
  "lastName" varchar(256) NOT NULL,
  "address" varchar(512) NOT NULL,
  "zipcode" int(11) NOT NULL,
  "city" varchar(256) NOT NULL,
  "phoneFixe" varchar(16) NULL,
  "phoneMobile" varchar(16) NULL,
  "mail" varchar(512) NULL
);

CREATE TABLE "link_clients_horses" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "clientId" int(11) NOT NULL,
  "horseId" int(11) NOT NULL,
  CONSTRAINT "link_clients_horses_ibfk_1" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "link_clients_horses_ibfk_2" FOREIGN KEY ("horseId") REFERENCES "horses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "link_job_clients" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" text  NOT NULL,
  "clientId" int(11) NOT NULL,
  CONSTRAINT "link_job_clients_ibfk_1" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "link_job_horses" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" text  NOT NULL,
  "horseId" int(11) NOT NULL,
  CONSTRAINT "link_job_horses_ibfk_1" FOREIGN KEY ("horseId") REFERENCES "horses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "performances" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" varchar(256) NOT NULL,
  "price" float NOT NULL,
  "tva" float NOT NULL,
  "unit" varchar(64) NOT NULL,
  "defaultQuantity" int NOT NULL
);

CREATE TABLE "link_job_performances" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" text  NOT NULL,
  "performanceId" int(11) NOT NULL,
  CONSTRAINT "link_job_performances_ibfk_1" FOREIGN KEY ("performanceId") REFERENCES "performances" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "link_performances_clients" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "clientId" int(11) NOT NULL,
  "performanceId" int(11) NOT NULL,
  "quantity" int(11) NOT NULL,
  CONSTRAINT "link_performances_clients_client_ibfk_1" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "link_performances_clients_performance_ibfk_1" FOREIGN KEY ("performanceId") REFERENCES "performances" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "owner_infos" (
  "firstName" varchar(256) NOT NULL,
  "lastName" varchar(256) NOT NULL,
  "address" varchar(512) NOT NULL,
  "zipcode" int(11) NOT NULL,
  "city" varchar(256) NOT NULL,
  "phoneFixe" varchar(16),
  "phoneMobile" varchar(16),
  "mail" varchar(256) NOT NULL,
  "siret" varchar(256),
  "companyName" varchar(256) NOT NULL
);

INSERT INTO owner_infos VALUES("Prénom", "Nom", "Adresse", 00000, "Ville", "0200000000", "0600000000", "mail@example.com", "SIRET", "Nom de l'entreprise");

CREATE INDEX "horses_id" ON "horses" ("id");
CREATE INDEX "clients_id" ON "clients" ("id");
CREATE INDEX "performances_id" ON "performances" ("id");

CREATE INDEX "link_job_horses_id" ON "link_job_horses" ("id");
CREATE INDEX "link_job_horses_horseId" ON "link_job_horses" ("horseId");
CREATE INDEX "link_job_horses_job" ON "link_job_horses" ("job");

CREATE INDEX "link_job_clients_id" ON "link_job_clients" ("id");
CREATE INDEX "link_job_clients_clientId" ON "link_job_clients" ("clientId");
CREATE INDEX "link_job_clients_job" ON "link_job_clients" ("job");

CREATE INDEX "link_job_performances_id" ON "link_job_performances" ("id");
CREATE INDEX "link_job_performances_performanceId" ON "link_job_performances" ("performanceId");
CREATE INDEX "link_job_performances_job" ON "link_job_performances" ("job");

CREATE INDEX "link_clients_horses_id" ON "link_clients_horses" ("id");
CREATE INDEX "link_clients_horses_clientId_horseId" ON "link_clients_horses" ("clientId","horseId");
CREATE INDEX "link_clients_horses_horseId" ON "link_clients_horses" ("horseId");
CREATE INDEX "link_clients_horses_clientId" ON "link_clients_horses" ("clientId");

CREATE INDEX "link_performances_clients_id" ON "CREATE INDEX " ("id");
CREATE INDEX "link_performances_clients_clientId" ON "CREATE INDEX " ("clientId");
CREATE INDEX "link_performances_clients_performanceId" ON "CREATE INDEX " ("performanceId");
