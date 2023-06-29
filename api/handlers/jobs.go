package handlers

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/remote-job-finder/api/service/rss"
	"github.com/remote-job-finder/api/utils/db"
	"github.com/remote-job-finder/api/utils/logger"
)

func JobsHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, database *db.Database) {
	allActiveJobsByCat, err := database.GetAllActiveJobsByCat()
	if err != nil {
		logger.Error.Println("An error occurred while getting all jobs, err:", err)
	}

	var jobs rss.JobSummaryDTO
	var jobSummary []rss.JobSummaryDTO
	for _, cat := range allActiveJobsByCat {
		jobs.Jobs = []rss.JobsFieldsDTO{}
		for _, j := range cat.Jobs {
			jobFields := rss.JobsFieldsDTO{
				ID:       j.ID,
				Title:    j.Title,
				Company:  j.Company.Name,
				Type:     j.Type,
				Location: j.Region,
				Date:     j.PubDate,
				Logo:     j.Company.Logo,
			}
			jobs.Jobs = append(jobs.Jobs, jobFields)
		}
		jobs.CategoryName = cat.Name
		jobs.CategoryID = cat.ID
		jobSummary = append(jobSummary, jobs)
		logger.Info.Println("Retrieving jobs by category name:", cat.Name, ", total:", len(jobs.Jobs))
	}

	jobsByte, _ := json.Marshal(jobSummary)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jobsByte)
}

func JobDetailsHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, slug string, database *db.Database) {
	logger.Info.Println("Getting single job for slug:", slug)

	foundJob, err := database.GetJobBySlug(slug)
	if err != nil {
		logger.Error.Println("An error occurred while getting job by Slug:", slug, "err:", err)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Job not found"))
		return
	}

	job := rss.JobDTO{
		Title:       foundJob.Title,
		Description: foundJob.Description,
		Region:      foundJob.Region,
		Type:        foundJob.Type,
		ApplyUrl:    foundJob.ApplyUrl,
		Salary:      foundJob.Salary,
		Date:        foundJob.PubDate,
		Applicants:  foundJob.Applicant,
		Company: rss.CompanyDTO{
			Name:        foundJob.Company.Name,
			Headquarter: foundJob.Company.Headquarter,
			Url:         foundJob.Company.WebSite,
			Logo:        foundJob.Company.Logo,
		},
	}

	jobByte, err := json.Marshal(job)

	if err != nil {
		logger.Error.Println("An error occurred while marshalling job for job slug:", slug, "err:", err)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Job not found"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jobByte)
}

func JobCategoryHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, categorySlug string, database *db.Database) {
	splits := strings.Split(categorySlug, "--")

	logger.Info.Println("Getting jobs for category:", splits[0], "and cat ID:", splits[1])

	catID, _ := strconv.ParseUint(splits[1], 10, 64)
	jobsByCat, err := database.GetAllJobsByCatID(uint(catID))

	if err != nil {
		logger.Error.Println("An error while getting category by ID:", catID, "err:", err)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Jobs not found by category"))
		return
	}

	var jobs rss.JobSummaryDTO
	var jobSummary []rss.JobSummaryDTO
	jobs.Jobs = []rss.JobsFieldsDTO{}
	for _, j := range jobsByCat {
		jobFields := rss.JobsFieldsDTO{
			ID:       j.ID,
			Title:    j.Title,
			Company:  j.Company.Name,
			Type:     j.Type,
			Location: j.Region,
			Date:     j.PubDate,
			Logo:     j.Company.Logo,
		}
		jobs.Jobs = append(jobs.Jobs, jobFields)
	}

	jobs.CategoryName = jobsByCat[0].Category.Name
	jobSummary = append(jobSummary, jobs)
	jobsByte, err := json.Marshal(jobSummary)

	if err != nil {
		logger.Error.Println("An error while getting category by ID:", catID, "err:", err)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Jobs not found by category"))
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jobsByte)
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

func ApplyToJob(ctx context.Context, w http.ResponseWriter, r *http.Request, fullSlug string, database *db.Database) {
	slug := strings.Split(fullSlug, "--")

	jobID, _ := strconv.ParseUint(slug[1], 10, 64)
	err := database.IncrementApplicant(uint(jobID))
	if err != nil {
		logger.Error.Println("An error occurred while increasing applicant count")
	}

	JobDetailsHandler(ctx, w, r, fullSlug, database)
}
