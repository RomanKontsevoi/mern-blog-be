# Используем официальный образ Node.js в качестве базового образа
FROM node:18.16.1 as build

# Устанавливаем директорию приложения в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./
COPY yarn.lock ./

# Эта команда выполняет следующие действия:
# 1. Устанавливает все необходимые предварительные условия для Bcrypt, такие как make, gcc, g++ и
# python.
# 2. Устанавливает зависимости проекта из package-lock.json без его обновления
# 3. Перекомпилирует Bcrypt с помощью --build-from-source.
# 4. Удаляет предварительные условия, чтобы сохранить образ Docker как можно меньше.
# Это означает, что команда устанавливает все необходимые зависимости для Bcrypt и перекомпилирует
# его для использования в контейнере Docker. После этого она удаляет все предварительные условия,
# чтобы образ Docker был как можно меньше.
RUN apt update && \
    apt install -y make gcc g++ python3 && \
    yarn && \
    yarn add bcrypt --force --build-from-source && \
    apt remove -y make gcc g++ python3

# Копируем все файлы из текущей директории в директорию приложения в контейнере
COPY . .

RUN yarn build

# Stage 2: Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/.env ./
RUN yarn --production
#
## Установка порта для приложения
ENV PORT=4444
#
## Определение порта, который будет слушать контейнер при запуске
EXPOSE $PORT

# Указываем команду запуска приложения
CMD ["yarn", "start"]

