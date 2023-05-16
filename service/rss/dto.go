package rss

type Rss struct {
	Channel Channel `xml:"channel"`
}

type Channel struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	Language    string `xml:"language"`
	Jobs        []Job  `xml:"item"`
}

type Job struct {
	Title       string `xml:"title"`
	Region      string `xml:"region"`
	Category    string `xml:"category"`
	Type        string `xml:"type"`
	Description string `xml:"description"`
	Company     Company
	ApplyUrl    string
	Salary      string
	Date        string `xml:"pubDate"`
	Applicants  int64
}

type Company struct {
	Name        string
	Headquarter string
	Url         string
	Logo        string
}
