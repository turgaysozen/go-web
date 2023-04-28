package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/remote-job-finder/service/rss"
	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/utils/redis"
)

func HomeHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	keys, _ := redis.RedisClient.LRange(ctx, "categories", 0, -1).Result()
	logger.Info.Println(
		"Key fetched from redis and jobs are fething from the cache,",
		"keys:", keys,
	)

	var jobs []rss.Channel
	for _, key := range keys {
		jobData, _ := redis.GetJobs(ctx, key)

		var job rss.Channel
		err := json.Unmarshal(jobData, &job)
		if err == nil {
			jobs = append(jobs, job)
		}
	}

	jobsByte, _ := json.Marshal(jobs)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jobsByte)
}
