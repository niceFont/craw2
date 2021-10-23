package main

import (
	"time"

	"sync"

	"github.com/gin-gonic/gin"
	"github.com/nicefont/auth-go/pkg/database"
	"github.com/nicefont/auth-go/pkg/middleware"

	"github.com/gin-contrib/cors"
	"github.com/nicefont/auth-go/pkg/models"
)

func main() {
	router := gin.Default()
	wg := new(sync.WaitGroup)
	wg.Add(2)
	go database.ConnectDB(wg)
	go database.ConnectCache(wg)
	wg.Wait()
	router.Use(middleware.Error())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"PUT", "POST", "GET", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	router.POST("/login", models.Login)
	router.POST("/register", models.Register)
	router.GET("/me", models.Me)
	router.Run()
}
