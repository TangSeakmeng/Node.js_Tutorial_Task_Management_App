const express = require('express')
const Task = require ('./../model/task')
const router = new express.Router()
const auth = require('./../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.send(`insert task is failed: ${e}`)
    }
})

// router.get('/tasks', auth, async (req, res) => {
//     try {
//         await req.user.populate({
//             path: 'tasks',
//         }).execPopulate()
//         res.status(201).send(req.user.tasks)
//     } catch (e) {
//         res.send(`query tasks is failed: ${e}`)
//     }
// })

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed)
        match.completed = req.query.completed === 'true'

    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                // sort: {
                //     // createdAt: 1,
                //     completed: -1
                // }
                sort
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks) 
    } catch (e) {
        res.send(`query tasks is failed: ${e}`)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        // const task = await Task.findById(_id)

        if(!task)
            res.send('404 not found')

        res.status(201).send(task)
    } catch (e) {
        res.send(`query tasks is failed: ${e}`)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation)
        return res.send(400).send({ error: 'invalid updates!' })

    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task)
            res.send('404 not found')

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(`update task is failed: ${e}`)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })

        if(!task)
            res.send('404 not found')

        res.send(task)
    } catch (e) {
        res.status(400).send(`delete user is failed: ${e}`)
    }
})

module.exports = router