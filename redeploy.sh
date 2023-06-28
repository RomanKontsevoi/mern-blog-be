#!/bin/bash

IMAGE_NAME="mern-blog-be"

git pull

make build
make stop
make run
