const users = [
  {
    _id: { $oid: '5f6b821f2b522a2b6055b905' },
    name: 'Christopher',
    email: 'Christopher@Barnes.biz',
    password: '$2b$10$ptYV3vduuJYy7Mymvz9tBOODNrcOJtRXuPXRAWizdLFoLZjMK0Q16',
    age: null,
    created: { $date: { $numberLong: '1600881183770' } },
    __v: { $numberInt: '0' },
  },
  {
    _id: { $oid: '5f6b90d4b786795690dfd1c8' },
    name: 'Kevin',
    email: 'Kevin@Anderer.com',
    password: '$2b$10$y8Z51KizS/4b5JANdasKlOtlq89SWR9VLBfWP/Ecz3mEDH7/YFqGK',
    subscribed: true,
    age: null,
    created: { $date: { $numberLong: '1600884948050' } },
    __v: { $numberInt: '0' },
  },
  {
    _id: { $oid: '5f6b8d83f8c259582cf3580f' },
    name: 'Athanasia',
    email: 'Athanasia@SC.de',
    password: '$2b$10$aura6GCrZU.mMQsTcu6U5eEQIF6QHD0XZvlWhB1Blw4UCDLXAhbWK',
    subscribed: true,
    age: null,
    created: { $date: { $numberLong: '1600884099560' } },
    __v: { $numberInt: '0' },
  },
];

module.exports = users;
