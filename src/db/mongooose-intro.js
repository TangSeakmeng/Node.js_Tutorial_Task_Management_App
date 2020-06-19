const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manger-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// ---------------------------------------------------------------------------------

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     }, 
//     age: {
//         type: Number,
//         default: 18,
//         validate(value) {
//             if(value < 0)
//                 throw new Error('Age must be a positive number!')
//         }
//     },
//     email: {
//         type: String,
//         lowercase: true,
//         validate(value) {
//             if(!validator.isEmail(value)) {
//                 throw new  Error('Email is invalid!')
//             }
//         }
//     },
//     password: {
//         type: String,
//         trim: true,
//         minlength: 6,
//         validate(value) {
//             if(value.toLowerCase().includes('password'))
//                 throw new Error("Password can not contains 'password'")
//             else if(value.length < 6)
//                 throw new Error("Password's length should be greater than or equal to 6!")
//         }
//     }
// })

// const me = new User({
//     name: 'John',
//     // age: 19,
//     email: 'John@gmail.com',
//     password: 'Johnson'
// })

// me.save().then(() => {
//     console.log('Success: ' + me)
// }).catch((error) => {
//     console.log('Error: ' + error)
// })

// ---------------------------------------------------------------------------------

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        validate(value) {
            if(value == null)
                throw new Error('Completed must be true or false!')
        }
    }
})

const task = new Task({
    description: 'Learn React.Js',
    completed: false
})

task.save().then(() => {
    console.log('Success: ' + task)
}).catch((error) => {
    console.log('Error: ' + error)
})