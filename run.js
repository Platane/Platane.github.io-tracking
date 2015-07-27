var express = require('express')
  , MongoClient = require('mongodb').MongoClient
  , Promise = require('promise')
  , path = require('path')


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
    getEvents : function(options){


        var query = {}

        if ( options.startDate )
          (query.date = query.date || {} )[ '$gte' ] = 0|options.startDate

        if ( options.endDate )
          (query.date = query.date || {} )[ '$lte' ] = 0|options.endDate

        if ( options.eventName )
          query.eventName = options.eventName


        var dbOptions = {sort: ['date','asc'] }

        return new Promise(function(resolve, reject){

            var collection = this.db.collection('events')
            collection.find( query, dbOptions, function( err, cursor ){

                if( err )
                    return reject( err )

                var res = {}

                cursor.each( function( err, doc ){

                    if ( err )
                        return reject( err )

                    if ( !doc )
                        return resolve( res )

                    ;( res[ doc.eventName ] = res[ doc.eventName ] || [] ).push( doc.date )
                })
            })
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

// insert event route
app.get(/^\/tracking\/([0-9A-z_-]+)\.png$/, function(req, res){
    var event = req.params[0]
    Mongo.insertEvent( event )
    res.status(200).send()
})

// get stats route
app.get('/events', function(req, res){

    Mongo.getEvents(req.query || {})

    .then( function( result ){
        res.status(200).send( result )
    })
    .catch( function( err ){
        res.status(500).send( err )
    })

})

// static file serving
app.get('/script.js', function(req, res) {
    res.sendFile('script.js', {root: path.join(__dirname, 'front-dist') })
})
app.get('/script.js.map', function(req, res) {
    res.sendFile('script.js.map', {root: path.join(__dirname, 'front-dist') })
})
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, 'front-src') })
})



console.log('connect to mongoDB...')

Mongo.connect()
.then( function(){

    console.log('starting server...')

    app.listen( process.env.PORT || 80)
})
.then( null, console.log.bind(console) )
