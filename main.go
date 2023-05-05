package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"github.com/remote-job-finder/handlers"
	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/utils/redis"
	"github.com/remote-job-finder/worker"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		logger.Error.Println("Error loading .env file")
	}

	ctx := context.Background()
	redis.InitRedis() // wait until redis initialize after loading .env file

	go func() {
		redis.WaitUntilInitialized(ctx)
		worker.StartWorker(ctx, time.Hour) // fetch jobs every an hour in backround
	}()

	r := mux.NewRouter()
	r.HandleFunc("/jobs", func(w http.ResponseWriter, r *http.Request) {
		handlers.JobsHandler(ctx, w, r)
	}).Methods("GET")

	r.HandleFunc("/job-detail/{slug}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		slug := vars["slug"]
		handlers.JobDetailsHandler(ctx, w, r, slug)
	}).Methods("GET")

	r.HandleFunc("/jobs/{category}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		category := vars["category"]
		handlers.JobCategoryHandler(ctx, w, r, category)
	})

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	})

	handler := c.Handler(r)
	logger.Info.Printf("Server is starting on: 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
