package handlers

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"

	"github.com/remote-job-finder/service/rss"
	"github.com/remote-job-finder/utils/common"
	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/utils/redis"
)

func JobsHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	keys, _ := redis.RedisClient.LRange(ctx, common.CategoriesKey, 0, -1).Result()
	logger.Info.Println(
		"Key fetched from redis and jobs are fething from the cache,",
		"keys:", keys,
	)

	var jobSummary []rss.JobSummary
	var jobs rss.JobSummary
	for _, key := range keys {
		jobData, _ := redis.GetJobs(ctx, key)

		var job rss.Channel
		err := json.Unmarshal(jobData, &job)

		if err != nil {
			logger.Error.Println("An error occurred while unmarshalling cache data, err:", err)
		} else {
			jobs.Jobs = []rss.JobsFields{}
			for _, j := range job.Jobs {
				jobFields := rss.JobsFields{
					Title:    j.Title,
					Company:  j.Company.Name,
					Type:     j.Type,
					Location: j.Region,
					Date:     j.Date,
					Logo:     j.Company.Logo,
				}

				jobs.Jobs = append(jobs.Jobs, jobFields)
			}
		}
		jobs.Description = job.Description
		jobSummary = append(jobSummary, jobs)
	}

	jobsByte, _ := json.Marshal(jobSummary)
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
				job.Applicants = redis.GetJobApplicantCount(ctx, common.JobApplicantsCountKey, slug)
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

	var jobSummary []rss.JobSummary
	var jobs rss.JobSummary
	var job rss.Channel
	jobData, _ := redis.GetJobs(ctx, category)
	err := json.Unmarshal(jobData, &job)
	if err != nil {
		logger.Error.Println("An error occurred while unmarshalling cache data, err:", err)
	} else if err == nil {
		jobData, _ := redis.GetJobs(ctx, category)

		var job rss.Channel
		_ = json.Unmarshal(jobData, &job)
		jobs.Jobs = []rss.JobsFields{}
		for _, j := range job.Jobs {
			jobFields := rss.JobsFields{
				Title:    j.Title,
				Company:  j.Company.Name,
				Type:     j.Type,
				Location: j.Region,
				Date:     j.Date,
				Logo:     j.Company.Logo,
			}

			jobs.Jobs = append(jobs.Jobs, jobFields)
		}

		jobs.Description = job.Description
		jobSummary = append(jobSummary, jobs)

		jobsByte, _ := json.Marshal(jobSummary)
		w.Header().Set("Content-Type", "application/json")
		w.Write(jobsByte)
	} else if jobData == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Job not found"))
	}
}

func ServeBasicHtml(w http.ResponseWriter, r *http.Request) {
	htmlFile, err := ioutil.ReadFile("./index.html")
	if err != nil {
		logger.Error.Println("Failed to load basic html for listing jobs", http.StatusInternalServerError)
		return
	}

	logger.Info.Println("Serving basic html for listing jobs")

	w.Header().Set("Content-Type", "text/html")
	w.Write(htmlFile)
}

func ApplyToJob(ctx context.Context, w http.ResponseWriter, r *http.Request, fullSlug string) {
	slug := strings.Split(fullSlug, "--")[1]
	err := redis.IncrementJobApplicantCount(ctx, slug)

	if err == nil {
		logger.Info.Println("Applied to the job for slug:", slug)
	}

	JobDetailsHandler(ctx, w, r, fullSlug)

}

func createSlug(title string) string {
	slug := strings.ToLower(strings.TrimSpace(title))

	reg := regexp.MustCompile(`[^\w\s-]`)
	slug = reg.ReplaceAllString(slug, "")

	reg = regexp.MustCompile(`[-\s]+`)
	slug = reg.ReplaceAllString(slug, "-")

	return slug
}
