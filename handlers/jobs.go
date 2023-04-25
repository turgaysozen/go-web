package handlers

import (
	"context"
	"net/http"

	"github.com/remote-job-finder/service/rss"
)

func HomeHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	rss.FetchRss(ctx)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("Jobs"))
}
