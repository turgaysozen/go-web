package redis

import (
	"context"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/remote-job-finder/utils/common"
	"github.com/remote-job-finder/utils/logger"
)

var RedisClient *redis.Client

func InitRedis() {
	redisAddr := "localhost:6379"
	if addr, ok := os.LookupEnv("REDIS_ADDR"); ok {
		redisAddr = addr
	}
	logger.Info.Println("redis address loaded from .env, redisAddr:", redisAddr)
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
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

func IncrementJobApplicantCount(ctx context.Context, slug string) error {
	err := RedisClient.HIncrBy(ctx, common.JobApplicantsCountKey, slug, 1).Err()
	if err != nil {
		logger.Error.Println("An error occurred while incrementing applicant count for job:", slug)
		return err
	}

	return nil
}

func GetJobApplicantCount(ctx context.Context, key string, slug string) int64 {
	count, err := RedisClient.HGet(ctx, key, slug).Int64()
	if err != nil {
		logger.Error.Println("An error occurred while getting applicant count for job:", slug)
		return 0
	}

	return count
}

func WaitUntilInitialized(ctx context.Context) {
	for {
		categoriesLen, err := RedisClient.LLen(ctx, common.CategoriesKey).Result()
		if err != nil {
			logger.Info.Println("Test.....")
			logger.Error.Println("Error getting length of categories list:", err)
			time.Sleep(time.Second)
			continue
		}

		rssLinksLen, err := RedisClient.LLen(ctx, common.RssLinksKey).Result()
		if err != nil {
			logger.Error.Println("Error getting length of rss_links list:", err)
			time.Sleep(time.Second)
			continue
		}

		if categoriesLen == common.TotalCountOfCategories && rssLinksLen == common.TotalCountOfCategories {
			break
		}

		logger.Info.Println("Redis initial data not migrated yet, wait for 1 sec..")
		time.Sleep(time.Second)
	}
}
