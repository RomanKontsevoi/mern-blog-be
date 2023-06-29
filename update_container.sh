#!/bin/bash

IMAGE_NAME="mern-blog-be"

docker pull 3844320/${IMAGE_NAME}
make stop
make run
