var express = require('express')
  , MongoClient = require('mongodb').MongoClient
  , fs = require('fs')
  , Promise = require('promise')

// mock for heroku
if( typeof process == 'undefined' )
    var process = JSON.parse( fs.readFileSync('./mock_process.json') )


var Mongo = {
    connect : function(){
        return new Promise(function(resolve, reject){
            var that = this
            console.log( process.env.MONGOLAB_URI )
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
    console.log(event)
    //Mongo.insert( event )
    res.status(200).send()
})
app.listen.bind(app, 80)()
/*
Mongo.connect()
.then( app.listen.bind(app, 80) )
.then( null, console.log.bind(console) )*/
