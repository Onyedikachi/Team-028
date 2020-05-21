module.exports = {
  up: (queryInterface) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    queryInterface.bulkInsert(
      'organizations',
      [
        {
          userId: 0,
          userCatId: 0,
          companyName: 'eazSME',
          RCNumber: 'RC4304df',
          email: 'smes@eazsme.com',
          BVN: 48934944893,
          address: '4, philip avenue, andela close, ilupeju',
          dateIncorporated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: 0,
          userCatId: 0,
          companyName: 'defaultSME',
          RCNumber: 'RC4834',
          email: 'smehouse@eazsme.com',
          BVN: 23234545,
          address: '78, philip avenue, andela close, ilupeju',
          dateIncorporated: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('organizations', null, {})
};
