-- CreateTable
CREATE TABLE "GitHubIntegration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "githubUsername" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GitHubIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GitHubIntegration_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GitHubIntegration_orgId_idx" ON "GitHubIntegration"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubIntegration_userId_orgId_key" ON "GitHubIntegration"("userId", "orgId");
