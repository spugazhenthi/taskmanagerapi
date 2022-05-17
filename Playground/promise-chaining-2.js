require('../src/db/mongoose')

const taskmodel = require('../src/model/task')

// taskmodel.findByIdAndRemove('626fc5268d40e3580a63ea6c').then((task)=>{
//     return taskmodel.countDocuments({completed : false})  
// }).then((sum)=>{
//    console.log(sum)
// }).catch((e)=>{
//     console.log(e)
// })


const deleteTaskAndCount = async(id)=>{
   const documentToBeDeleted = await taskmodel.findByIdAndDelete(id)
   return await taskmodel.countDocuments({completed : false})
}

deleteTaskAndCount('62714e8582213d3de718711e').then((result)=>{
  console.log(result)
}).catch((e)=>{
  console.log(e)
})