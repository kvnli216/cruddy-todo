const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      let tempFile = {
        id: files[i].split('.')[0],
        text: files[i].split('.')[0]
      };
      data.push(tempFile);
    }
    callback(null, data);
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


  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
