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
        password:
            '$2a$16$hwYeX0iSF5mj3T0CotIaHuTd/5x9dnR6UdlOrgJb7MUBx98UU4gwK',
        tasks: [
            {
                dueDate: '2021-01-09',
                priority: '3',
                title: 'Bring the dog to the park',
                description:
                    'Randle needs to burn some energy. Bring him to the park for a run.',
                reminderDate: '2021-01-07',
                status: 'To Do',
                tags: ['Pets', 'Exercise'],
                subtasks: ['Get Randle in the car'],
                dependencies: [],
                comments: [
                    {
                        datePosted: '2020-12-14',
                        comment:"Remember to bring the frisbee!!"
                    }
                ]
            },
            {
                dueDate: '2021-01-08',
                priority: '1',
                title: 'Fix the lawnmower',
                description:
                    'The lawnmower does not start. Bring it to the mechanic.',
                reminderDate: '2021-01-06',
                status: 'To Do',
                tags: ['Lawn', 'Repairs'],
                subtasks: ['Try putting gas in it first'],
                dependencies: [],
            },
            {
                dueDate: '2020-12-24',
                priority: '1',
                title: 'Bake cookies for Santa.',
                description:
                    'Santa needs needs cookies or he will not give presents!',
                reminderDate: '2020-12-23',
                status: 'To Do',
                tags: ['Holiday', 'Cooking'],
                subtasks: ['Buy cookies from the store', 'Preheat the oven'],
                dependencies: [],
            },
            {
                dueDate: '2020-12-29',
                priority: '1',
                title: 'Win the Westminster Dog Show',
                description: 'Train Randle and win gold at the dog show!',
                reminderDate: '2020-12-25',
                status: 'In Progress',
                tags: ['Pets', 'Contests'],
                subtasks: ['Buy dog treats at the store'],
                dependencies: [],
            },
            {
                dueDate: '2020-12-18',
                priority: '1',
                title: 'New roof quote',
                description:
                    'The roof is leaking in the upstairs bedroom. Call a contractor to get a quote.',
                reminderDate: '2020-12-14',
                status: 'In Progress',
                tags: ['Home', 'Repairs'],
                subtasks: [],
                dependencies: [],
            },
            {
                dueDate: '2020-12-18',
                priority: '1',
                title: 'Clean the basement',
                description: 'The basement before the holiday party.',
                reminderDate: '2020-12-14',
                status: 'Done',
                tags: ['Home', 'Cleaning'],
                subtasks: [],
                dependencies: [],
            },
            {
                dueDate: '2020-12-01',
                priority: '1',
                title: 'Holiday party supplies',
                description: 'Buy supplies for the holiday party.',
                reminderDate: '2020-11-29',
                status: 'Archived',
                tags: ['Party', 'Holiday'],
                subtasks: ['Buy plates', 'Buy cups', 'Buy napkins'],
                dependencies: [],
            },
            {
                dueDate: '2020-11-04',
                priority: '1',
                title: 'Buy leaf blower',
                description:
                    'All the leaves are falling and we need a leaf blower.',
                reminderDate: '2020-11-03',
                status: 'Archived',
                tags: ['Lawn'],
                subtasks: ['Rob a bank for money'],
                dependencies: [],
            },
            {
                dueDate: '2020-10-29',
                priority: '1',
                title: 'Halloween costumes',
                description:
                    'The kids need halloween costumes. So does the dog.',
                reminderDate: '2020-10-27',
                status: 'Archived',
                tags: ['Lawn'],
                subtasks: ['Get crafting supplies out of the basement'],
                dependencies: [],
            },
        ],
    },
];
