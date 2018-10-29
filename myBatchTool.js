/**
 * This is simple module to implement batch operations
 */

function myBatchTool() {

  this.batchList = [];
  this.batchNum = 0;

  this.initialize = function() {
    this.batchList = [];
    this.batchNum = 0;
  }

  this.batchFinalize = function() {

  }

  this._batchComplete = function(me,id) {
    for(var i=0;i<me.batchList.length;i++) {
      if (me.batchList[i].id===id) {
	me.batchList[i].complete = true;
      }

      if (!me.batchList[i].complete) return false;
    }

    me.batchFinalize();
  }

  this.regBatch = function() {
    var f = {};
    this.batchList.push(f);
    f.id = 'batch-'+this.batchList.length;
    f.me = this;
    f.complete = false;
    f.execBody = function() {};
    f.callback = function() {
      f.execBody.apply(f.me, arguments);
      f.me._batchComplete(f.me, f.id);
    };
    return f;
  }
  
  this.addBatchTask = function(taskBody, taskComplete) {
    if (!typeof taskBody==='function') throw TypeError('taskBody is not function!');
        
    var f = {};
    this.batchList.push(f);
    f.id = 'batch-'+this.batchList.length;
    f.me = this;
    f.complete = false;
    f.callback = function() {
      f.me._batchComplete(f.me, f.id);
    };
    taskComplete = f.callback;
  }

  return this;
}

module.exports = myBatchTool;