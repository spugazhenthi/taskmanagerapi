const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user')
const {testUser,userObjectID,setupDataBase} = require('../tests/fixtures/db')

beforeEach(setupDataBase)

// afterEach(()=>{
//     console.log('after Each')
// })

test('Should sign up new user',async ()=>{
    const response = await request(app).post('/users').send({
        name : 'pugazh',
        email : 'pugazhgym123@gmail.com',
        password : 'test@12345'
    }).expect(201)

    // Assert that database was saved correctly
    const matchinguser = await User.findById(response.body.user._id)
    expect(matchinguser).not.toBeNull()

    // Assert about object matching

    expect(response.body).toMatchObject({
        user : {
            name : 'pugazh',
            email : 'pugazhgym123@gmail.com',
        },
        token : matchinguser.tokens[0].token
    })

    // Assert raw password is not saved in database
    expect(matchinguser.password).not.toBe('test@12345')
})

test('Should login with existing user',async ()=>{
    const response = await request(app).post('/user/login').send({
        email : testUser.email,
        password : testUser.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login with non existent user',async ()=>{
    await request(app).post('/user/login').send({
        email : "test123",
        password : testUser.password
    }).expect(400)
})

test('Should get profile for the user',async ()=>{
    await request(app).get('/users/me')
                      .set('Authorization',testUser.tokens[0].token)
                      .send()
                      .expect(200)
})

test('Should not get profile for unauthorized user',async ()=>{
    await request(app).get('/users/me')
                      .send()
                      .expect(401)
})

test('Should delete account for the user',async ()=>{
    const response = await request(app).delete('/user/me')
                      .set("Authorization",testUser.tokens[0].token)
                      .send()
                      .expect(200)

    const user = await User.findById(testUser._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthorized user',async ()=>{
    await request(app).delete('/user/me')
                      .send()
                      .expect(401)
})

test('Should upload avatar image',async ()=>{
    await request(app)
         .post('/users/me/avatar')
         .set("Authorization",testUser.tokens[0].token)
         .attach('avatar', 'tests/fixtures/download.png')
         .expect(200)
    const user = await User.findById(testUser._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields',async()=>{
    await request(app)
          .patch('/users/me')
          .set('Authorization',testUser.tokens[0].token)
          .send({
              name : "this is test"
          }).expect(200)
     
    const user = await User.findById(testUser._id)
    expect(user.name).toBe('this is test') 
})

test('Should not update invalid user fields',async ()=>{
    await request(app).patch('/users/me')
                      .set('Authorization',testUser.tokens[0].token)
                      .send({
                          location : 'This is failed'
                      })
                      .expect(400)
})