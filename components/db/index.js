import {openDatabase} from 'react-native-sqlite-storage';

export const openDBConnection = async () => {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase({
      name: 'GymTrainerLog.db',
      location: 'default',
    });
    const enableForeignKeys = 'PRAGMA foreign_keys = ON;';
    db.executeSql(enableForeignKeys);
    resolve(db);
  });
};

export const closeDbConnection = async db => {
  return db.close();
};

export const createTables = async db => {
  const query = `CREATE TABLE IF NOT EXISTS Clients(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        extraNotes TEXT
    );`;

  const queryLogs = `CREATE TABLE IF NOT EXISTS Logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        clientId INTEGER NOT NULL,
        date DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
        FOREIGN KEY (clientId) REFERENCES Clients(id) ON DELETE CASCADE
    );`;

  const queryActivities = `CREATE TABLE IF NOT EXISTS LogActivities(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR NOT NULL,
      count TEXT,
      weight TEXT,
      time TEXT,
      logId INTEGER NOT NULL,
      date DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
      FOREIGN KEY (logId) REFERENCES Logs(id) ON DELETE CASCADE
  );`;

  //---------Events----------

  const queryEvents = `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title	TEXT NOT NULL,
    desc	TEXT NOT NULL,
    event_date	INTEGER,
    start_time	INTEGER NOT NULL,
    end_time	INTEGER NOT NULL,
    occurance_start_date	INTEGER
  )`;

  const queryOccurance = `CREATE TABLE IF NOT EXISTS occurance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    occurance_day	INTEGER NOT NULL
  )`;

  const queryEvents_occurance = `CREATE TABLE IF NOT EXISTS events_occurance (
    id	INTEGER NOT NULL,
    day	INTEGRER NOT NULL,
    FOREIGN KEY(day) REFERENCES occurance(id),
    FOREIGN KEY (id) REFERENCES events(id) ON DELETE CASCADE
  )`;

  const queryCancelledEvents = `CREATE TABLE IF NOT EXISTS cancelled_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId	INTEGER NOT NULL,
    cancelationDate	INTEGER NOT NULL,
    FOREIGN KEY(eventId) REFERENCES events(id) ON DELETE CASCADE
  )`;
  //-----------End Events------------------

  db.transaction(async tx => {
    // tx.executeSql('DROP TABLE LogActivities');
    // tx.executeSql('DROP TABLE Logs');
    tx.executeSql(queryEvents);
    tx.executeSql(queryOccurance);
    tx.executeSql(queryEvents_occurance);
    tx.executeSql(queryCancelledEvents);

    tx.executeSql(queryActivities);
    tx.executeSql(query);
    tx.executeSql(queryLogs);
  });
};

export const createClient = async (client, db) => {
  const query =
    'INSERT INTO Clients(firstName,lastName,extraNotes) VALUES(?,?,?);';
  db.executeSql(query, [client.firstName, client.lastName, client.extraNotes]);
};

export const removeClient = async (id, db) => {
  const query = 'DELETE FROM Clients WHERE id=?';
  return db.executeSql(query, [id]);
};

export const updateClientById = async (client, db) => {
  const query =
    'UPDATE Clients SET firstName=?,lastName=?,extraNotes=? WHERE id=?';
  return db.executeSql(query, [
    client.firstName,
    client.lastName,
    client.extraNotes,
    client.id,
  ]);
};

export const getAllClients = async (db, pageSize = 15, startIndex = 0) => {
  return new Promise(async (resolve, reject) => {
    const query = 'SELECT * FROM Clients ORDER BY firstName LIMIT ? OFFSET ?';
    const count = 'SELECT COUNT(*) FROM Clients';
    const result = await db.executeSql(query, [pageSize, startIndex]);
    const countResult = await db.executeSql(count);
    const rows = result[0].rows;
    const data = [];

    for (let i = 0; i < rows.length; ++i) {
      data.push(rows.item(i));
    }
    resolve({data, count: countResult[0].rows.item(0)['COUNT(*)']});
  });
};

export const searchClients = async (search, db) => {
  return new Promise(async (resolve, reject) => {
    const query =
      'SELECT * FROM Clients  WHERE "firstName" LIKE "%' +
      search +
      '%" OR "lastName" LIKE "%' +
      search +
      '%"';

    const result = await db.executeSql(query);
    const rows = result[0].rows;
    const data = [];
    for (let i = 0; i < rows.length; ++i) {
      data.push(rows.item(i));
    }
    resolve({data});
  });
};
export const searchLogs = async (search, id, db) => {
  return new Promise(async (resolve, reject) => {
    const query =
      'SELECT * FROM Logs  WHERE id=? AND "title" LIKE "%' + search + '%"';

    const result = await db.executeSql(query, [id]);
    const rows = result[0].rows;
    const data = [];
    for (let i = 0; i < rows.length; ++i) {
      data.push(rows.item(i));
    }
    resolve({data});
  });
};

export const getClientByFirstLastName = async (client, db) => {
  const query = 'SELECT * FROM Clients WHERE firstName=? AND lastName=?';
  return db.executeSql(query, [client.firstName, client.lastName]);
};

