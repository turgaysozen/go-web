package worker

import (
	"context"
	"time"

	"github.com/remote-job-finder/service/rss"
	"github.com/remote-job-finder/utils/db"
	"github.com/remote-job-finder/utils/logger"
)

func StartWorker(ctx context.Context, db *db.Database, sleep time.Duration) {
	logger.Info.Printf("Worker started to fetch jobs")
	for {
		rss.FetchRss(ctx, db)
		time.Sleep(1 * sleep)
	}
}
