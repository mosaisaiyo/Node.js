/**
 * This is simple module to provide general mongoDB operations
 */
function myMongoTool() {

  const events = require('events');

  this.Url = "mongodb://localhost:27017/";
  this.MongoClient = require('mongodb').MongoClient;
  this.DBConnection = undefined;
  this.eventEmitter = new events.EventEmitter();	

  this.connectDB = function(callback) {
    if (!this.DBConnection) {
      this._regConnectCallback(this, callback);
      this._connectDB(this, this.MongoClient, this.Url, this._setConnection);      
    } else {
      callback.apply(this, arguments);
    }

  };
  
  this.isConnected = function() {
    return this.DBConnection?true:false;
  }

  this.disconnectDB = function() {
    if (this.DBConnection) this.DBConnection.close();
  }

  this.insertOne = function(insertOption, callback) {
    if (!insertOption) throw Error('insertOption is undefined!');
    if (!callback) throw Error('callback is undefined!');
    if (!typeof callback === 'function') throw Error('callback is not function!');

    var dbName = insertOption.dbName || null;
    if (!dbName) throw Error('insertOption.dbName is undefined!');
    var collection = insertOption.collection || null;
    if (!collection) throw Error('insertOption.collection is undefined!')
    var data = insertOption.data || null;
    if (!data) throw Error('insertOption.data is undefined!');

    this._insertOne(this, dbName, collection, data, callback);
  }

  this.insertMany = function(insertOption, callback) {
    if (!insertOption) throw Error('insertOption is undefined!');
    if (!callback) throw Error('callback is undefined!');
    if (!typeof callback === 'function') throw Error('callback is not function!');

    var dbName = insertOption.dbName || null;
    if (!dbName) throw Error('insertOption.dbName is undefined!');
    var collection = insertOption.collection || null;
    if (!collection) throw Error('insertOption.collection is undefined!')
    var data = insertOption.data || null;
    if (!data) throw Error('insertOption.data is undefined!');

    this._insertMany(this, dbName, collection, data, callback);
  }

  this.findRec = function(findOption, callback) {
    if (!findOption) throw Error('findOption is undefined!');
    if (!callback) throw Error('callback is undefined!');
    if (!typeof callback === 'function') throw Error('callback is not function!');

    var dbName = findOption.dbName || null;
    if (!dbName) throw Error('findOption.dbName is undefined!');
    var collection = findOption.collection || null;
    if (!collection) throw Error('findOption.collection is undefined!')
    var whereStr = findOption.whereStr || null;
    if (!whereStr) throw Error('findOption.whereStr is undefined!');

    this._findRec(this, dbName, collection, whereStr, callback);
  }

  this.updateRec = function(updateOption, callback) {
    if (!updateOption) throw Error('updateOption is undefined!');
    if (!callback) throw Error('callback is undefined!');
    if (!typeof callback === 'function') throw Error('callback is not function!');

    var dbName = updateOption.dbName || null;
    if (!dbName) throw Error('updateOption.dbName is undefined!');
    var collection = updateOption.collection || null;
    if (!collection) throw Error('updateOption.collection is undefined!')
    var whereStr = updateOption.whereStr || null;
    if (!whereStr) throw Error('updateOption.whereStr is undefined!');
    var updateStr = updateOption.updateStr || null;
    if (!updateStr) throw Error('updateOption.updateStr is undefined!');

    this._updateRec(this, dbName, collection, whereStr, updateStr, callback);
  }
  
  this.getInsertOption = function(dbName, collection, data) {
    return Object.create({
      dbName : dbName,
      collection : collection,
      data : data
    });
  }
  
  this.getFindOption = function(dbName, collection, whereStr) {
    return Object.create({
      dbName : dbName,
      collection : collection,
      whereStr : whereStr
    });
  }
  
  this.getUpdateOption = function(dbName, collection, whereStr, updateStr) {
    return Object.create({
      dbName : dbName,
      collection : collection,
      whereStr : whereStr,
      updateStr : updateStr
    });
  }

  // return itself back
  return this;
}

