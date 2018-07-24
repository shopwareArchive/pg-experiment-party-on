# online-tupper-party

> An experiment

## Requirements

- Docker
- An additional software for streaming like obs [https://obsproject.com/](https://obsproject.com/)
- setup shopware development `https://github.com/shopware/development`

## Run dev mode
- run `docker-compose up` to start the WebSocket Relay and the nginx for streaming 
- configure OBS see [offical homepage](https://obsproject.com/forum/resources/how-to-set-up-your-own-private-rtmp-server-using-nginx.50/)
- configure the dev.env.js `vim ./config/dev.env.js`
- install dependencies `npm install`
- run app in dev mode `npm run dev`
