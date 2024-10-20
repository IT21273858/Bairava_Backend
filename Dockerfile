FROM node:20.15.0-slim
RUN apt-get update && apt-get install -y curl
WORKDIR /Bairava/server
COPY . /Bairava/server/
RUN npm install
RUN npx prisma generate
EXPOSE 8080
CMD npm run dev