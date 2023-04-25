package worker

import (
	"context"
	"time"

	"github.com/remote-job-finder/service/rss"
)

func StartWorker(ctx context.Context, sleep time.Duration) {
	for {
		rss.FetchRss(ctx)
		time.Sleep(1 * sleep)
	}
}
