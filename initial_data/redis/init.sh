#!/bin/bash

echo "${CATEGORIES}" | tr ',' '\n' | while read category; do
    redis-cli -h redis lpush categories "$category"
done

echo "${RSS_LINKS}" | tr ',' '\n' | while read rss_links; do
    redis-cli -h redis lpush rss_links "$rss_links"
done
