/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {
    create: (req, res) => {
        const userObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        };

        User.create(userObj, (err, _user) => {
            if (err) return res.serverError(err);
            return res.ok({
                data: _user
            });
        });
    },

    findLookup: function (req, res) {
        console.log("request recieved");
        try {
            //const userId = req.params.userId;
            User.native((error, collection) => {
                collection.aggregate([
                    {
                        $lookup: {
                            'from': 'contacts',
                            'localField': 'email',
                            'foreignField': 'email',
                            'as': 'contacts'
                        }
                    }
                ]).toArray((err, result) => {
                    console.log(result);
                    res.ok(result)
                });
            });

        } catch (err) {
            console.log(err);
            return res.serverError(err);
        }
    },

    findPopulate: function (req, res) {
        try {
            User.find().populate('contacts').exec(function (err, users) {
                if(err) res.serverError(err);
                console.log("response");
                console.log(users)
                res.ok(users)
            })

        } catch (err) {
            console.log(err);
            return res.serverError(err);
        }
    },

    findPromised: function (req, res) {
        const fetchUsers = function () {
            return new Promise(function (resolve, reject) {
                return User.find().exec(function (err, users) {
                    if (err) reject(err);
                    resolve(users)
                })
            });
        }
        const fetchContacts = function () {
            return new Promise(function (resolve, reject) {
                return Contacts.find().exec(function (err, contacts) {
                    if (err) reject(err);
                    resolve(contacts)
                })
            });
        }
        try {
            Promise.mapSeries([fetchUsers, fetchContacts], function(p){
                return p();
            })
                .then(function (result) {
                    console.log(result);
                    res.ok(result);
                }).catch(function (err) {
                    console.log(err);
                    return res.serverError(err);
                });

        } catch (err) {
            console.log(err);
            return res.serverError(err);
        }
    },

    destroy: function (req, res){
        
        User.findOne({email: req.params.id}).exec(function(err,_user){
            if (err) return res.serverError({ msg:'User not found'});
            
            if(_user){
                User.destroy({email: req.params.id}).exec(function(err1, result){
                    if(err1) return res.serverError({ msg:'Internal Server Error'});
                    // delete associate contacts also
                    Contacts.destroy({email: req.params.id}).exec(function(err2, result){
                        res.ok({
                            msg:'User deleted and its associate contacts deleted'
                       });
                    });
                })
            }else{
                res.serverError({msg:'User not found'});
            }
        });
    }
};

