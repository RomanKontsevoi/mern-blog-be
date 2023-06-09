# Используем официальный образ Node.js в качестве базового образа
FROM node:18.16.0

# Устанавливаем директорию приложения в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Эта команда выполняет следующие действия:
# 1. Устанавливает все необходимые предварительные условия для Bcrypt, такие как make, gcc, g++ и
# python.
# 2. Устанавливает зависимости проекта из package-lock.json без его обновления
# 3. Перекомпилирует Bcrypt с помощью --build-from-source.
# 4. Удаляет предварительные условия, чтобы сохранить образ Docker как можно меньше.
# Это означает, что команда устанавливает все необходимые зависимости для Bcrypt и перекомпилирует
# его для использования в контейнере Docker. После этого она удаляет все предварительные условия,
# чтобы образ Docker был как можно меньше.
#RUN apt-get update && \
#    apt-get install -y make gcc g++ python && \
#    npm install && \
#    npm rebuild bcrypt --build-from-source && \
#    apt-get remove -y make gcc g++ python && \
#    apt-get autoremove -y && \
#    rm -rf /var/lib/apt/lists/*

RUN apt-get update && \
    apt-get install -y make gcc g++ python && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apt-get remove -y make gcc g++ python

# Копируем все файлы из текущей директории в директорию приложения в контейнере
COPY . .

# Установка порта для приложения
ENV PORT=4444

# Определение порта, который будет слушать контейнер при запуске
EXPOSE $PORT

# Указываем команду запуска приложения
CMD ["npm", "start"]
