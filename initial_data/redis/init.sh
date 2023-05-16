#!/bin/bash

redis-cli -h redis flushall # clear al data in redis

echo "${CATEGORIES}" | tr ',' '\n' | while read category; do
    redis-cli -h redis lpush job:categories "$category"
done

echo "${RSS_LINKS}" | tr ',' '\n' | while read rss_links; do
    redis-cli -h redis lpush job:rss_links "$rss_links"
done

echo "Redis initialization completed."