package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"github.com/remote-job-finder/handlers"
)

func main() {
	ctx := context.Background()

	r := mux.NewRouter()
	r.HandleFunc("/jobs", func(w http.ResponseWriter, r *http.Request) {
		handlers.HomeHandler(ctx, w, r)
	}).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	})

	handler := c.Handler(r)
	fmt.Println("Server is starting on: 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