myMongoTool.prototype = {
    _regConnectCallback : function(me, callback) {
      me.eventEmitter.on('dbConnected', callback);
    },

    _setConnection : function(me, conn) {
      me.DBConnection = conn;
      me.eventEmitter.emit('dbConnected');
    },

    _connectDB : function(me, client, url, callback) {
      if (client) {
	var option = { useNewUrlParser: true };
	client.connect(url, option, function(err, dbConn) {
	  if (err) throw err;
	  console.log('mongoDB connected!');
	  callback(me, dbConn);
	});
      }
    },

    _insertOne : function(me, dbName, collection, data, callback) {

      if (me.DBConnection) {

	var dbo = me.DBConnection.db(dbName);

	dbo.collection(collection).insertOne(data, function(err, res) {
	  if (err) throw err;
	  console.log("Document insert successfully!");
	  callback(res);
	});

      } else {
	(function(client, url, DBConnection, dbName, collection, data, callback) {
	  if (client) {
	    client.connect(url, function(err, DBConnection) {
	      if (err) throw err;

	      var dbo = DBConnection.db(dbName);

	      dbo.collection(collection).insertOne(data, function(err, res) {
		if (err) throw err;
		console.log("Document insert successfully!");
		callback(res);
	      });
	    });

	  } else 
	    throw Error('Cannot get module mongodb!');
	})(me.MongoClient, me.Url, me.DBConnection, dbName, collection, data, callback);
      }

    },

    _insertMany : function(me, dbName, collection, data, callback) {

      if (me.DBConnection) {

	var dbo = me.DBConnection.db(dbName);

	dbo.collection(collection).insertMany(data, function(err, res) {
	  if (err) throw err;
	  console.log("Document insert successfully!");
	  callback(res);
	});

      } else {
	(function(client, url, DBConnection, dbName, collection, data, callback) {
	  if (client) {
	    client.connect(url, function(err, DBConnection) {
	      if (err) throw err;

	      var dbo = DBConnection.db(dbName);

	      dbo.collection(collection).insertMany(data, function(err, res) {
		if (err) throw err;
		console.log("Document insert successfully!");
		callback(res);
	      });
	    });

	  } else 
	    throw Error('Cannot get module mongodb!');
	})(me.MongoClient, me.Url, me.DBConnection, dbName, collection, data, callback);
      }

    },

    _findRec : function(me, dbName, collection, whereStr, callback) {
      if (me.DBConnection) {
	var dbo = me.DBConnection.db(dbName);
	dbo.collection(collection).find(whereStr).toArray(function(err, result) {
	  if (err) throw err; 
	  console.log('Search complete!');
	  callback(result);
	});
      } else {
	(function(client, url, DBConnection, dbName, collection, whereStr, callback) {
	  if (client) {
	    client.connect(url, function(err, DBConnection) {
	      if (err) throw err;

	      var dbo = DBConnection.db(dbName);

	      dbo.collection(collection).find(whereStr).toArray(function(err, result) {
		if (err) throw err; 
		console.log('Search complete!');
		callback(result);
	      });
	    });

	  } else 
	    throw Error('Cannot get module mongodb!');
	})(me.MongoClient, me.Url, me.DBConnection, dbName, collection, whereStr, callback);
      }
    },

    _updateRec : function(me, dbName, collection, whereStr, updateStr, callback) {
      if (me.DBConnection) {
	var dbo = me.DBConnection.db(dbName);

	dbo.collection(collection).updateMany(whereStr, updateStr, function(err, res) {
	  if (err) throw err;
	  console.log('Update complete!');
	  callback(res);
	});

      } else {
	(function(client, url, DBConnection, dbName, collection, whereStr, updateStr, callback) {
	  if (client) {
	    client.connect(url, function(err, DBConnection) {
	      if (err) throw err;

	      var dbo = DBConnection.db(dbName);

	      dbo.collection(collection).updateMany(whereStr, updateStr, function(err, res) {
		if (err) throw err;
		console.log('Update complete!');
		callback(res);
	      });
	    });

	  } else 
	    throw Error('Cannot get module mongodb!');
	})(me.MongoClient, me.Url, me.DBConnection, dbName, collection, whereStr, updateStr, callback);
      }
    }
}

module.exports = myMongoTool;