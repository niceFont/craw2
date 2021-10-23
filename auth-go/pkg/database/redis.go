package database

import (
	"sync"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client

func ConnectCache(wg *sync.WaitGroup) {
	defer wg.Done()
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
	})
}
