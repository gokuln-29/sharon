-- CreateTable
CREATE TABLE "OPRegister" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sno" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "patientName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "preAssessment" TEXT NOT NULL,
    "postAssessment" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "typeOfVisit" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
