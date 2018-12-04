const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {

    // let writeMessage = { id: text };
    fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
      if (err) {
        throw ('error with creating');
      } else {
        callback(null, { id, text });
      }
    });


  });
  // items[id] = text;
  // callback(null, { id, text });
};

let readdirAsync = Promise.promisify(fs.readdir);
let readFileAsync = Promise.promisify(fs.readFile);
// exports.dataDir + '/' + id + '.txt', (err, fileData)
exports.readAll = (callback) => {
  readdirAsync(exports.dataDir)
    .then(files => {
      var promiseArr = [];
      if (files.length === 0) {
        return callback(null, []);
      }
      for (let i = 0; i < files.length; i++) {
        promiseArr.push(readFileAsync(exports.dataDir + '/' + files[i])
          .then(fileData => {
            let tempFile = {
              id: files[i].split('.')[0],
              text: fileData.toString()
            };
            return tempFile;
          })
        );
      }
      Promise.all(promiseArr)
        .then((values) => {
          callback(null, values);
        });

    });
};


exports.readOne = (id, callback) => {
  // var text = items[id];
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, fileData) => {
    if (!fileData) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: fileData.toString() });
    }
  });
};

let readOneAsync = Promise.promisify(exports.readOne);

exports.update = (id, text, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, fileData) => {
    if (!fileData) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        callback(null, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, fileData) => {
    if (!fileData) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
        callback();
      });
    }
  });

};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
