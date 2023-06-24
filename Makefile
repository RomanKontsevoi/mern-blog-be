# Define the name of the docker image (and container)
IMAGE_NAME = mern-blog-be
PORT = 4444
CONTAINER_ID := $(shell timeout 2s docker ps -q -f name=$(IMAGE_NAME))

all: redeploy

# Build the docker image from the Dockerfile
build:
	docker build  -t $(IMAGE_NAME) .

# Run the docker container from the image
#The -d option runs the container in detached mode, which means that it runs
#in the background and does not output anything to the console.
#The -p option maps the container's port to the host's port.
#The --name option assigns a name to the container, which can be used to reference it later.
#The --rm option removes the container automatically when it stops running.
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

# Rebuild and restart the new docker container
refresh_r: build restart

# Rebuild and run or restart the new docker container relying on the condition
refresh_c:
ifneq ($(CONTAINER_ID),)
	make refresh_r
else
	make refresh
endif

# output app logs
logs:
	docker logs $(IMAGE_NAME)

# войти в контейнер в интерактивном режиме
enter:
	docker exec -it $(IMAGE_NAME) /bin/bash

remove2:
	docker rm $(CONTAINER_ID)

redeploy:
	git pull
	make refresh_c
