package rss

type RssDTO struct {
	Channel ChannelDTO `xml:"channel"`
}

type ChannelDTO struct {
	Title       string   `xml:"title"`
	Link        string   `xml:"link"`
	Description string   `xml:"description"`
	Language    string   `xml:"language"`
	Jobs        []JobDTO `xml:"item"`
}

type JobDTO struct {
	Title       string `xml:"title"`
	Region      string `xml:"region"`
	Category    string `xml:"category"`
	Type        string `xml:"type"`
	Description string `xml:"description"`
	Company     CompanyDTO
	ApplyUrl    string
	Salary      string
	Date        string `xml:"pubDate"`
	Applicants  int
}

type CompanyDTO struct {
	Name        string
	Headquarter string
	Url         string
	Logo        string
}

type JobSummaryDTO struct {
	CategoryName string
	CategoryID   uint
	Jobs         []JobsFieldsDTO
}

type JobsFieldsDTO struct {
	ID                                         uint
	Title, Company, Type, Location, Date, Logo string
}

type JobsSummaryDTO struct {
	Title, Company, Type, Location, Date, Logo, Category string
}
