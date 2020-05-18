const express = require('express');
const cors = require('cors');
const piDbAccessor = require('./piDbAccessor.js');

const app = express();
app.use(cors());
const accessor = new StageAccessor();

app.get('/ping', (req, res) => res.send('pong'));

/**
 * @api {get} /stages/{number} get the stage information
 * @apiName StageService
 * @apiDescription This endpoint will get the information of a specific stage
 * @apiGroup stages
 *
 * @apiParam (params) {number} number
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" http://address:port/stages/1
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *      "number":"1",
 *      "start":{"name":"Saint John's","latitude":1.0032,"longitude":43.000},
 *      "end":{"name":"Clarenville","latitude":1.0032,"longitude":43.000},
 *      "waypoints":[
 *          {"number":0,"latitude":1.323,"longitude":43.45345},
 *          ...
 *      ]
 *   }
 */
app.get('/stages/:number', async (req, res) => {
  if(req.params.hasOwnProperty('number')) {
    const stageNumber = Number(req.params.number);

    try{
      accessor.getStage(stageNumber, function(err,stage){
        if(err){
          res.status(404).json({
            success: false,
            message: err.message
          });
        }
        else{
          res.status(200).json({
            success: true,
            data: stage
          });
        }
      });
    }
    catch(err){
      res.status(500).json({
        success: false,
        message: 'Database access error'
      });
    }
  }
  else {
    res.status(400).json({
      success: false,
      message: 'Incorrect query: expected syntax is http://address:port/stages/{stage number}'
    });
  }
});

/**
 * @api {get} /stages/{stage}/waypoint/{number} get a waypoint coordinates information
 * @apiName StageService
 * @apiDescription This endpoint will get the coordinate information of a specific waypoint
 * @apiGroup Stage
 *
 * @apiParam (params) {number} stage
 * @apiParam (params) {number} number
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" http://address:port/stages/3/waypoint/56
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *      "latitude":1.32342,
 *      "longitude":43.95453
 *   }
 */
app.get('/stages/:stage/waypoint/:number', async (req, res) => {
    if(req.params.hasOwnProperty('number') && req.params.hasOwnProperty('stage')) {
        const stageNumber = Number(req.params.stage);
        const waypointNumber = Number(req.params.number);
    
        try{
          accessor.getWaypoint(stageNumber, waypointNumber, function(err,stage){
            if(err){
              res.status(404).json({
                success: false,
                message: err.message
              });
            }
            else{
              res.status(200).json({
                success: true,
                data: stage
              });
            }
          });
        }
        catch(err){
          res.status(500).json({
            success: false,
            message: 'Database access error'
          });
        }
      }
      else {
        res.status(400).json({
          success: false,
          message: 'Incorrect query: expected syntax is http://address:port/stages/{stage number}/waypoint/{waypoint number}'
        });
      }
});

/**
 * @api {get} /totaldistance get the total distance of all stages
 * @apiName StageService
 * @apiDescription This endpoint will get the total distance of the stages in the database
 * @apiGroup stages
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" http://address:port/totaldistance
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *      "distance":203948239
 *   }
 */
app.get('/totaldistance', async (req, res) => {
  try{
    accessor.getTotalDistance(function(err,distance){
      if(err){
        res.status(404).json({
          success: false,
          message: err.message
        });
      }
      else{
        res.status(200).json({
          success: true,
          data: distance
        });
      }
    });
  }
  catch(err){
    res.status(500).json({
      success: false,
      message: 'Database access error'
    });
  }
});

app.listen(process.env.PORT, () => console.log('App listening on port '+process.env.PORT));