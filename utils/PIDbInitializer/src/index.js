const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'instruction';
const collectionName = modelName+'s';

const PISchema = new Schema({
  name: String,
  syntax: String,
  instructionType: String,
  inputs: [{name: String, type: String}],
  outputs: [{name: String, type: String}],
})

mongoose.connect('mongodb://localhost/local', { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on( 'error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  // delete previous collection
  db.dropCollection(collectionName, function(err, res) {
    if (err) {
      if(err.code == 26){
        console.log('No collection deleted.');
      }
      else {
        throw err;
      }
    } else 
    {
      console.log('Collection %s deleted with success.', collectionName);
    }
    
    console.log('Initializing data...');
    // create model
    var pimodel = mongoose.model(modelName, PISchema);

    // read initial data file
    fs.readFile('../../db/PIDb.json', (err, data) => {
      if (err) throw err;
      const docs = JSON.parse(data); 
      pimodel.collection.insertMany(docs, (err,res) => {
        if (err) throw err;
        console.log(res);
        db.close();
      });
    });
  });
});