const Database=require("better-sqlite3"),path=require("path"),db=new Database(path.join(__dirname,"..","data","football.db"));
db.pragma("foreign_keys = ON");
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT DEFAULT 'user');
CREATE TABLE IF NOT EXISTS teams(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,code TEXT,group_name TEXT,confederation TEXT,coach TEXT);
CREATE TABLE IF NOT EXISTS players(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,position TEXT,team_id INTEGER,goals INTEGER DEFAULT 0,assists INTEGER DEFAULT 0,yellow_cards INTEGER DEFAULT 0,red_cards INTEGER DEFAULT 0,FOREIGN KEY(team_id) REFERENCES teams(id));
CREATE TABLE IF NOT EXISTS stadiums(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,city TEXT,country TEXT,capacity INTEGER);
CREATE TABLE IF NOT EXISTS matches(id INTEGER PRIMARY KEY AUTOINCREMENT,home_team_id INTEGER,away_team_id INTEGER,stadium_id INTEGER,match_date TEXT,status TEXT DEFAULT 'scheduled',home_score INTEGER,away_score INTEGER,stage TEXT,FOREIGN KEY(home_team_id) REFERENCES teams(id),FOREIGN KEY(away_team_id) REFERENCES teams(id),FOREIGN KEY(stadium_id) REFERENCES stadiums(id));
`);
module.exports=db;