package rss

type Rss struct {
	Channel Channel `xml:"channel"`
}

type Channel struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	Language    string `xml:"language"`
	Ttl         int    `xml:"ttl"`
	Jobs        []Job  `xml:"item"`
}

type Job struct {
	Title       string `xml:"title"`
	Region      string `xml:"region"`
	Category    string `xml:"category"`
	Type        string `xml:"type"`
	Description string `xml:"description"`
	Media       Media  `xml:"media"`
	Image       string
}

type Media struct {
	Url  string `xml:"url,attr"`
	Type string `xml:"type,attr"`
}
