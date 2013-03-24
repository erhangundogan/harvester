var settings   = require("../settings"),
    Mongoose   = exports.Mongoose = require("mongoose"),
    Mongodb    = require("mongoose/node_modules/mongodb"),
    Schema     = exports.Schema = Mongoose.Schema,
    ObjectId   = exports.ObjectId = Schema.ObjectId,
    Mixed      = Mongoose.Schema.Types.Mixed,
    ObjectID   = require("mongoose/node_modules/mongodb/lib/mongodb/bson/bson").ObjectID,
    Connection = exports.Connection = Mongoose.createConnection(settings.mongodb_connection);

var SearchSchema = new Schema({
  "proxy": String,
  "address": String,
  "time": Date,
  "duration": Number,
  "success": {type:Boolean, default:false},
  "status_code": {type:Number, default:0},
  "error": String,
  "body_length": {type:Number, default:0},
  "method": {type:String, default:"HEAD"},
  "headers": Mixed
});

var Search = exports.Search = Connection.model("search", SearchSchema);