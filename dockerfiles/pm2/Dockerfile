FROM node

RUN npm install -g pm2
RUN pm2 dump

EXPOSE 3000

CMD pm2 start /ammo/server.json && pm2 logs