export const getClientById = async (id, db) => {
  const query = 'SELECT * FROM Clients WHERE id=?';
  return db.executeSql(query, [id]);
};

export const getLogsByClientId = async (clientId, pageSize, startIndex, db) => {
  return new Promise(async (resolve, reject) => {
    const query =
      'SELECT * FROM Logs WHERE clientId=? ORDER BY date DESC LIMIT ? OFFSET ?';
    const count = 'SELECT COUNT(*) FROM Logs WHERE clientId=?';
    const result = await db.executeSql(query, [clientId, pageSize, startIndex]);
    const countResult = await db.executeSql(count, [clientId]);
    const rows = result[0].rows;
    const data = [];

    for (let i = 0; i < rows.length; ++i) {
      data.push(rows.item(i));
    }
    resolve({data, count: countResult[0].rows.item(0)['COUNT(*)']});
  });
};

export const getLogById = async (id, db) => {
  const query = 'SELECT * FROM Logs WHERE id=?';
  return db.executeSql(query, [id]);
};

export const getLogRecordsByLogId = async (
  logId,
  pageSize = 15,
  startIndex = 0,
  db,
) => {
  return new Promise(async (resolve, reject) => {
    const query =
      'SELECT * FROM LogActivities WHERE logId=? ORDER BY date DESC LIMIT ? OFFSET ?';
    const count = 'SELECT COUNT(*) FROM LogActivities WHERE logId=?';

    const results = await db.executeSql(query, [logId, pageSize, startIndex]);
    const countResult = await db.executeSql(count, [logId]);

    var data = [];
    for (let i = 0; i < results[0].rows.length; ++i) {
      data.push(results[0].rows.item(i));
    }

    resolve({data, count: countResult[0].rows.item(0)['COUNT(*)']});
  });
};

export const deleteLogRecord = async (id, db) => {
  const query = 'DELETE FROM LogActivities WHERE id=?';
  return db.executeSql(query, [id]);
};

export const getLogRecordById = async (id, db) => {
  const query = 'SELECT * FROM LogActivities WHERE id=?';
  return db.executeSql(query, [id]);
};

export const createLog = async (log, db) => {
  const query = 'INSERT INTO Logs(title,clientId) VALUES(?,?);';
  return db.executeSql(query, [log.title, log.clientId]);
};

export const updateLog = async (log, db) => {
  const query = 'UPDATE Logs SET title=? WHERE id=?';
  return db.executeSql(query, [log.title, log.id]);
};

export const deleteLog = async (id, db) => {
  const query = 'DELETE FROM Logs WHERE id=?';
  return db.executeSql(query, [id]);
};

export const createLogRecord = async (logRecord, db) => {
  const query =
    'INSERT INTO LogActivities(logId,title,weight,count,time) VALUES(?,?,?,?,?);';
  return db.executeSql(query, [
    logRecord.logId,
    logRecord.title,
    logRecord.weight,
    logRecord.count,
    logRecord.time,
  ]);
};

export const updateLogRecord = async (logRecord, db) => {
  const query =
    'UPDATE LogActivities SET title=?,weight=?,count=?,time=? WHERE id=?';
  db.executeSql(query, [
    logRecord.title,
    logRecord.weight,
    logRecord.count,
    logRecord.time,
    logRecord.id,
  ]);
};

//--------- Start events queries --------------
const createOneDayEvent = (event, db) => {
  const query =
    'INSERT INTO events(title,desc,event_date,start_time,end_time) VALUES(?,?,?,?,?);';
  return db.executeSql(query, [
    event.title,
    event.desc,
    event.eventDate,
    event.startTime,
    event.endTime,
  ]);
};

const createRegularEvent = (event, db) => {
  return new Promise(async (resolve, reject) => {
    const query =
      'INSERT INTO events(title,desc,occurance_start_date,start_time,end_time) VALUES(?,?,?,?,?);';

    const result = await db.executeSql(query, [
      event.title,
      event.desc,
      event.eventDate,
      event.startTime,
      event.endTime,
    ]);
    const eventId = result[0].insertId;
    const occur = event.occurance;
    const queries = [];
    for (let i = 0; i < occur.length; i++) {
      const queryPattern = `INSERT INTO events_occurance(id,day) VALUES('${eventId}','${occur[i]}');`;
      queries.push(queryPattern);
    }
    const inserOccuranceQuery = queries.join(' ');
    await db.executeSql(inserOccuranceQuery);
    resolve();
  });
};

const selectEventsForWeek = (startWeekDate, endWeekDate, db) => {
  const query = `SELECT * FROM events 
   LEFT JOIN events_occurance on events.id = events_occurance.id
   LEFT JOIN cancelled_events on events.id=cancelled_events.eventId 
   WHERE event_date >= date(${startWeekDate}) AND event_date <= date(${endWeekDate})
   OR occurance_start_date IS NOT NULL;`;

  returndb.executeSql(query);
};

//----------------------------------------------
