package rss

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"net/http"
	"strings"
)

func getRssLinks(ctx context.Context) []string {
	var links = []string{
		"l1",
		"l2",
	}
	return links
}

func FetchRss(ctx context.Context) {
	fmt.Println("fetching jobs from rss")

	rssLinks := getRssLinks(ctx)
	ch := make(chan channel)

	for _, link := range rssLinks {
		go func(link string) {
			resp, err := http.Get(link)
			if err != nil {
				fmt.Println("an error occured when fething jobs from:", link)
			}
			defer resp.Body.Close()

			var rss rss
			err = xml.NewDecoder(resp.Body).Decode(&rss)
			if err != nil {
				fmt.Println("rss could not decode")
			}

			jobs := []job{}
			for _, j := range rss.Channel.Jobs {
				jobs = append(jobs, job{
					Title:       j.Title,
					Region:      j.Region,
					Category:    j.Category,
					Type:        j.Type,
					Description: j.Description,
					Media: media{
						Url:  j.Media.Type,
						Type: j.Media.Type,
					},
				})
			}

			rssMap := channel{
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
		jsonBytes, err := json.Marshal(rssMap)
		if err != nil {
			fmt.Println("error occured when marshalling, err:", err)
		}

		desc := strings.Split(rssMap.Description, ": ")[1]
		fmt.Println("saving jobs to redis:", "key:", desc, "value:", jsonBytes)
	}
}
