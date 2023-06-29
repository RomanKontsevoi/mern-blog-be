# Define the name of the docker image (and container)
CONTAINER_NAME = mern-blog-be
IMAGE_NAME := 3844320/$(CONTAINER_NAME)
PORT = 4444

# Build the docker image from the Dockerfile
build:
	docker build  -t $(IMAGE_NAME) . --network host

# Run the docker container from the image
#The -d option runs the container in detached mode, which means that it runs
#in the background and does not output anything to the console.
#The -p option maps the container's port to the host's port.
#The --name option assigns a name to the container, which can be used to reference it later.
#The --rm option removes the container automatically when it stops running.
run:
	docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) --rm $(IMAGE_NAME)

# Stop the docker container
stop:
	docker stop -t 5 $(CONTAINER_NAME)

# Remove the docker container
remove:
	docker rm $(CONTAINER_NAME)

# Restart the docker container
restart: stop run

# Rebuild and start the new docker container
refresh: build run

# Rebuild and restart the new docker container
refresh_r: build restart

# output app logs
logs:
	docker logs $(CONTAINER_NAME)

# войти в контейнер в интерактивном режиме
enter:
	docker exec -it $(CONTAINER_NAME) /bin/bash

remove2:
	docker rm $(CONTAINER_NAME)
