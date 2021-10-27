import {openDatabase} from 'react-native-sqlite-storage';

export const openDBConnection = async () => {
  return openDatabase({name: 'GymTrainerLog.db', location: 'default'});
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

  const queryExercise = `CREATE TABLE IF NOT EXISTS Exercises(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL
    );`;

  db.transaction(async tx => {
    tx.executeSql(query);
    tx.executeSql(queryExercise);
  });
};

export const createClient = async (client, db) => {
  const query =
    'INSERT INTO Clients(firstName,lastName,extraNotes) VALUES(?,?,?);';
  db.executeSql(query, [client.firstName, client.lastName, client.extraNotes]);
};

// export const updateClientById = async (client, db) => {
//   const query = `UPDATE Clients SET firstName=?,lastName=?,extraNotes=1) WHERE id=${client.id}`;
//   return db.transaction(async tx => {
//     await tx.executeSql(query, [
//       client.firstName,
//       client.lastName,
//       client.extraNotes,
//     ]);
//   });
// };

export const getAllClients = async (db, pageSize = 15, startIndex = 0) => {
  const query = 'SELECT * FROM Clients ORDER BY firstName LIMIT ? OFFSET ?';
  return db.executeSql(query, [pageSize, startIndex]);
};

export const getClientByFirstLastName = async (client, db) => {
  const query = 'SELECT * FROM Clients WHERE firstName=? AND lastName=?';
  return db.executeSql(query, [client.firstName, client.lastName]);

};

// export const createExercise = async (exercise, db) => {
//   const query = 'INSERT INTO Exercises(title) VALUES(?)';
//   return db.transaction(async tx => {
//     await tx.executeSql(query, [exercise.title]);
//   });
// };

// export const getAllExecrcises = async db => {
//   const query = 'SELECT * FROM Exercises';
//   return db.transaction(async tx => {
//     await tx.executeSql(query);
//   });
// };
