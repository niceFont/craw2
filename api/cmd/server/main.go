package main

import (
	"time"

	"sync"

	"github.com/gin-gonic/gin"
	"github.com/nicefont/api/pkg/controller"
	"github.com/nicefont/api/pkg/database"
	"github.com/nicefont/api/pkg/middleware"

	"github.com/gin-contrib/cors"
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
	userController := controller.User{}
	router.POST("/login", userController.Login)
	router.POST("/register", userController.Register)
	router.GET("/me", userController.Me)
	router.Run()
}
