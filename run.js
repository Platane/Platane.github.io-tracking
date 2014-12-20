var express = require('express')
  , MongoClient = require('mongodb').MongoClient
  , fs = require('fs')
  , Promise = require('promise')


// set up mongo

console.log('grab mogoDB configuration')

var mongo_connf = JSON.parse( fs.readFileSync('./mongoDB_conf.json') )

console.log( mongo_connf )

var composeMongoDBurl = function( conf ){
    // TODO multiple host/port
    return 'mongodb://'+conf.user+':'+conf.pass+'@'+conf.host+':'+conf.port+'/'+conf.database
}

var mongo_url = composeMongoDBurl( mongo_connf )
var mongoDB

console.log( mongo_url )

var Mongo = {
    connect : function(){
        return new Promise(function(resolve, reject){
            var that = this
            MongoClient.connect(mongo_url, function(err, db) {
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
                [
                    {
                        eventName: eventName,
                        date: date || Date.now(),
                    },
                ],
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

Mongo.connect()
.then( app.listen.bind(app, 80) )
.then( null, console.log.bind(console) )
