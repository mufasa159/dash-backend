const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
let port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

app.get("/habits", async (req, res) => {
   try {
      const allHabits = await pool.query("SELECT * FROM habit;");
      res.json(allHabits.rows);
   } catch (err) {
      console.error(err.message);
   }
})

app.post("/add-habit", async (req, res) => {
   try {
      const name = req.body.name;
      const description = req.body.description;
      const add = await pool.query("INSERT INTO habit (name, description) VALUES($1, $2);", [name, description]);
      res.status(201).send("Successfully added")
   } catch (err) {
      console.log(err.message);
   }
})

app.post("/remove-habit", async (req, res) => {
   try {
      const id = req.body.id;
      const remove = await pool.query("DELETE FROM habit WHERE id = $1;", [id]);
      res.status(201).send("Successfully deleted")
   } catch (err) {
      console.log(err.message);
   }
})

app.post("/mark-as-complete", async (req, res) => {
   try {
      const habit_id = req.body.habit_id;
      const streak = req.body.streak;
      const markAsComplete = await pool.query("UPDATE habit set last_completed=CURRENT_TIMESTAMP::timestamp with time zone at time zone 'America/New_York', streak=$2 WHERE id=$1;", [habit_id, streak]);
      res.status(201).send("Successfully updated")
      // console.log(res.status)
   } catch (err) {
      console.log(err.message);
   }
})

var upcomingEvents = [];

app.get("/upcoming-events", async (req, res) => {
   
   const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
   const TOKEN_PATH = 'token.json';
   
   fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(content), listEvents);
   });
   
   function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
         client_id, client_secret, redirect_uris[0]);
   
      fs.readFile(TOKEN_PATH, (err, token) => {
         if (err) return getAccessToken(oAuth2Client, callback);
         oAuth2Client.setCredentials(JSON.parse(token));
         callback(oAuth2Client);
      });
   }
   
   function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
         access_type: 'offline',
         scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
         input: process.stdin,
         output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
         rl.close();
         oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
               if (err) return console.error(err);
               console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
         });
      });
   } 
   
   async function listEvents(auth) {
      const calendar = await google.calendar({version: 'v3', auth});
         calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 3,
            singleEvents: true,
            orderBy: 'startTime',
         }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = res.data.items;
            upcomingEvents = [];
            if (events.length) {
               events.map((event, i) => {
                  upcomingEvents.push(event);
               });
            } else {
               console.log('No upcoming events found.');
            }
         });
   }
   res.send(upcomingEvents)
})

// start server
app.listen(port, () => {
   console.log(`Server has started on port ${port}`);
})