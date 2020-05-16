const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PISchema = new Schema({
  name: String,
  syntax: String,
  instructionType: String,
  inputs: [{name: String, type: String}],
  outputs: [{name: String, type: String}],
})

mongoose.connect('mongodb://localhost/local', { useUnifiedTopology: true });
const db = mongoose.connection;
db.on( 'error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
  // create model
  var ProgrammingInstruction = mongoose.model('ProgrammingInstruction', PISchema);
  
  fs.readFile('../../db/PIDb.json', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
});