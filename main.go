package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"github.com/remote-job-finder/handlers"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/jobs", handlers.HomeHandler).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	})

	handler := c.Handler(r)
	fmt.Println("Server is starting on: 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
