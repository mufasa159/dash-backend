# PMS Dash - API

## Setting up local dev environment

1. Clone this repo
2. Install packages with `npm install`  

### Postgres Setup for Habit Tracker
1. Create a postgres database using the `schema.sql` file  
2. Create a `.env` file and store all the database information.
3. Update `db.js` file with database info from `.env` file.

Note: If you plan to use MySQL, MongoDB, or other DB, update the `db.js` to connect to your preferred database.
  
### Google Calendar Configuration  
Google Cloud API  
1. Set up Google Developer account
2. Go to developer console and create an app  
3. Add Google Calendar API to your app  
4. Download credential file and store it in main directory
  
Calendar Authentication    
1. Run `nodemon`  
2. Visit `http://localhost:8080/upcoming-events`  
3. Return to terminal and open the authentication link  
4. Sign in using browser and then copy the code  
5. Paste it in the terminal  
6. Refresh the `/upcoming-events` page

---

## API Endpoints

| Url | Method | Params | Details |
|---------|-|-|-|
|`/habits` | GET | N/A|Get all the habits from database |
|`/add-habit`| POST | `name` : string <br/>`description` : string|Add new habit to the database |
|`/remove-habit`| POST | `id` : integer | Remove an habit from database|
|`/mark-as-complete`| POST | `habit_id` : integer <br/> `streak` : integer | Mark as complete and update streak count | 
|`/upcoming-events` | GET | N/A |  Get 3 upcoming events from Google Calendar |



Note: Planning to include more item here such as analytics, user-info, and front-end configurations.