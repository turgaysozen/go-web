package redis

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func init() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
}

func SaveJobs(ctx context.Context, jobs []byte, key string) error {
	err := RedisClient.Set(ctx, key, jobs, 0).Err()
	if err != nil {
		return nil
	}

	fmt.Println("jobs are saved to cache")
	return nil
}

func GetJobs(ctx context.Context, key string) ([]byte, error) {
	jobs, err := RedisClient.Get(ctx, key).Bytes()
	if err != nil {
		return nil, err
	}

	fmt.Println("jobs fetched from the cache..")
	return jobs, nil
}
