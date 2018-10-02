FROM node:8

WORKDIR /app

ADD package.json ./
ADD .babelrc ./
ADD ./config ./config
RUN mkdir src
EXPOSE 9001
RUN npm install 

CMD ["npm", "start"]