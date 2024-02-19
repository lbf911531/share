

export default function openDb(dbName = 'demo', version = 1) {
  return new Promise((resolve, reject) => {
    let db;

    const request = window.indexedDB.open(dbName, version);
    // 数据库发生修改时，触发
    request.onupgradeneeded = (evt) => {
      console.log('onupgradeneeded');
      db = evt.target.result;

      const store = db.createObjectStore('user', {
        keyPath: 'id', // 主键
        autoIncrement: true, // 自增 
      });

      store.createIndex('name', 'name', { unique: false });
      store.createIndex('age', 'age', { unique: false });
    };

    request.onsuccess = evt => {
      db = evt.target.result;
      resolve(db);
    };

    request.onerror = error => {
      console.log('indexedDb:', error);
      reject(error);
    }
  });
}