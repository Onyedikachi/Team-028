module.exports = {
  up: (queryInterface) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    queryInterface.bulkInsert(
      'roleprivileges',
      [
        {
          privilegeId: 1,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 2,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 1,
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 2,
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 1,
          roleId: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 2,
          roleId: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 1,
          roleId: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 2,
          roleId: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          privilegeId: 3,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('roleprivileges', null, {})
};
