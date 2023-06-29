#!/bin/bash

IMAGE_NAME="mern-blog-be"

git config --global --add safe.directory /app/target
git pull

make build
make stop
make run
