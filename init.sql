CREATE INDEX "keyword_idx" ON "sentences" USING gin("keywords");
CREATE INDEX fts ON keywords USING gin(tsvector(keyword));
