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
    occurrance_start_date	INTEGER
  )`;

  const queryOccurance = `CREATE TABLE IF NOT EXISTS occurrance (
    occurrance_id INTEGER PRIMARY KEY,
    occurrance_day	INTEGER NOT NULL UNIQUE
  )`;

  const queryFillOccurance = [
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (0,0)',
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (1,1)',
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (2,2)',
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (3,3)',
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (4,4)',
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (5,5)',
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (6,6)',
    'INSERT OR IGNORE INTO occurrance(occurrance_id,occurrance_day) VALUES (7,7)',
  ];

  const queryEvents_occurance = `CREATE TABLE IF NOT EXISTS events_occurrance (
    occur_event_id	INTEGER NOT NULL,
    occur_day	INTEGRER NOT NULL,
    FOREIGN KEY(occur_day) REFERENCES occurrance(occurrance_id),
    FOREIGN KEY (occur_event_id) REFERENCES events(id) ON DELETE CASCADE
  )`;

  const queryCancelledEvents = `CREATE TABLE IF NOT EXISTS cancelled_events (
    cancelled_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cancelled_eventId	INTEGER NOT NULL,
    cancellationDate	INTEGER NOT NULL,
    FOREIGN KEY(cancelled_eventId) REFERENCES events(id) ON DELETE CASCADE
  )`;
  //-----------End Events------------------

  db.transaction(async tx => {
    // tx.executeSql('DROP TABLE events_occurrance');
    // tx.executeSql('DROP TABLE cancelled_events');
    // tx.executeSql('DROP TABLE occurrance');
    // tx.executeSql('DROP TABLE events');

    // tx.executeSql('DROP TABLE Logs');
    tx.executeSql(queryEvents);
    tx.executeSql(queryOccurance);
    for (let i = 0; i < queryFillOccurance.length; i++) {
      tx.executeSql(queryFillOccurance[i]);
    }
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
export const createOneDayEvent = (event, db) => {
  const query =
    'INSERT INTO events(title,desc,event_date,start_time,end_time) VALUES(?,?,?,?,?);';
  return new Promise(async (resolve, reject) => {
    const result = await db.executeSql(query, [
      event.title,
      event.desc,
      event.eventDate.getTime(),
      event.startTime.getTime(),
      event.endTime.getTime(),
    ]);

    const eventId = result[0].insertId;
    const queryPattern = `INSERT INTO events_occurrance(occur_event_id,occur_day) VALUES(${eventId},0);`;
    await db.executeSql(queryPattern);
    resolve();
  });
};

export const createRegularEvent = (event, db) => {
  return new Promise(async (resolve, reject) => {
    const query =
      'INSERT INTO events(title,desc,occurrance_start_date,start_time,end_time) VALUES(?,?,?,?,?);';

    const result = await db.executeSql(query, [
      event.title,
      event.desc,
      event.eventDate.getTime(),
      event.startTime.getTime(),
      event.endTime.getTime(),
    ]);
    const eventId = result[0].insertId;
    const occur = event.occurance;
    const queries = [];
    for (let i = 0; i < occur.length; i++) {
      const queryPattern = `INSERT INTO events_occurrance(occur_event_id,occur_day) VALUES(${eventId},${occur[i]});`;
      queries.push(queryPattern);
    }
    db.transaction(
      async tx => {
        for (let k = 0; k < queries.length; k++) {
          tx.executeSql(queries[k]);
        }
      },
      null,
      () => {
        resolve();
      },
    );
  });
};

export const getEventsForWeek = (startWeekDate, endWeekDate, db) => {
  const query = `SELECT * FROM events
    LEFT JOIN events_occurrance on events.id = events_occurrance.occur_event_id
    LEFT JOIN cancelled_events on events.id=cancelled_events.cancelled_eventId
    WHERE event_date >= ${startWeekDate.getTime()} AND event_date <= ${endWeekDate.getTime()}
    OR occurrance_start_date IS NOT NULL`;

  return new Promise(async (resolve, reject) => {
    const results = await db.executeSql(query);
    const rows = results[0].rows;
    const data = [];
    const map = new Map();

    for (let i = 0; i < rows.length; ++i) {
      data.push(rows.item(i));
    }

    if (data.length) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const id = element.id;
        const startTime = new Date(element.start_time);
        const endTime = new Date(element.end_time);
        if (!element.occurrance_start_date) {
          const eventDate = new Date(element.event_date);
          map.set(id, {
            id,
            title: element.title,
            description: element.desc,
            startDate: new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
              startTime.getHours(),
              startTime.getMinutes(),
            ),
            endDate: new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
              endTime.getHours(),
              endTime.getMinutes(),
            ),
            cancellationDates: null,
          });
        } else {
          const eventDate = new Date(element.occurrance_start_date);
          if (!map.has(id)) {
            map.set(id, {
              id,
              title: element.title,
              description: element.desc,
              startDate: new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                startTime.getHours(),
                startTime.getMinutes(),
              ),
              endDate: new Date(
                endTime.getFullYear(),
                endTime.getMonth(),
                endTime.getDate(),
                endTime.getHours(),
                endTime.getMinutes(),
              ),
              cancellationDates: element.cancellationDate
                ? [new Date(element.cancellationDate)]
                : [],
              occurDays: [element.occur_day],
            });
          } else {
            const savedItem = map.get(id);
            const newItem = {
              ...savedItem,
              cancellationDates: element.cancellationDate
                ? savedItem.cancellationDates.concat([
                    new Date(element.cancellationDate),
                  ])
                : savedItem.cancellationDates,
              occurDays: savedItem.occurDays.concat([element.occur_day]),
            };
            map.delete(id);
            map.set(id, newItem);
          }
        }
      }
    }
    const formattedData = Array.from(map, ([name, value]) => ({...value}));
    resolve(formattedData);
  });
};

//----------------------------------------------
