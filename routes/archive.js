const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const usersData = require('../data/users');
const tasksData = require('../data/tasks');
const { updateTask } = require('../data/tasks');
const users = require('../data/users');
const {
  validateStringInput,
  replaceQueryStringSpaces
} = require('../inputValidation');

router.get(

    '/',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        let tasks;
        let searchTerm;
        if (req.query && req.query.searchTerm) {
            searchTerm = req.query.searchTerm;
            try {
                searchTerm = validateStringInput(searchTerm);
                tasks = await usersData.searchUsersTasks(
                    req.session.user._id,
                    searchTerm
                );
                tasks = await tasks.toArray();
            } catch (e) {
                console.log(`Error searching tasks: ${e}`);
                tasks = await usersData.getAllTasksForUser(
                    req.session.user._id
                );
            }
        } else {
            tasks = await usersData.getAllTasksForUser(req.session.user._id);
        }

        res.render('archive/archive', {
            title: 'Archive',
            user: req.session.user,
            archiveCards: tasksData.sortTasksByDate(
                tasks.filter((task) => task.status == 'Archived'),
                true
            ),
            searchTerm: searchTerm,
        });

    }
);

router.post(
  '/updateTaskStatus',
  authenticationCheckRedirect('/users/login', true),
  async (req, res) => {
    // update task with status
    const taskId = req.body.taskId;
    const updatedTask = tasksData.updateTaskStatus(taskId, req.body.status);
    if (!updatedTask) {
      // TO DO : Alert user that moving task failed
      res.status(500).redirect('/archive');
    }
  }
);

module.exports = router;
