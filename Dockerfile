FROM node:20

COPY build /app

WORKDIR /app

CMD npm install -g serve; serve -s . -l 4000

EXPOSE 4000
