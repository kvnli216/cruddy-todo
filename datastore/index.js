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

// exports.readAll = (callback) => {
//   var data = [];
//   fs.readdir(exports.dataDir, (err, files) => {
//     for (let i = 0; i < files.length; i++) {
//       console.log(files, typeof files);
//       let tempFile = {
//         id: files[i].split('.')[0],
//         text: files[i].split('.')[0]
//       };
//       data.push(tempFile);
//     }
//     callback(null, data);
//   });
// };
let readdirAsync = Promise.promisify(fs.readdir);
let readFileAsync = Promise.promisify(fs.readFile);
// exports.dataDir + '/' + id + '.txt', (err, fileData)
exports.readAll = (callback) => {
  readdirAsync(exports.dataDir)
    .then(files => {
      var promiseArr = [];
      if (files.length === 0) {
        return [];
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
          console.log(typeof values, values, 'inside promise all');
          return values;
        });
      // for (let i = 0; i < files.length; i++) {
      //   debugger;
      //   readFileAsync(exports.dataDir + '/' + files[i])
      // .then(fileData => {
      //   let tempFile = {
      //     id: files[i].split('.')[0],
      //     text: fileData.toString()
      //   };
      //   data.push(tempFile);
      //   // callback(null, data);
      //   // console.log(data);
      //   // return (data)
      // })
      //     .catch(err => err);
      // }
    });
};
//     , (err, files) => {
//     for (let i = 0; i < files.length; i++) {
//       console.log(files, typeof files);
//       // to Jacky:
//       // run exports.readOne on each file

//       let tempFile = {
//         id: files[i].split('.')[0],
//         text: files[i].split('.')[0]
//       };
//       data.push(tempFile);
//     }
//     callback(null, data);
//   });
// };

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
