ammo.io
======================

##Description
Ammo is a centralized music library that allows you to build playlists containing songs from all of your favorite music services. 
If you’d like to make playlists that mix mainstream tracks (e.g. rdio) with lesser known indie tracks (e.g. soundcloud),  Ammo is for you.

Ammo allows everyone at your party to participate in democratic DJ-ing, changing the way you listen to music at parties.

Picture yourself at a party. The music is pumping and you’re dancing with your friends, and you want to hear your favorite song. Is it on the current playlist? Does the host even have the song? With Ammo, you can pull out your phone and check to see if your song is coming up in the current playlist. You can even up-vote that song so that it plays sooner. And if it’s not on the list, you can do a quick search for it, and add it to the playlist yourself. No need to leave the dance floor to make a DJ request, no need to wonder when, if ever, your song will play. It all happens with a few clicks and within a few seconds. Only on Ammo. 


##Tech Stack
Ammo.io is fully written in Javascript, using AngularJS on the front-end, and NodeJS on the server. Our back end consists of an Express server that uses MongoDB for persistence. Our server code heavily uses promises (provided by the Q library) to handle all asynchronous operations. Currently we support the following music providers:

Music Providers:
- Youtube
- SoundCloud
- Rdio


##Getting started
1. Make sure you have node, vagrant, and virtualbox installed 
2. run `npm install`
3. run `bower install`
4. run `npm install -g gulp`
5. run `gulp`
6. run `chmod +x ammo`
7. run `./ammo`
8. navigate to `http://localhost:3000`

###### Optional Environment Variables
1. `AMMO_PORT` defaults to `:3000`
2. `AMMO_DB_PORT` defaults to `:27017`
3. `AMMO_DB_WEB_PORT` defaults to `:28017`

##Technical Challenges
###Combining various music APIs
Problem: Combining all of the various music service APIs to provide a uniform user experience.
Solution: Build our own music player from the ground up.
Many asynchronous calls
Problem: Many asynchronous requests are made to various APIs.
Solution: Using promises for all of our requests and backend.

###Spotify iFrame
Problem: Spotify has a very strict music player interface using iframe that makes providing a uniform user experience for all the music services difficult.
Solution: A lot of time has been invested to work around the problem. We found that many other developers have struggled with this without success. In order to keep the quality of our user interface, we decided to forgo Spotify integration.

###Youtube API bug
Problem: Youtube’s API has a bug where the ‘buffering’ event is not properly sent.
Solution: The problem occurs in rare instances. We have informed Youtube and will continue to provide Youtube service in the meantime.

###Scalability
Problem: The use of socket.io for synchronizing the ‘voting’ feature currently limits our userbase. If the number of concurrent users and amount of activities exceed our server capacity, our service may run into problems.
Solution: For the sake of the project, we will continue to handle socket requests as is. When scalability becomes a problem, we have a plan to balance the load across various servers and optimize our database query by caching playlists on the server.

###View Management with Shuffle Functionality
Problem: We structured our client side code structure to handle only simple insertion and deletion of songs. As the project proceeds, we had difficulty integrating new functionalities such as shuffling the playlist.
Solution: We had to refactor our code multiple times to make the new functionalities possible.

##Codebase Map
=====

The code is structured as following:

`/`
> Home of server.js our main server file

`docs/`
> Contains documentation about our API (backend endpoints) and description about how we have to comment our code.

`app/`
> Contains all the server-related files. Here you can find the controllers, models, routes, and helpers used by our server. (Node.js)

`public/`
> Is the folder containing all of the Angularjs files (frontend)

`public/scripts`
> Home of the controllers, directives, services, and helpers. Each one organized on their own folder.

`public/views`
> Frontend views (templates) reside here.

`specs/`
> Test suites configuration, backend and frontend tests.