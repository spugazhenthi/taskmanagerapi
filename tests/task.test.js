const request = require('supertest')
const app = require('../src/app')
const Task =  require('../src/model/task')
const {testUser,testUser2,userObjectID,setupDataBase,taskOne} = require('../tests/fixtures/db')

beforeEach(setupDataBase)

test('Should create task for user',async ()=>{
    const response = await request(app)
                           .post('/tasks')
                           .set('Authorization',testUser.tokens[0].token)
                           .send({
                               description : 'This is unit test'
                           })
                           .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should get all tasks for the user',async ()=>{
      const response = await request(app)
            .get('/tasks')
            .set('Authorization',testUser.tokens[0].token)
            .send()
            .expect(200)
    
     expect(response.body.length).toBe(2)
})

test('Should not delete other user task',async ()=>{
    await request(app)
          .delete('/task')
          .set('Authorization',testUser2.tokens[0].token)
          .query({id : taskOne._id})
          .send()
          .expect(404)
    
     const task = Task.findById(taskOne._id)
     expect(task).not.toBeNull()
})