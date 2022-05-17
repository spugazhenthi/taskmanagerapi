require('../src/db/mongoose')
const user = require('../src/model/user')
const usermodel = require('../src/model/user')

// usermodel.findByIdAndUpdate('626fbfe915f52984d766797d',{age : 30}).then((user)=>{
//     return usermodel.countDocuments({age : 30})
// }).then((sum)=>{
//    console.log(sum)
// }).catch((e)=>{
//    console.log(e)
// })


const getCount = async ()=>{
   const updatedUser = await usermodel.findByIdAndUpdate('627113d346a6f455707dc4f7',{age : 30})
   console.log(updatedUser)
   return await user.countDocuments({age : 30}) 
}

getCount().then((number)=>{
   console.log(number)
}).catch((e)=>{
   console.log(e)
})