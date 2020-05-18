/** requires and dependencies */
const MongoClient = require('mongodb').MongoClient;

/** Constants */
const url = 'mongodb://localhost/local'
const dbName = 'local'; // Database name
const collectionName = 'instructions'; // Collection Name
 
/** Class definition */
class StageAccessor {
  /** Constructor */
  constructor(){
    // Create a new MongoClient
    this._client = new MongoClient(url, { useUnifiedTopology: true });
  }

  /** Public methods */
  getStage(number, callback){
    this._client.connect(function(err,res) {
      if(err){
        throw err;
      }
      else{
        const collection = res.db(dbName).collection(collectionName);
        collection.findOne({'number': number},function(err, doc) {
          if(err){
            throw err;
          }
          else{
            if(doc && (typeof doc == 'object')){
              callback(null,doc);
            }
            else{
              callback(new Error('stage not found'));
            }
          }
        });
      }
    });
  }

  getWaypoint(stage, number, callback){
    this._client.connect(function(err,res) {
      if(err){
        throw err;
      }
      else{
        const collection = res.db(dbName).collection(collectionName);
        collection.findOne({'number':stage,},function(err, doc) {
          if(err){
            throw err;
          }
          else{
            if(doc && (typeof doc == 'object') && (doc.hasOwnProperty('waypoints'))){
              const waypoints = doc.waypoints;
              let found = false;
              for(const waypoint of waypoints){
                  if(waypoint.number === number){
                    found = true;
                    callback(null,waypoint);
                    break;
                  }
              }

              if(!found){
                callback(new Error('waypoint not found'));
              }
            }
            else{
              callback(new Error('stage not found'));
            }
          }
        });
      }
    });
  }

  getTotalDistance(callback){
    this._client.connect(function(err,res) {
      if(err){
        throw err;
      }
      else{
        const collection = res.db(dbName).collection(collectionName);
        collection.find({}).toArray(function(err, docs) {
          if(err){
            throw err;
          }
          else{
            if(docs && (typeof docs === 'object')){
              let totalDistance = {
                distance:0
              };

              for(const stage of docs){
                if(stage.hasOwnProperty('distance')){
                  totalDistance.distance = totalDistance.distance + Number(stage.distance);
                }
              }
              
              callback(null,totalDistance);
            }
            else{
              callback(new Error('stages not found'));
            }
          }
        });
      }
    });
  }

  /** Private methods */
  _connect(){
    this._client.connect(function(err) {
      if(err){
        console.log(err);
      }
      else{
        console.log('Connected successfully to server');
        this._collection = this._client.db(dbName).collection(collectionName);
      }
    });
  }
}

module.exports = StageAccessor;




