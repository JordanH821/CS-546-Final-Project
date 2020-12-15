module.exports = [
    {
        firstName: 'Jordan',
        lastName: 'Handwerger',
        email: 'jhandwer@stevens.edu',
        phone: {
            mobile: '7325937411',
            home: '7325530291',
            work: '9084232949',
        },
        password: '$2a$16$hwYeX0iSF5mj3T0CotIaHuTd/5x9dnR6UdlOrgJb7MUBx98UU4gwK',
        tasks: [
            {
                dueDate: '2021-03-01',
                priority: '1',
                title: 'Win the Westminster Dog Show',
                description: 'Train Randle and win gold at the dog show!',
                reminderDate: '2021-02-01',
                status: 'In Progress',
                tags: ['Pets'],
                subTasks: [
                    {
                        dueDate: '2021-01-11',
                        priority: '3',
                        title: 'Teach the dog how to sit',
                        description: 'Randle is poorly trained. Teaching him how to sit will be step one towards winning Westminster.',
                        reminderDate: '2021-01-09',
                        status: 'To Do',
                        tags: ['Pets'],
                        comments: [
                            {
                                datePosted: new Date('2020-01-08T09:00:00Z'),
                                comment: "Bacon helps entice Randle to sit",
                            }
                        ]
                    },
                    {
                        dueDate: '2021-01-11',
                        priority: '3',
                        title: 'Teach the dog how to roll',
                        description: 'Randle is poorly trained. Teaching him how to roll will be step one towards winning Westminster.',
                        reminderDate: '2021-01-09',
                        status: 'To Do',
                        tags: ['Pets'],
                    },
                    {
                        dueDate: '2021-01-11',
                        priority: '3',
                        title: 'Teach the dog how to speak',
                        description: 'Randle is poorly trained. Teaching him how to speak will be step one towards winning Westminster.',
                        reminderDate: '2021-01-09',
                        status: 'In Progress',
                        tags: ['Pets'],
                    },
                ]
            },
            {
                dueDate: '2021-01-09',
                priority: '3',
                title: 'Bring the dog to the park',
                description: 'Randle needs to burn some energy. Bring him to the park for a run.',
                reminderDate: '2021-01-07',
                status: 'To Do',
                tags: ['Pets', 'Exercise'],
            }
        ]
    },
    {
        firstName: 'Frank',
        lastName: 'Besson',
        email: 'fbesson@stevens.edu',
        phone: {
            mobile: '7325947211',
            home: '7325530281',
            work: '9084132949',
        },
        password: '$2a$16$.m/46z1HULoPFxQaaOfF6.Jr22S3lDqcOyKLVAFbnJ4UXyC4NMA.6',
        tasks: [
            {
                dueDate: '2021-01-07',
                priority: '1',
                title: 'Pickup Kyle from field trip',
                description: 'Kyle will be going on a trip to the zoo. Pick him up from the zoo!',
                reminderDate: '2021-01-06',
                status: 'To Do',
                tags: ['Family'],
                subTasks:[
                    {
                        dueDate: '2021-01-06',
                        priority: '1',
                        title: 'Fill the car with gas',
                        description: 'Without gas, I won\'t be able to pick Kyle up from school!',
                        reminderDate: '2021-01-05',
                        status: 'To Do',
                        tags: ['Car'],
                    }
                ],
                dependencies:['Car','Gas']
            },
            {
                dueDate: '2020-12-12',
                priority: '2',
                title: 'Help Kyle ace his CS project',
                description: 'Kyle needs a bit of help with web programming. Help him learn web programming, and ace his project!',
                reminderDate: '2020-12-02',
                status: 'Archived',
                tags: ['Kyle'],
                comments: [
                    {
                        datePosted: new Date('2020-12-06T09:00:00Z'),
                        comment: "Javascript can be strange.",
                    },
                    {
                        datePosted: new Date('2020-12-08T09:00:00Z'),
                        comment: 'CS is fun!',
                    }
                ]
            }
        ]
    },
    {
        firstName: 'Aseda',
        lastName: 'Addai-Deseh',
        email: 'aaddaideseh@stevens.edu',
        phone: {
            mobile: '8325947211',
            home: '3955302811',
            work: '8084132949',
        },
        password: '$2a$16$HUgcDGRRzSFYH/FKaW49feCClziwDqY79fTqrbsvrTCu0hZuIwg9W',
        tasks: [
            {
                dueDate: '2021-01-15',
                priority: '2',
                title: 'Buy plant',
                description: 'Purchase a Hydrangea!',
                reminderDate: '2021-01-14',
                status: 'To Do',
                tags: ['Plants', 'Home'],
                subTasks: [
                    {
                        dueDate: '2021-01-15',
                        priority: '2',
                        title: 'Water plants',
                        description: 'Hydrangeas require lots of water. Be sure to water them.',
                        reminderDate: '2021-01-14',
                        status: 'To Do',
                        tags: ['Plants', 'Home']
                    }
                ],
                comments: [
                    {
                        datePosted: new Date('2020-01-10T09:00:00Z'),
                        comment: "Hydrangeas are gorgeous plants.",
                    }
                ]
            }
        ]
    },
    {
        firstName: 'Patrick',
        lastName: 'Sommer',
        email: 'psommer@stevens.edu',
        phone: {
            mobile: '8325997211',
            home: '3955302912',
            work: '8094132949',
        },
        password: '$2a$16$QtvYDySu3Tl2ag7bpZlehOVj9wHWVfIQtG2WibNirqdahQKkDU2d6',
        tasks: [
            {
                dueDate: '2021-01-10',
                priority: '2',
                title: 'Clean the attic',
                description: 'The attic hasn\'t been cleaned in years. It\'s scary, but it must be cleaned.',
                reminderDate: '2021-01-09',
                status: 'To Do',
                tags: ['Home'],
                dependencies: ['Broom','Duster','Vacuum']
            },
            {
                dueDate: '2021-01-25',
                priority: '1',
                title: 'Get Dad a birthday present',
                description: 'Dad\'s birthday is coming up. Make sure to get him something good!',
                reminderDate: '2021-01-24',
                status: 'Done',
                tags: ['Family'],
            },
            {
                dueDate: '2020-12-12',
                priority: '1',
                title: 'Mow the lawn',
                description: 'The grass has become too long. It must be shortened.',
                reminderDate: '2020-12-02',
                status: 'Archived',
                tags: ['Home'],
                subTasks: [
                    {
                        dueDate: '2020-12-10',
                        priority: '1',
                        title: 'Fill the lawnmower with gas',
                        description: 'Without gas, I won\'t be able to mow the lawn!',
                        reminderDate: '2020-12-09',
                        status: 'To Do',
                        tags: ['Chore']
                    }
                ]
            }
        ]
    },
    {
        firstName: 'Max',
        lastName: 'Schwartz',
        email: 'mschwartz@stevens.edu',
        phone: {
            mobile: '8325997216',
            home: '3955402911',
            work: '8093132949',
        },
        password: '$2a$16$egP609RvO3HNPmzVly5eU..EEDAaLz57ekht0xmDKa5sxFqNfvtwa',
        tasks: [
            {
                dueDate: '2020-12-12',
                priority: '1',
                title: 'Do 10 push ups',
                description: 'Time to get strong. Do some pushups.',
                reminderDate: '2020-12-02',
                status: 'Archived',
                tags: ['Exercise'],
                dependencies: ['Warmup']
            },
            {
                dueDate: '2020-12-12',
                priority: '2',
                title: 'Take the garbage out',
                description: 'The garbage smells. Take it out.',
                reminderDate: '2020-12-02',
                status: 'Archived',
                tags: ['Home'],
                comments: [
                    {
                        datePosted: new Date('2020-12-10T09:00:00Z'),
                        comment: "Never let the garbage sit for this long again",
                    }
                ]
            },
            {
                dueDate: '2020-12-12',
                priority: '3',
                title: 'Make the bed',
                description: 'This will help make the bedroom look nicer.',
                reminderDate: '2020-12-02',
                status: 'Archived',
                tags: ['Home'],
            }
        ]
    },
];
