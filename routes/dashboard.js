const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('dashboard/dashboard', {
        title: 'Dashboard',
        toDoCards: [
            {
                _id: 0,
                title: "to do card one ",
                tags: [
                    "tag 1"
                ]
            },
            {
                _id: 1,
                title: "to do cardTwo",
                tags: [
                    "tag 1",
                    "tag 2"
                ]
            },
            {
                _id: 2,
                title: "to do cardThree",
                tags: [
                    "tag 1",
                    "tag 2",
                    "tag 3"
                ]                
            }
        ],
        inProgressCards: [
            {
                _id: 3,
                title: "in progress card one",
                tags: [
                    "tag 1"
                ]
            },
            {
                _id: 4,
                title: "in progress cardTwo",
                tags: [
                    "tag 1",
                    "tag 2"
                ]
            }
        ],
        doneCards: [
            {
                _id: 5,
                title: "done card one",
                tags: [
                    "tag 1",
                    "tag 2",
                    "tag 3",
                    "tag 4" 
                ]
            },
            {
                _id: 6,
                title: "done cardTwo",
                tags: [
                    "tag 1",
                    "tag 2"
                ]
            },
            {
                _id: 7,
                title: "done cardThree",
                tags: [
                    "tag 1",
                    "tag 2",
                    "tag 3"
                ]                
            },
            {
                _id: 8,
                title: "done cardFour",
                tags: [
                    "tag 1",
                    "tag 2",
                    "tag 3",
                    "tag 4"
                ]                
            },
            {
                _id: 9,
                title: "done cardFive",
                tags: [
                    "tag 1",
                    "tag 2",
                    "tag 3",
                    "tag 5",
                    "tag 6",
                    "tag 7",
                    "tag 8" 
                ]                
            }
        ]
    });
});

module.exports = router;