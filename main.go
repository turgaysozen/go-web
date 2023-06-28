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
	"github.com/remote-job-finder/utils/db"
	"github.com/remote-job-finder/utils/logger"
	"github.com/remote-job-finder/worker"
)

func main() {
	// load all of env variables
	err := godotenv.Load()
	if err != nil {
		logger.Error.Println("Error loading .env file")
	}

	// Initialize the database connection
	database, err := db.InitDB()
	if err != nil {
		logger.Error.Println("Failed to initialize the database:", err)
		return
	}

	// close the underlying database connection after the main function has finished executing
	defer func() {
		db, err := database.DB.DB()
		if err != nil {
			logger.Error.Println("Failed to get the underlying database connection:", err)
			return
		}

		err = db.Close()
		if err != nil {
			logger.Error.Println("Failed to close the database connection:", err)
		}
	}()

	ctx := context.Background()

	go func() {
		worker.StartWorker(ctx, database, 4*time.Hour) // fetch jobs every 4 hours in background
	}()

	r := mux.NewRouter()

	// basicRouter := r.PathPrefix("/basic").Subrouter()
	// basicRouter.HandleFunc("", handlers.ServeBasicHtml).Methods("GET")

	r.HandleFunc("/jobs", func(w http.ResponseWriter, r *http.Request) {
		handlers.JobsHandler(ctx, w, r, database)
	}).Methods("GET")

	r.HandleFunc("/job-detail/{slug}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		slug := vars["slug"]
		handlers.JobDetailsHandler(ctx, w, r, slug, database)
	}).Methods("GET")

	r.HandleFunc("/jobs/{category}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		category := vars["category"]
		handlers.JobCategoryHandler(ctx, w, r, category, database)
	}).Methods("GET")

	r.HandleFunc("/jobs/apply/{slug}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		slug := (vars["slug"])
		handlers.ApplyToJob(ctx, w, r, slug, database)
	}).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	})

	handler := c.Handler(r)
	logger.Info.Printf("Server is starting on: 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
