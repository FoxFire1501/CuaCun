FROM node:19

COPY . .

RUN npm install

CMD ["npm", "run", "test"]