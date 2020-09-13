FROM node:6

ENV INSTALL_PATH /my_dockerized_app
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]