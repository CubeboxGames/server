# CubeBox Server

## What is this?

This is the main server used for all CubeBox games. <br>
The server is in charge of managing all connections to the games being hosted.

## Why 1 main server?

The main reason for making all games run on 1 server is to make connecting more fluid and easier. <br>
When you have 1 server you just connect using 1 url instead of a diffrent one for each game. <br>
This also makes fixing bugs much eaiser since we don't need to make a patch for every game.

## Selfhosting

Steps to selfhost any CubeBox game:

1. Host the server on a site like [repl.it](https://repl.it)
2. Client:
   - Suggested method:
     1. Download the client on [Github](https://github.com/cubeboxgames/client)
     2. Modify the `server-url` to be the link of your selfhosted server
     3. Host the client (Can be staticly hosted)
     4. Have all players connect to the client
   - Alternate method:
     1. Go to the CubeBox Custom Client **Coming soon**
     2. Enter the server url
3. Game:
   - Suggested method:
     1. Download your chosen game
     2. Modify the `server-url` to be the link of your selfhosted server
     3. Run the game
   - Alternate method:
     1. Go to the CubeBox Custom Game **Coming soon**
     2. Enter the server url
     3. Have all the players connect
4. Play