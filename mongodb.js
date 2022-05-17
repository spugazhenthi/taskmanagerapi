// CRUD oprtation

const { MongoClient,ObjectId} = require('mongodb')

const connectionURL = process.env.MONGODB_URL;

const databaseName = "task-manager"

// const id = new ObjectId()

// console.log(id)

// console.log(id.getTimestamp())

MongoClient.connect(connectionURL,{UseNewUrlparser : true},(error,client)=>{
   
    if(error)
    {
        return console.log('Unable to connect to database')
    }


    // client.db(databaseName).collection('users').insertOne({
    //     name : 'pugazhenthi',
    //     age : 32
    // },(error,result)=>{
    //     if(error)
    //     {
    //         return console.log('Unable to insert user')
    //     }

    //     console.log(result)
    // })

    // const docs = [
    //     {name : 'gowtham',age : 31},
    //     {name:'shreyas',age:29}
    // ]

    // client.db(databaseName).collection('users').insertMany(docs,(error,result)=>{
    //     if(error)
    //     {
    //         return console.log('Unable to insert users')
    //     }

    //     console.log(result);
    // })
    

    //  client.db(databaseName).collection('tasks').insertMany([
    //      {description : 'This is first task',completed : true},
    //      {description : 'This is second task',completed : false}
    //     ],(error,result)=>{
    //        if(error)
    //        {
    //            return console.log('Unable to insert documents into collection')
    //        }

    //        console.log(result)
    //     })


    // client.db(databaseName).collection('users').findOne({_id: new ObjectId('626e5ec9a8a81f3cd3915537')},(error,user)=>{
    //     if(error)
    //     {
    //         return console.log('Unable to fetch the user')
    //     }

    //     console.log(user)

    // })
    
    // const userCursor = client.db(databaseName).collection('users').find({name : 'pugazhenthi'})

    // userCursor.toArray((error,doc)=>{
    //     console.log(doc)
    // })

    // client.db(databaseName).collection('users').countDocuments({name : 'pugazhenthi'},(error,result)=>{
    //     console.log('Total matching documents in collection ' + result)
    // })
    
    // client.db(databaseName).collection('tasks').findOne({_id: new ObjectId('626e7c6684abc356a7ba53ef')},(error,result)=>{
    //     if(error)
    //     {
    //         return console.log('unable to read')
    //     }

    //     console.log(result)
    // })

    // client.db(databaseName).collection('tasks').find({completed : false}).toArray((error,result) =>{
    //     if(error)
    //     {
    //         return console.log('unable to read')
    //     }
        
    //     console.log(result)
    // })
    
    // client.db(databaseName).collection('users').updateOne(
    //     {_id : new ObjectId('626e6083897ca53513f04a7b')},
    //     { $set : { age : 30 }}).
    //     then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // client.db(databaseName).collection('tasks').updateMany(
    //     {completed : false},
    //     {$set:{ completed : true }}
    // ).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    client.db(databaseName).collection('users').deleteMany({name : 'pugazhenthi'}).then((result)=>{
         console.log(result)
    }).catch((error)=>{
         console.log(error)
    })
    

    console.log('Connected Successfully !!! ')
})
