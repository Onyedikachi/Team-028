module.exports = {
  up: (queryInterface) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    queryInterface.bulkInsert(
      'privileges',
      [
        {
          privilegeName: 'create user',
          description: 'Any user with this privilege create users',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'assign role',
          description: 'Any user with this privilege can assign roles',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'create role',
          description: 'Any user with this privilege can create roles',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'create privilege',
          description: 'Any user with this privilege can create privileges',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'edit role privileges',
          description: 'Any user with this privilege can edit role privileges',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'create project categories',
          description: 'Any user with this privilege can create project categories',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'edit project categories',
          description: 'Any user with this privilege can edit project categories',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'approve project',
          description: 'Any user with this privilege can approve projects',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'apply for funds',
          description: 'Any user with this privilege can apply for funds',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeName: 'view reports',
          description: 'Any user with this privilege can view reports',
          dateCreated: new Date(),
          createdBy: 'ezSME',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('privileges', null, {})
};
