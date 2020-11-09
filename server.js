'use strict';

const PORT = process.env.PORT || 3001;
const serverLogsPath = "server.log";
const dbLogsPath = "db.log";
const dbUri = "mongodb://localhost:27017/";
const dbName = "localDB";

const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const logger = require("./Modules/logger");
const app = express();
const mongoClient = new MongoClient(dbUri);
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.use((request, response, next) => {
  const data = `${request.method} ${request.url} ${request.get("user-agent")}`;
  logger.writeLog(data, serverLogsPath);

  next();
});

app.get("/", (request, response) => {
  response.end("It is working");
});

app.get("/Rooms", (request, response) => {
  console.log('This route is working')
  mongoClient.connect((error, client) => {
    if (!error) {
      const db = client.db(dbName);
      const collection = db.collection("rooms");

      collection.find().toArray((error, results) => {
        if (error) {
          logger.writeLog(error, dbLogsPath);
        }

        response.send(results);
        response.sendStatus(200);
        client.close();
      });
    } else {
      console.error('error', error)
      logger.writeLog(error, dbLogsPath);

      response.sendStatus(500);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server live on ${PORT} port`);
});
