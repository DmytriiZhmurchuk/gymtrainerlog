import {openDatabase} from 'react-native-sqlite-storage';

export const openDBConnection = async () => {
  return openDatabase({name: 'GymTrainerLog.db', location: 'default'});
};

export const closeDbConnection = async db => {
  return db.close();
};

export const createTables = async db => {
  const enableForeignKeys = 'PRAGMA foreign_keys = ON;';
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
        FOREIGN KEY (clientId) REFERENCES Clients(clientId) ON DELETE CASCADE
    );`;

  const queryActivities = `CREATE TABLE IF NOT EXISTS LogActivities(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR NOT NULL,
      count INTEGER,
      weight VARCHAR,
      time VARCHAR,
      logId INTEGER NOT NULL,
      date DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
      FOREIGN KEY (logId) REFERENCES Logs(logId) ON DELETE CASCADE
  );`;

  db.transaction(async tx => {
    // tx.executeSql('DROP TABLE Logs');
    tx.executeSql(enableForeignKeys);
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
  const query = 'SELECT * FROM Clients ORDER BY firstName LIMIT ? OFFSET ?';
  return db.executeSql(query, [pageSize, startIndex]);
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
  const query =
    'SELECT * FROM Logs WHERE clientId=? ORDER BY date DESC LIMIT ? OFFSET ?';
  return db.executeSql(query, [clientId, pageSize, startIndex]);
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
  const query =
    'SELECT * FROM LogActivities WHERE logId=? ORDER BY date DESC LIMIT ? OFFSET ?';
  return db.executeSql(query, [logId, pageSize, startIndex]);
};

export const getLogRecordById = async (id, db) => {
  const query = 'SELECT * FROM LogActivities WHERE id=?';
  return db.executeSql(query, [id]);
};

export const createLog = async (log, db) => {
  const query = 'INSERT INTO Logs(title,clientId) VALUES(?,?);';
  return db.executeSql(query, [log.title, log.clientId]);
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
