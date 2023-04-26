package redis

import (
	"context"

	"github.com/redis/go-redis/v9"
	"github.com/remote-job-finder/utils/logger"
)

var RedisClient *redis.Client

func init() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	logger.Info.Println("Redis Client started:", RedisClient)
}

func SaveJobs(ctx context.Context, jobs []byte, key string) error {
	err := RedisClient.Set(ctx, key, jobs, 0).Err()
	if err != nil {
		logger.Error.Printf("An error occurred to save jobs to the cache, for key: %s, err: %s", key, err)
		return nil
	}

	logger.Info.Println("Jobs saved to cache for key:", key)
	return nil
}

func GetJobs(ctx context.Context, key string) ([]byte, error) {
	jobs, err := RedisClient.Get(ctx, key).Bytes()
	if err != nil {
		logger.Error.Printf("An error occurred to get jobs from the cache, for key: %s, err: %s", key, err)
		return nil, err
	}

	logger.Info.Println("Jobs fetched from the cache for key:", key)
	return jobs, nil
}
