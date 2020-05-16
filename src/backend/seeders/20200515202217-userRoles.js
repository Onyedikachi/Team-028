module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    'roles',
    [
      {
        roleName: 'Sys Admin',
        description: 'Has full access access to all privileges except for applying for funding',
        dateCreated: new Date(),
        createdBy: 'ezSME',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Regulator Admin',
        description: 'Responsible for auditing processes within the organization',
        dateCreated: new Date(),
        createdBy: 'ezSME',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Regulator User',
        description: 'The user is given a limited number of regulator privileges',
        dateCreated: new Date(),
        createdBy: 'ezSME',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Investor Admin',
        description: 'Full access to Investor privileges',
        dateCreated: new Date(),
        createdBy: 'ezSME',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Investor User',
        description: 'The user has a limited access to Investor privileges',
        dateCreated: new Date(),
        createdBy: 'ezSME',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'SME Admin',
        description: 'Has full access to SME privileges',
        dateCreated: new Date(),
        createdBy: 'ezSME',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'SME User',
        description: 'Has limited access to SME privileges',
        dateCreated: new Date(),
        createdBy: 'ezSME',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),

  down: (queryInterface) => queryInterface.bulkDelete('roles', null, {})
};
