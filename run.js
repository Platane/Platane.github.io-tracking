var express = require('express')
  , MongoClient = require('mongodb').MongoClient
  , Promise = require('promise')


var Mongo = {
    connect : function(){
        return new Promise(function(resolve, reject){
            var that = this
            MongoClient.connect( process.env.MONGOLAB_URI, function(err, db) {
                if( err )
                    reject( err )
                else {
                    that.db = db
                    resolve( that )
                }
            });
        })
    },
    insertEvent : function(eventName, date){
        return new Promise(function(resolve, reject){
            var collection = this.db.collection('events')

            collection.insert(
                {
                    eventName: eventName,
                    date: date || Date.now(),
                },
                function(err, result) {
                    if( err )
                        reject( err )
                    else
                        resolve( result )
                }
            );
        })
    },
    close : function(){
        if( this.db )
            this.db.close()
        this.db = null
    }
}




// set up express routing

var app = express()

app.get(/^\/tracking\/(\w+)\.png$/, function(req, res){
    var event = req.params[0]
    Mongo.insert( event )
    res.status(200).send()
})

console.log('starting ...')

Mongo.connect()
.then( app.listen.bind(app, process.env.PORT || 80) )
.then( null, console.log.bind(console) )
