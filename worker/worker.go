package worker

import (
	"context"
	"time"

	"github.com/remote-job-finder/service/rss"
	"github.com/remote-job-finder/utils/logger"
)

func StartWorker(ctx context.Context, sleep time.Duration) {
	logger.Info.Printf("Worker started to fetch jobs")
	for {
		rss.FetchRss(ctx)
		time.Sleep(1 * sleep)
	}
}
