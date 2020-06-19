const express = require('express')
const User = require('./../model/user')
const auth = require('./../middleware/auth')
const router = new express.Router()
const sharp = require('sharp')

// const { sendWelcomeEmail } = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        // sendWelcomeEmail(user.email, user.username)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(`add user is failed: ${e}`)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch (e) {
        res.send(`Error: ${e}`)
    }
})

router.post('/users/signup', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch (e) {
        res.send(`Error: ${e}`)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(400).send(`get user is failed: ${e}`)
    }
})

router.get('/users/:id', async (req, res) => {
    console.log(req.params)
    const _id = req.params.id

    try {
        const users = await User.findById(_id)
        if(!users)
            res.send('404 not found')

        res.status(201).send(users)
    } catch (e) {
        res.status(500).send(`get user is failed: ${e}`)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation)
        return res.send(400).send({ error: 'invalid updates!' })

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(201).send(req.user)
    } catch (e) {
        res.status(400).send(`update user is failed: ${e}`)
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(`delete user is failed: ${e}`)
    }
})

const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            cb(new Error('File must be a .jpg'))

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, heigh: 250 }).png().toBuffer()
    req.user.avatar = buffer
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send("upload sucessfully!")
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send("delete sucessfully!")
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar)
            throw new Error()

        // res.set('Content-Type', 'application/json')
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send({ error: e })
    }
})

module.exports = router