package rss

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"net/http"
	"strings"

	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/utils/redis"
)

func getRssLinks(ctx context.Context) []string {
	links, _ := redis.RedisClient.LRange(ctx, "rss_links", 0, -1).Result()
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
			}
			defer resp.Body.Close()

			var rss Rss
			err = xml.NewDecoder(resp.Body).Decode(&rss)
			if err != nil {
				logger.Error.Printf("Rss could not decode for response body: %s", resp.Body)
			}

			jobs := []Job{}
			for _, j := range rss.Channel.Jobs {
				jobs = append(jobs, Job{
					Title:       j.Title,
					Region:      j.Region,
					Category:    j.Category,
					Type:        j.Type,
					Description: j.Description,
					Media: Media{
						Url:  j.Media.Type,
						Type: j.Media.Type,
					},
				})
			}

			rssMap := Channel{
				Title:       rss.Channel.Title,
				Link:        rss.Channel.Link,
				Description: rss.Channel.Description,
				Language:    rss.Channel.Language,
				Ttl:         rss.Channel.Ttl,
				Jobs:        jobs,
			}
			ch <- rssMap
		}(link)
	}

	for i := 0; i < len(rssLinks); i++ {
		rssMap := <-ch
		logger.Info.Printf("total len of %s jobs: %v", strings.Split(rssMap.Description, ": ")[1], len(rssMap.Jobs))
		jsonBytes, err := json.Marshal(rssMap)
		if err != nil {
			logger.Error.Printf("An error occurred when marshalling, err: %s", err)
		}

		desc := strings.Split(rssMap.Description, ": ")[1]
		redis.SaveJobs(ctx, jsonBytes, strings.ToLower(desc))
	}

	close(ch)
}
