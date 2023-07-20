/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'users',
  migrate: 'alter',
  schema: true,
  attributes: {
    firstName: {
      type: "string"
    },
    lastName: {
      type: "string"
    },
    email: {
      type: "string",
      email: true,
      unique: true
    },
    age:{
      type: "integer"
    },
    contacts:{
      collection: 'contacts',
      via:'email'
    }
  }
};

