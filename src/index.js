const express = require('express')
require('./db/mongooose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const Task = require('./model/task')
const User = require('./model/user')

const app = express()
const port = process.env.PORT

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        
        // if(!file.originalname.endsWith('.jpg')) {
        //     cb(new Error('File must be a .jpg'))
        // }

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            cb(new Error('File must be a .jpg'))

        cb(undefined, true)
    }
})

//----------------------------------------------------------------------------------------------

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

//----------------------------------------------------------------------------------------------

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send("upload sucessfully!")
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//----------------------------------------------------------------------------------------------

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`server is starting at port ${port}.`)
})