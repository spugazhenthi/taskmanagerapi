const Mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/model/user')
const Task = require('../../src/model/task')

const userObjectID = Mongoose.Types.ObjectId()
const testUser = {
    _id : userObjectID,
    name : 'testUser',
    email : 'test123@gmail.com',
    password : 'test@123456',
    tokens : [{
        token : jwt.sign({_id : userObjectID},process.env.JWT_SECRET)
    }]
}

const user2ObjectID = Mongoose.Types.ObjectId()
const testUser2 = {
    _id : user2ObjectID,
    name : 'testUser2',
    email : 'test123456@gmail.com',
    password : 'test@123456789',
    tokens : [{
        token : jwt.sign({_id : user2ObjectID},process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : Mongoose.Types.ObjectId(),
    description : 'This is task one',
    completed : false,
    owner : testUser._id
}

const taskTwo = {
    _id : Mongoose.Types.ObjectId(),
    description : 'This is task two',
    completed : false,
    owner : testUser._id
}

const taskThree = {
    _id : Mongoose.Types.ObjectId(),
    description : 'This is task three',
    completed : true,
    owner : testUser2._id
}

const setupDataBase = async ()=> {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUser).save()
    await new User(testUser2).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userObjectID,
    testUser,
    setupDataBase,
    testUser2,
    taskOne
}