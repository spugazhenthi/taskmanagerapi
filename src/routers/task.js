const express = require('express')
const taskmodel = require('../model/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks',auth,async (req,res)=>{
    //const task = new taskmodel(req.body)
    const task = new taskmodel({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send()        
    }
    // task.save().then(()=>{
    //    res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })

})

router.get('/tasks',auth,async (req,res)=>{
    try {
        
        const match = {}
        const sort = {}
        if(req.query.completed)
        {
            match.completed = req.query.completed
        }

        if(req.query.sortby)
        {
            const sortbyvalues = req.query.sortby.split(':')
            sort[sortbyvalues[0]] = sortbyvalues[1] === 'asc' ? 1 : -1  
        }

        console.log(sort)
        await req.user.populate({
            path : "tasks",
            match,
            options:{
                limit : req.query.limit,
                skip : req.query.skip,
                sort
            }
        })

        // const tasks = await taskmodel.find({owner : req.user._id})
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
    // taskmodel.find({}).then((tasks)=>{
    //    res.send(tasks)
    // }).catch((e)=>{
    //    res.status(500).send(e)
    // })
})

router.get('/tasks/:id',auth,async (req,res)=>{
    // if(!ObjectID.isValid(req.params.id))
    // {
    //     return res.status(400).send({ error : 'Please provide valid id'})
    // }

    try {
        const task = await taskmodel.findOne({_id : req.params.id,owner : req.user._id})
         // const task = await taskmodel.findById(req.params.id)
        if(!task)
        {
            return res.status(404).send()
        }        

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
//     taskmodel.findById(req.params.id).then((task)=>{
//        if(!task)
//        {
//            return res.status(404).send()
//        }

//        res.send(task)
//    }).catch((e)=>{
//        res.status(500).send(e)
//    })
})

router.patch('/task/:id',auth,async (req,res)=>{
    try {
   const updates = Object.keys(req.body)
  const allowedUpdates = ['description',"completed"]
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  if(!isValidUpdate)
  {
      return res.status(400).send({"error":"Invalid update"})
  }
  
  console.log(req.params.id,req.user._id)

  const task = await taskmodel.findOne({_id : req.params.id,owner : req.user._id})
   console.log(task)
  if(!task)
   {
       return res.status(404).send()
   }

  updates.forEach((update)=>{
     task[update] = req.body[update]
  })

  await task.save()
  // const task = await taskmodel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
   

   res.send(task)
   
} catch (error) {
        res.status(400).send(error)
}})

router.delete('/task/:id',auth, async (req,res)=>{
    try {
        const task = await taskmodel.findOneAndDelete({_id : req.params.id,owner : req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})


module.exports= router