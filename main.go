package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"github.com/remote-job-finder/handlers"
	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/worker"
)

func main() {
	ctx := context.Background()

	go func() {
		worker.StartWorker(ctx, time.Hour) // fetch jobs every an hour in backround
	}()

	r := mux.NewRouter()
	r.HandleFunc("/jobs", func(w http.ResponseWriter, r *http.Request) {
		handlers.HomeHandler(ctx, w, r)
	}).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	})

	handler := c.Handler(r)
	logger.Info.Printf("Server is starting on: 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
