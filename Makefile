# Define the name of the docker image (and container)
IMAGE_NAME = mern-blog-be
PORT = 4444

# Build the docker image from the Dockerfile
build:
	docker build  --no-cache -t $(IMAGE_NAME) .

# Run the docker container from the image
run:
	docker run -d -p $(PORT):$(PORT) --name $(IMAGE_NAME) --rm $(IMAGE_NAME)

# Stop the docker container
stop:
	docker stop -t 5 $(IMAGE_NAME)

# Remove the docker container
remove:
	docker rm $(IMAGE_NAME)

# Restart the docker container
restart: stop run

# Rebuild and start the new docker container
refresh: build run

# output app logs
logs:
	docker logs $(IMAGE_NAME)

# войти в контейнер в интерактивном режиме
enter:
	docker exec -it $(IMAGE_NAME) /bin/bash
