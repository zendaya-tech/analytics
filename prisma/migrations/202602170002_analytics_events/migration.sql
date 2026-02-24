-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "source" TEXT,
    "country" TEXT,
    "referrer" TEXT,
    "visitorId" TEXT,
    "sessionId" TEXT,
    "durationMs" INTEGER,
    "scrollPercent" INTEGER,
    "bounced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_siteId_createdAt_idx" ON "AnalyticsEvent"("siteId", "createdAt");
CREATE INDEX "AnalyticsEvent_workspaceId_createdAt_idx" ON "AnalyticsEvent"("workspaceId", "createdAt");
CREATE INDEX "AnalyticsEvent_siteId_path_idx" ON "AnalyticsEvent"("siteId", "path");
CREATE INDEX "AnalyticsEvent_siteId_country_idx" ON "AnalyticsEvent"("siteId", "country");
CREATE INDEX "AnalyticsEvent_siteId_source_idx" ON "AnalyticsEvent"("siteId", "source");
CREATE INDEX "AnalyticsEvent_siteId_eventName_idx" ON "AnalyticsEvent"("siteId", "eventName");

-- AddForeignKey
ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_siteId_fkey"
FOREIGN KEY ("siteId") REFERENCES "Site"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
