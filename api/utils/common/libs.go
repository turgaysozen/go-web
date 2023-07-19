package common

import (
	"math/rand"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/remote-job-finder/api/utils/logger"
)

func CreateJobTitleSlug(title string) string {
	slug := strings.ToLower(strings.TrimSpace(title))

	reg := regexp.MustCompile(`[^\w\s-]`)
	slug = reg.ReplaceAllString(slug, "")

	reg = regexp.MustCompile(`[-\s]+`)
	slug = reg.ReplaceAllString(slug, "-")

	return slug
}

func ParseDescription(description string) map[string]string {
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

func AdjustPubDate(dateStr string) string {
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
		adjustedDate := currentDate.Add(-randomDuration).Add(time.Duration(rand.Int63n(int64(time.Millisecond))))
		adjustedDateStr := adjustedDate.Format(layout)

		return adjustedDateStr
	}
	return date.Format(layout)
}
