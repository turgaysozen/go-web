package rss

import (
	"context"
	"encoding/xml"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/remote-job-finder/api/utils/common"
	"github.com/remote-job-finder/api/utils/db"
	"github.com/remote-job-finder/api/utils/logger"
)

func FetchRss(ctx context.Context, database *db.Database) {
	rssLinks, err := database.GetAllSourceByType("RSS")
	if err != nil {
		logger.Info.Println("An error occurred while getting rssLinks, err:", err)
	}

	// delete all active jobs before saving new ones.
	database.DeleteAllJobs()

	jobChan := make(chan db.Job)
	wg := sync.WaitGroup{}

	for _, rssL := range *rssLinks {
		wg.Add(1)

		go func(link string, rssL db.Source) {
			logger.Info.Println("Jobs are fetching from RSS for link:", link)
			defer wg.Done()

			resp, err := http.Get(link)
			if err != nil {
				logger.Error.Printf("An error occurred when fetching jobs from: %s, err: %s", link, err)
				return
			}
			defer resp.Body.Close()

			var rss RssDTO
			err = xml.NewDecoder(resp.Body).Decode(&rss)
			if err != nil {
				logger.Error.Printf("Rss could not decode for response body: %s", resp.Body)
				return
			}

			categoryName := strings.Split(rss.Channel.Title, ": ")[1]
			foundCategory, err := database.GetCategoryByName(categoryName)

			if err != nil {
				logger.Info.Println("Category could not found for title:", rss.Channel.Title)
			}

			category := db.Category{}
			if foundCategory == nil {
				category = db.Category{
					Name:        categoryName,
					Link:        rss.Channel.Link,
					Description: rss.Channel.Description,
					Language:    rss.Channel.Language,
					IsDeleted:   false,
				}

				database.CreateCategory(&category)
				if err == nil {
					logger.Info.Println("New category created, company:", &category)
				}
			} else {
				category = *foundCategory
			}

			for _, j := range rss.Channel.Jobs {
				parsedDesc := common.ParseDescription(j.Description)

				splits := strings.Split(j.Title, ":")
				companyName := splits[0]
				foundCompany, err := database.GetCompanyByName(companyName)
				if err != nil {
					logger.Info.Println("Company could not found by company name:", companyName)
				}

				company := db.Company{}
				if foundCompany == nil {
					company = db.Company{
						Name:        companyName,
						Headquarter: parsedDesc["headquarter"],
						WebSite:     parsedDesc["url"],
						Logo:        parsedDesc["logo"],
						IsDeleted:   false,
					}

					err := database.CreateCompany(&company)
					if err == nil {
						logger.Info.Println("New company created, company:", &company)
					}
				} else {
					company = *foundCompany
				}

				job := db.Job{
					Title:       splits[1],
					Slug:        fmt.Sprint(common.CreateJobTitleSlug(splits[0]), "-", common.CreateJobTitleSlug(splits[1])),
					Region:      j.Region,
					Type:        j.Type,
					PubDate:     common.AdjustPubDate(j.Date),
					Description: parsedDesc["description"],
					ApplyUrl:    parsedDesc["applyUrl"],
					Salary:      parsedDesc["salary"],
					IsDeleted:   false,
					Category:    category,
					Company:     company,
					Source:      rssL,
					Keyword:     findSearchKeywords(j.Description, j.Title, j.Company.Name),
				}
				jobChan <- job
			}
		}(rssL.Url, rssL)
	}

	go func() {
		wg.Wait()
		close(jobChan)
	}()

	// TODO: Try bulk create of jobs
	for job := range jobChan {
		database.CreateJob(&job)
	}
}

func findSearchKeywords(description, title, company string) string {
	keywords := strings.Split(os.Getenv("KEYWORDS"), ", ")

	var matchingKeywords []string
	for _, keyword := range keywords {
		if strings.Contains(strings.ToLower(description), strings.ToLower(keyword)) ||
			strings.Contains(strings.ToLower(title), strings.ToLower(keyword)) ||
			strings.Contains(strings.ToLower(company), strings.ToLower(keyword)) {
			matchingKeywords = append(matchingKeywords, strings.ToLower(keyword))
		}
	}

	return strings.Join(matchingKeywords, ", ")
}
