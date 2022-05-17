const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const taskModel = require('../model/task')

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true
    },
    age :{
        type : Number,
        default : 0,
        validate (value)
        {
            if(value<0)
            {
                throw new Error('Age must be positive number')
            }
        }
    },
    email:{
        type:String,
        required:true,
        trim : true,
        lowercase : true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email id')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value)
        {
            if(!validator.isLength(value,{min:6,max:undefined}))
            {
                throw new Error('Password must be greater than 6 characters')
            }
            else if(value.toLowerCase().includes("password"))
            {
                throw new Error('Password should not contain keyword "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar :{
        type : Buffer
    }
},{timestamps : true})

userSchema.virtual('tasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    // console.log(userObject)
    return userObject
}

userSchema.methods.getToken = async function () {
    const currentuser = this
    const token = jwt.sign({ _id: currentuser._id.toString() }, process.env.JWT_SECRET)
    currentuser.tokens = currentuser.tokens.concat({ token })
    await currentuser.save()

    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
   const matchinguser = await user.findOne({email})
   if(!matchinguser)
   {
       throw new Error('Unable to login')
   }

   const isMatch = await bcrypt.compare(password,matchinguser.password)
   if(!isMatch)
   {
       throw new Error('Unable to login')
   }

   return matchinguser
}

userSchema.pre("save", async function(next) {
   
    const user = this
    if(user.isModified("password"))
    {
         user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await taskModel.deleteMany({owner : user._id})
    next()
})

const user = mongoose.model('User',userSchema)

module.exports = user