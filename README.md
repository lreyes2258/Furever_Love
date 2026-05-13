# Furever_Love

## How to get project working

1. Required account for ngrok
  - Install ngrok through their documentation, even I dont understand it & installed a appImage through an tar zip. Process for windows is unknown
2. Install bun 
3. Install javascript and add to system path, if on windows add to systempath via system variables. 
4. Use bun to install node through terminal CLI
5. Install MariaDB & ensure that it is running 
5. Clone repository
6. In a terminal run these next few commands to get the backend all working 
  - Recommended to be doing this with something like termux if familiar but steps for that will be omitted here \
  i). `cd backend` from project root \
  ii). `npm install` just to ensure all packages are up to date \
  iii). `node backendServer.js` runs database + backend server \
7. In a new terminal instance to get the application to run we make use of ngrok
  - Ensure that you have an ngrok account and the config has your own custom token preloaded for all functionality to work\
  i). `cd frontend` from project root \
  ii). `npm install` ensure all dependeices are updated \
  iii). `ngrok http 4000` starts an http server at port 4000 for external access \
8. In another new terminal instance (keeping count there should be 3) \
  i). `cd frontend` from project root \
  ii). `npm install` ensure packages are up to date \
  iii). `npm start` starts the front end and expo, giving an QR code to have the project run on mobile and the option to press `W` to have an web interface of it pop up \
