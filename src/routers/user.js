const express = require('express')
const usermodel = require('../model/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const emailAccount = require('../emails/accounts')

const avatar = new multer({
    // dest : 'avatars',
    limits :{
        fileSize : 1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/\.(jpg|JPG|jpeg|png)$/))
        {
            return cb(new Error('Please provide image file with extension jpg/jpeg/png'))
        }

        cb(undefined,true)
    }
})

router.post('/users',async (req,res)=>{
    const user = new usermodel(req.body)
    try
    {
    await user.save()
    await emailAccount.sendWelcomeEmail(user.email,user.name)
    const token = await user.getToken()
    res.status(201).send({
        user,
        token})
    }
    catch(e)
    {
      res.status(500).send(e)
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.post('/user/login',async(req,res)=>{
    try {
        const user = await usermodel.findByCredentials(req.body.email,req.body.password)
        const token = await user.getToken()
        res.send({            
            user,
            token
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/user/logout',auth,async (req,res)=>{
   try {
       req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
       })
       
       await req.user.save()
       res.send()
   } catch (error) {
       res.status(500).send()       
   }
})

router.post('/user/logoutall',auth,async(req,res)=>{
    try{
    req.user.tokens = []
    await req.user.save()
    res.send()
    }
    catch(e)
    {
        res.status(500).send()
    }
})

router.get('/users/me',auth, async (req,res)=>{
    try {
        res.send(req.user)
    } catch (error) {
       res.status(500).send(error) 
    }
//     usermodel.find({}).then((users)=>{
//         res.send(users)
//    }).catch((e)=>{
//        res.status(500).send(e)
//    })
})

router.get('/users/:id',async (req,res)=>{

    try {
        const user = await usermodel.findById(req.params.id)
        if(!user)
        {
             return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }

//    usermodel.findById(req.params.id).then((user)=>{
//      if(!user)
//      {
//          return res.status(404).send()
//      }

//      res.send(user)
//    }).catch((e)=>{
//       res.status(500).send(e)
//    })
})

router.patch('/users/me',auth,async (req,res)=>{
    try 
    {
        console.log(req.params)
        const keys = Object.keys(req.body)
        const validUpdates = ["name","age","password","email"]
        
        const isValidUpdate = keys.every((key) => validUpdates.includes(key))

        if(!isValidUpdate)
        {
            return res.status(400).send({ 'error':'Invalid update'})
        }
        
        // const user = await usermodel.findById(req.params.id)
        //console.log(user)
        keys.forEach((update)=>{
            req.user[update] = req.body[update]
        })

        console.log(req.body)
        console.log(req.user)
        await req.user.save()

        // const user = await usermodel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user)
        // {
        //      return res.status(404).send()
        // }

        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/user/me',auth,async (req,res)=>{
    try {
        // const user = await usermodel.findByIdAndDelete(req.params.id)
        // if(!user)
        // {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        emailAccount.sendCancelEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
      res.status(500).send(error)        
    }
})

router.post('/users/me/avatar',auth,avatar.single('avatar'), async (req,res)=>{
    try {
    const buffer = await sharp(req.file.buffer).resize({width : 250,height:250}).png().toBuffer()    
    req.user.avatar = buffer
    await req.user.save()     
    res.send()
} catch (error) {
   res.status(500).send(error)        
}
},(error,req,res,next)=>{
    res.status(400).send({ error : 'Error  '+ error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
   try {
       req.user.avatar = undefined
       await req.user.save()
       res.send()
   } catch (error) {
       res.status(500).send(error)
   }
})

router.get('/users/:id/avatar',async (req,res)=> {
    try
    {
    const user = await usermodel.findById(req.params.id)
    if(!user || !user.avatar)
    {
        throw new Error()
    }

    res.set('Content-Type','image/png')
    res.send(user.avatar)
    }
    catch(e)
    {
        res.status(404).send(e)
    }
})

module.exports = router