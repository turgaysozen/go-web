package worker

import (
	"context"
	"time"

	"github.com/remote-job-finder/api/service/rss"
	"github.com/remote-job-finder/api/utils/db"
	"github.com/remote-job-finder/api/utils/logger"
)

func StartWorker(ctx context.Context, db *db.Database, sleep time.Duration) {
	logger.Info.Printf("Worker started to fetch jobs")
	for {
		rss.FetchRss(ctx, db)
		time.Sleep(1 * sleep)
	}
}
