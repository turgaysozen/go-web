package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"regexp"
	"strings"

	"github.com/remote-job-finder/service/rss"
	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/utils/redis"
)

func JobsHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
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

func JobDetailsHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, slug string) {
	logger.Info.Println("Handling slug:", slug)

	slugArr := strings.Split(slug, "--")
	jobData, _ := redis.GetJobs(ctx, slugArr[0])

	var job rss.Channel
	var jobDetaByte []byte
	err := json.Unmarshal(jobData, &job)
	if err == nil {
		for _, job := range job.Jobs {
			slug := createSlug(job.Title)
			if slug == slugArr[1] {
				logger.Info.Println("Target job found for slug:", slug)
				jobDetaByte, _ = json.Marshal(job)
				break
			}
		}
	}

	if len(jobDetaByte) > 0 {
		w.Header().Set("Content-Type", "application/json")
		w.Write(jobDetaByte)
	} else {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Job not found"))
	}
}

func JobCategoryHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, category string) {
	logger.Info.Println("Getting jobs for category:", category)

	var jobs []rss.Channel
	var job rss.Channel
	jobData, _ := redis.GetJobs(ctx, category)
	err := json.Unmarshal(jobData, &job)
	if err == nil {
		jobs = append(jobs, job) // return as a list not to change client structure
	}

	jobsByte, _ := json.Marshal(jobs)

	w.Header().Set("Content-Type", "application/json")
	w.Write(jobsByte)
}

func createSlug(title string) string {
	slug := strings.ToLower(strings.TrimSpace(title))

	reg := regexp.MustCompile(`[^\w\s-]`)
	slug = reg.ReplaceAllString(slug, "")

	reg = regexp.MustCompile(`[-\s]+`)
	slug = reg.ReplaceAllString(slug, "-")

	return slug
}
