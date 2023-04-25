package rss

import "encoding/xml"

type rss struct {
	XMLName xml.Name `xml:"rss"`
	Channel channel  `xml:"channel"`
}

type channel struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	Language    string `xml:"language"`
	Ttl         int    `xml:"ttl"`
	Jobs        []job  `xml:"item"`
}

type job struct {
	Title       string `xml:"title"`
	Region      string `xml:"region"`
	Category    string `xml:"category"`
	Type        string `xml:"type"`
	Description string `xml:"description"`
	Media       media  `xml:"media"`
}

type media struct {
	Url  string `xml:"url,attr"`
	Type string `xml:"type,attr"`
}
