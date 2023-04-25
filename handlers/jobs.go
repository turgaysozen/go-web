package handlers

import (
	"context"
	"net/http"
)

func HomeHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("Jobs"))
}
