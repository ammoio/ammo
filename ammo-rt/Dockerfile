FROM node

RUN npm install -g pm2

RUN pm2 dump

EXPOSE 3001

CMD pm2 start /ammo-rt/server.json && pm2 logs
