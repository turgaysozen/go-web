package handlers

import (
	"bytes"
	"context"
	"net/http"

	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/utils/redis"
)

func HomeHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	keys, _ := redis.RedisClient.LRange(ctx, "categories", 0, -1).Result()
	logger.Info.Println(
		"Key fetched from redis and jobs are fething from the cache,",
		"keys:", keys,
	)
	var jobBytes [][]byte
	for _, key := range keys {
		jobs, _ := redis.GetJobs(ctx, key)
		jobBytes = append(jobBytes, jobs)
	}

	jsonBytes := bytes.Join(jobBytes, []byte("."))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
}
