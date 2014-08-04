var CartoDB = require('./cartodb.sql');
var Projection = require('../mercator');
var Format = require('../reader/geojson');

var Provider = module.exports = function(options) {
  this._projection = new Projection();
  this.update(options);
};

var proto = Provider.prototype;

proto._debug = function(msg) {
  if (this._options.debug) {
    console.log(msg);
  }
};

proto._getUrl = function(x, y, zoom) {
  var sql = CartoDB.SQL(this._projection, this._options.table, x, y, zoom, this._options);
  this._debug(sql);
  return this._baseUrl +'?q='+ encodeURIComponent(sql) +'&format=geojson&dp=6';
};

proto.load = function(tileCoords, callback) {
  Format.load(this._getUrl(tileCoords.x, tileCoords.y, tileCoords.z), this._projection, tileCoords, callback);
};

proto.update = function(options) {
  this._options = options;
  this._baseUrl = 'http://'+ options.user +'.cartodb.com/api/v2/sql';

// this is how cdn would be handled
//  this._baseUrl = 'http://3.ashbu.cartocdn.com/' + options.user +'/api/v1/sql';

  if (this._options.ENABLE_SIMPLIFY === undefined) {
    this._options.ENABLE_SIMPLIFY = true;
  }
  if (this._options.ENABLE_SNAPPING === undefined) {
    this._options.ENABLE_SNAPPING = true;
  }
  if (this._options.ENABLE_CLIPPING === undefined) {
    this._options.ENABLE_CLIPPING = true;
  }
  if (this._options.ENABLE_FIXING === undefined) {
    this._options.ENABLE_FIXING = true;
  }
};
