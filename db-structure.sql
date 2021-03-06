DROP TABLE "horses";
DROP TABLE "link_job_horses";

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
CREATE INDEX "horses_id" ON "horses" ("id");

CREATE TABLE "link_job_horses" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" varchar(8)  NOT NULL,
  "horseId" int(11) NOT NULL
);
CREATE INDEX "link_job_horses_id" ON "link_job_horses" ("id");
CREATE INDEX "link_job_horses_horseId" ON "link_job_horses" ("horseId");
CREATE INDEX "link_job_horses_job" ON "link_job_horses" ("job");




DROP TABLE "clients";
DROP TABLE "link_job_clients";
DROP TABLE "link_clients_horses";

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
CREATE INDEX "clients_id" ON "clients" ("id");

CREATE TABLE "link_job_clients" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" varchar(8)  NOT NULL,
  "clientId" int(11) NOT NULL
);
CREATE INDEX "link_job_clients_id" ON "link_job_clients" ("id");
CREATE INDEX "link_job_clients_clientId" ON "link_job_clients" ("clientId");
CREATE INDEX "link_job_clients_job" ON "link_job_clients" ("job");

CREATE TABLE "link_clients_horses" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "clientId" int(11) NOT NULL,
  "horseId" int(11) NOT NULL
);
CREATE INDEX "link_clients_horses_id" ON "link_clients_horses" ("id");
CREATE INDEX "link_clients_horses_horseId" ON "link_clients_horses" ("horseId");
CREATE INDEX "link_clients_horses_clientId" ON "link_clients_horses" ("clientId");
CREATE INDEX "link_clients_horses_clientId_horseId" ON "link_clients_horses" ("clientId","horseId");




DROP TABLE "performances";
DROP TABLE "link_job_performances";
DROP TABLE "link_horses_performances";

CREATE TABLE "performances" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" varchar(256) NOT NULL,
  "priceHT" float NOT NULL,
  "priceTTC" float NOT NULL,
  "tva" float NOT NULL,
  "unit" varchar(64) NOT NULL,
  "defaultQuantity" int NOT NULL
);
CREATE INDEX "performances_id" ON "performances" ("id");

CREATE TABLE "link_job_performances" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" varchar(8) NOT NULL,
  "performanceId" int(11) NOT NULL
);
CREATE INDEX "link_job_performances_id" ON "link_job_performances" ("id");
CREATE INDEX "link_job_performances_performanceId" ON "link_job_performances" ("performanceId");
CREATE INDEX "link_job_performances_job" ON "link_job_performances" ("job");

CREATE TABLE "link_horses_performances" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "date" date NOT NULL,
  "horseId" int(11) NOT NULL,
  "performanceId" int(11) NOT NULL,
  "quantity" int(11) NOT NULL
);
CREATE INDEX "link_horses_performances_id" ON "link_horses_performances" ("id");
CREATE INDEX "link_horses_performances_horseId" ON "link_horses_performances" ("horseId");
CREATE INDEX "link_horses_performances_performanceId" ON "link_horses_performances" ("performanceId");
CREATE INDEX "link_horses_performances_horseId_performanceId" ON "link_horses_performances" ("horseId","performanceId");




DROP TABLE "bills";
DROP TABLE "link_job_bills";
DROP TABLE "link_bills_clients";

CREATE TABLE "bills" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "date" date NOT NULL,
  "clientId" int(11) NOT NULL,
  "total" float NOT NULL,
  "taxFree" float NOT NULL,
  "file" varchar(256) NOT NULL
);
CREATE INDEX "bills_id" ON "bills" ("id");

CREATE TABLE "link_job_bills" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" varchar(8) NOT NULL,
  "billId" int(11) NOT NULL  
);
CREATE INDEX "link_job_bills_id" ON "link_job_bills" ("id");
CREATE INDEX "link_job_bills_billId" ON "link_job_bills" ("billId");
CREATE INDEX "link_job_bills_job" ON "link_job_bills" ("job");

