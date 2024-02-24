const mongoose = require("mongoose");
const user = require("./User");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const committeeSchema = new mongoose.Schema({
    committeeName: { type: String, required: true},
    head: {type: ObjectId, required: true, ref:"user",
    validate:{
                validator: (val)=>{
                return new Promise(function(resolve,reject){
                    user.findOne({_id:val}, function(err, doc){
                    if(err){
                        resolve(false);
                    }else{
                        if(doc){
                        resolve(true);
                        }else{
                        resolve(false);
                        }
                    }
                    });
                });
                },
                message: "is not a valid user ID!"
            }
    },
    secretary: {type: ObjectId, required: true, ref:"user",
    validate:{
                validator: (val)=>{
                return new Promise(function(resolve,reject){
                    user.findOne({_id:val}, function(err, doc){
                    if(err){
                        resolve(false);
                    }else{
                        if(doc){
                        resolve(true);
                        }else{
                        resolve(false);
                        }
                    }
                    });
                });
                },
                message: "is not a valid user ID!"
            }
    },
    members: [{type: ObjectId, required: true, ref:"user",
    validate:{
                validator: (val)=>{
                return new Promise(function(resolve,reject){
                    user.findOne({_id:val}, function(err, doc){
                    if(err){
                        resolve(false);
                    }else{
                        if(doc){
                        resolve(true);
                        }else{
                        resolve(false);
                        }
                    }
                    });
                });
                },
                message: "is not a valid user ID!"
            }
    }],
    tenant: {type: ObjectId, required: true, ref:"tenant",
    validate:{
        validator: (val)=>{
        return new Promise(function(resolve,reject){
            tenant.findOne({_id:val}, function(err, doc){
            if(err){
                resolve(false);
            }else{
                if(doc){
                resolve(true);
                }else{
                resolve(false);
                }
            }
            });
        });
        },
        message: "is not a valid tenant ID!"
    }
    },
    email: {type: String, required: true},
    phone: {type: Number,
        validate: {
            validator: function(v) {
              return /\d{3}-\d{8}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
        },
    bio: {type:String},
    image: {type: String},
    dob: {type: Date, default: Date.now}

  });
  mongoose.model('Committee', committeeSchema);
  module.exports = mongoose.model('Committee', committeeSchema);