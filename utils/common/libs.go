package common

import (
	"regexp"
	"strings"
)

func CreateJobTitleSlug(title string) string {
	slug := strings.ToLower(strings.TrimSpace(title))

	reg := regexp.MustCompile(`[^\w\s-]`)
	slug = reg.ReplaceAllString(slug, "")

	reg = regexp.MustCompile(`[-\s]+`)
	slug = reg.ReplaceAllString(slug, "-")

	return slug
}