CREATE TABLE "link_bills_clients" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "billId" int(11) NOT NULL,
  "clientId" int(11) NOT NULL
);
CREATE INDEX "link_bills_clients_id" ON "link_bills_clients" ("id");
CREATE INDEX "link_bills_clients_billId" ON "link_bills_clients" ("billId");
CREATE INDEX "link_bills_clients_clientId" ON "link_bills_clients" ("clientId");
CREATE INDEX "link_bills_clients_billId_clientId" ON "link_bills_clients" ("billId","clientId");




DROP TABLE "stocks";
DROP TABLE "link_job_stocks";

CREATE TABLE "stocks" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" varchar(256),
  "quantity" int(11) NOT NULL,
  "quantityAlert" int(11) NOT NULL,
  "unity" varchar(30)
);
CREATE INDEX "stocks_id" ON "stocks" ("id");

CREATE TABLE "link_job_stocks" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" varchar(8) NOT NULL,
  "stockId" int(11) NOT NULL  
);
CREATE INDEX "link_job_stocks_id" ON "link_job_stocks" ("id");
CREATE INDEX "link_job_stocks_billId" ON "link_job_stocks" ("stockId");
CREATE INDEX "link_job_stocks_job" ON "link_job_stocks" ("job");




DROP TABLE "programmed_alerts";
CREATE TABLE "programmed_alerts"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "frequency" varchar(15) NOT NULL,
  "from" varchar(10) NOT NULL,
  "category" varchar(32) NOT NULL,
  "objectId" int(11) NOT NULL,
  "title" varchar(256) NOT NULL
);
CREATE INDEX "programmed_alerts_id" ON "programmed_alerts" ("id");
CREATE INDEX "programmed_alerts_cat_objId" ON "programmed_alerts" ("category", "objectId");




DROP TABLE "alerts";
CREATE TABLE "alerts"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "date" int(11) NOT NULL,
  "category" varchar(32) NOT NULL,
  "objectId" int(11) NOT NULL,
  "title" varchar(256) NOT NULL
);
CREATE INDEX "alerts_id" ON "alerts" ("id");




DROP TABLE "history";
DROP TABLE "link_job_history";

CREATE TABLE history(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "category" varchar(64) NOT NULL,
  "action" varchar(64) NOT NULL,
  "level" int(1) NOT NULL,
  "object" varchar(256) NOT NULL,
  "object2" varchar(256) NULL,
  "date" date NOT NULL
);
CREATE INDEX "history_id" ON "history" ("id");

CREATE TABLE "link_job_history" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "job" varchar(8) NOT NULL,
  "historyId" int(11) NOT NULL
);
CREATE INDEX "link_job_history_id" ON "link_job_history" ("id");
CREATE INDEX "link_job_history_historyId" ON "link_job_history" ("historyId");
CREATE INDEX "link_job_history_job" ON "link_job_history" ("job");




DROP TABLE "company";

CREATE TABLE "company" (
  "name" varchar(256) NOT NULL,
  "address" varchar(512) NOT NULL,
  "zipcode" int(11) NOT NULL,
  "city" varchar(256) NOT NULL,
  "phoneFixe" varchar(16),
  "phoneMobile" varchar(16),
  "mail" varchar(256) NOT NULL,
  "siret" varchar(256),
  "capital" varchar(32),
  "tvaIntracom" varchar(32)
);
INSERT INTO company VALUES("Nom de l'entreprise", "Adresse", 00000, "Ville", "0200000000", "0600000000", "mail@example.com", "SIRET", "50007", "FR8280341435");





DROP TABLE "commons_infos";

CREATE TABLE "commons_infos" (
  "billNumber" int(11) NOT NULL,
  "lastAlertsCheck" int(11) NOT NULL,
  "autoSaveActive" int(1) NOT NULL,
  "autoSaveFrequency" varchar(15) NULL,
  "autoSaveFrom" varchar(10) NULL,
  "lastAutoSaveCheck" int(11) NOT NULL
);
INSERT INTO commons_infos VALUES(1, 0, 0, NULL, NULL, 0);