const express = require('express')
const app = express()
require('./db/mongoose')
const usermodel = require('./model/user')
const taskmodel = require('./model/task')
const { ObjectId } = require('mongodb')
const router = require('./routers/user')
const taskrouter = require('./routers/task')

// const port = process.env.PORT

// app.use((req,res,next)=>{
//     res.status(503).send('The services are unavailable')
// })

app.use(express.json())
app.use(router)
app.use(taskrouter)

// const multer = require('multer')
// const upload = new multer({
//     dest : 'images',
//     limits : {
//         fileSize : 1000000,
//     },
//     fileFilter(req,file,cb)
//     {
//         if(!file.originalname.match(/\.(doc|docx)$/))
//             return cb(new Error('Please provide work document'))
        
//         cb(undefined,true)
//     }
// })

// const middleware = (req,res,next)=> {
//    throw new Error('This is from middleware')
// }

// app.post('/upload',upload.single('upload'),(req,res)=>{
//    res.send()
// },(error,req,res,next)=>{
//    res.status(400).send('Error  '+ error.message)
// })

// app.listen(port,()=>{  
//     console.log('Server is up and running on port' + port)
// })

// const jsonwebtoken = require('jsonwebtoken')

// const myFunction = async ()=>{
//    const token = jsonwebtoken.sign({_id:'test123'},'test',{expiresIn:'7 days'})
//    console.log(token)

//    const isValid = jsonwebtoken.verify(token,"test")
//    console.log(isValid)
// }

// myFunction()


const task = require('../src/model/task')
const usermodel1 = require('../src/model/user')

const main = async ()=>{
    //    const matchingtask = await task.findById('62766370672390e6714172f8')
    //    await matchingtask.populate('owner')
    //    console.log(matchingtask.owner)

    //  const user = await usermodel1.findById('6273c4be494b40cd6aa7b995')
    //  await user.populate('tasks')
    //  console.log(user.tasks)
    

}

main()

module.exports = app