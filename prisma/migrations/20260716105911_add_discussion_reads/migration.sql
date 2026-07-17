-- CreateTable
CREATE TABLE "DiscussionRead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discussionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DiscussionRead_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DiscussionRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DiscussionRead_userId_idx" ON "DiscussionRead"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionRead_discussionId_userId_key" ON "DiscussionRead"("discussionId", "userId");
