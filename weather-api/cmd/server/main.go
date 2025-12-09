package main

import (
	"log"
	"os"
	"weather-api/internal/server"
)

func main() {
	srv := server.New()
	addr := ":8080"
	if v := os.Getenv("PORT"); v != "" {
		addr = ":" + v
	}
	log.Printf("starting weather-api on %s", addr)
	if err := srv.Start(addr); err != nil {
		log.Fatal(err)
	}
}
