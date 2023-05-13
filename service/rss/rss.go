package rss

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/remote-job-finder/utils/common"
	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/utils/redis"
)

func getRssLinks(ctx context.Context) []string {
	links, _ := redis.RedisClient.LRange(ctx, common.RssLinksKey, 0, -1).Result()
	logger.Info.Println("Rss links fetched from redis, links:", links)
	return links
}

func FetchRss(ctx context.Context) {
	rssLinks := getRssLinks(ctx)
	logger.Info.Println("Jobs are fetching from RSS for links:", rssLinks)

	ch := make(chan Channel)

	for _, link := range rssLinks {
		go func(link string) {
			resp, err := http.Get(link)
			if err != nil {
				logger.Error.Printf("An error occurred when fething jobs from: %s, err: %s", link, err)
				return
			}
			defer resp.Body.Close()

			var rss Rss
			err = xml.NewDecoder(resp.Body).Decode(&rss)
			if err != nil {
				logger.Error.Printf("Rss could not decode for response body: %s", resp.Body)
				return
			}

			jobs := []Job{}
			for _, j := range rss.Channel.Jobs {
				parsedDesc := parseDescription(j.Description)
				jobs = append(jobs, Job{
					Title:       strings.Split(j.Title, ": ")[1],
					Region:      j.Region,
					Category:    j.Category,
					Type:        j.Type,
					Date:        adjustPubDate(j.Date),
					Description: parsedDesc["description"],
					ApplyUrl:    parsedDesc["applyUrl"],
					Salary:      parsedDesc["salary"],
					Company: Company{
						Name:        strings.Split(j.Title, ":")[0],
						Headquarter: parsedDesc["headquarter"],
						Url:         parsedDesc["url"],
						Logo:        parsedDesc["logo"],
					},
				})
			}

			rssMap := Channel{
				Title:       strings.Split(rss.Channel.Title, ": ")[1],
				Link:        rss.Channel.Link,
				Description: strings.Split(rss.Channel.Description, ": ")[1],
				Language:    rss.Channel.Language,
				Jobs:        jobs,
			}
			ch <- rssMap
		}(link)
	}

	for i := 0; i < len(rssLinks); i++ {
		rssMap := <-ch
		logger.Info.Printf("total len of %s jobs: %v", rssMap.Description, len(rssMap.Jobs))
		jsonBytes, err := json.Marshal(rssMap)
		if err != nil {
			logger.Error.Printf("An error occurred when marshalling, err: %s", err)
			return
		}

		key := strings.ToLower(strings.ReplaceAll(rssMap.Description, " ", "-"))
		key = strings.ReplaceAll(key, ",", "")
		redis.SaveJobs(ctx, jsonBytes, key)
	}

	close(ch)
}

func parseDescription(description string) map[string]string {
	headquarterRegex := regexp.MustCompile("<strong>Headquarters:</strong> ([^<]+)")
	logoRegex := regexp.MustCompile("<img[^>]+src=\"([^\"]+)\"[^>]*>")
	applyLinkRegex := regexp.MustCompile("<strong>To apply:</strong> <a href=\"([^\"]+)\">[^<]*</a>")
	urlRegex := regexp.MustCompile("<strong>URL:</strong> <a href=\"([^\"]+)\">([^<]+)</a>")

	// Extract the information using regular expressions
	headquarter := headquarterRegex.FindStringSubmatch(description)
	logo := logoRegex.FindStringSubmatch(description)
	applyLink := applyLinkRegex.FindStringSubmatch(description)
	url := urlRegex.FindStringSubmatch(description)

	// Create a map to store the extracted information
	data := make(map[string]string)

	if len(headquarter) > 1 {
		data["headquarter"] = strings.TrimSpace(headquarter[1])
		description = headquarterRegex.ReplaceAllString(description, "")
	}

	if len(logo) > 1 {
		logoTag := logoRegex.FindString(description)
		logoUrl := strings.TrimSpace(strings.Split(logo[1], "?")[0])
		description = strings.Replace(description, logoTag, "", 1)
		data["logo"] = logoUrl
	} else {
		data["logo"] = os.Getenv("DEFAULT_IMG_SRC")
	}

	if len(applyLink) > 1 {
		data["applyUrl"] = strings.TrimSpace(applyLink[1])
		description = applyLinkRegex.ReplaceAllString(description, "")
	}

	if len(url) > 1 {
		urlTag := urlRegex.FindString(description)
		url := strings.TrimSpace(url[1])
		description = strings.Replace(description, urlTag, "", 1)
		data["url"] = url
	}

	// Remove unnecessary HTML tags
	description = strings.ReplaceAll(description, "<br />", "")
	description = strings.ReplaceAll(description, "<p>", "")
	description = strings.ReplaceAll(description, "</p>", "")
	description = strings.ReplaceAll(description, "\n", "")

	data["description"] = strings.TrimSpace(description)

	return data
}

func adjustPubDate(dateStr string) string {
	layout := "Mon, 02 Jan 2006 15:04:05 -0700"
	date, err := time.Parse(layout, dateStr)
	if err != nil {
		logger.Error.Println("Error parsing date:", err)
		return ""
	}

	currentDate := time.Now()
	oneWeekAgo := currentDate.AddDate(0, 0, -7)

	if date.Before(oneWeekAgo) {
		// Generate a random duration within the current week
		weekDuration := time.Hour * 24 * 7
		randomDuration := time.Duration(rand.Int63n(int64(weekDuration)))
		adjustedDate := currentDate.Add(-randomDuration)
		adjustedDateStr := adjustedDate.Format(layout)

		return adjustedDateStr
	} else {
		return dateStr
	}
}
