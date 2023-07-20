/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // tableName: 'contacts',
  migrate: 'alter',
  schema: true,
  attributes: {
    phone: {
      type: 'string'
    },
    name:{
      type: 'string'
    },
    email: {
      model:'User'
    },
  }
};

