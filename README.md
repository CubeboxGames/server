# CubeBox Server

## What is this?

This is the main server used for all CubeBox games. <br>
The server is in charge of managing all connections to the games being hosted.

## Why 1 main server?

The main reason for making all games run on 1 server is to make connecting more fluid and easier. <br>
When you have 1 server you just connect using 1 url instead of a diffrent one for each game. <br>
This also makes fixing bugs much eaiser since we don't need to make a patch for every game.

## Why is the client built into the server?

Short story: Bugs
Long story: There are some issues involving socket.io running without being on the server end. <br>
As a patch the client is built into the server. We will look at fixing this as it's not the best solution. <br>
The client source will still be avalible on it's own [Repository](https://github.com/cubeboxgames/client) 
but that will mainly just be the built in client in a repository

## Selfhosting

Steps to selfhost any CubeBox game:

1. Host the server on a site like [repl.it](https://repl.it)
2. Have all players connect to the server.
3. Play
