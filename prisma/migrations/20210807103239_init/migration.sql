-- CreateTable
CREATE TABLE "Hint" (
    "hintId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" TEXT NOT NULL,
    "content" TEXT NOT NULL
);
