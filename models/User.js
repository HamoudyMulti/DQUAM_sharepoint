const mongoose = require("mongoose");
const tenant = require("../Models/Tenant");
const OrgUnit = require("../Models/OrgUnit");
const UserRole = require("../Models/UserRole");
const OrgLevel = require("../Models/OrgLevel");

let emailPattern =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, min: 8},
    username: {type: String, required: true, unique: true, min:6},
    password: {type: String},
    jwToken: {type:String},
    jwtRefreshToken: {type:String},
    jobTitle: {type:String},
    email: {type: String, required: true, unique:true,
        validate: {
            validator: (val)=>{
                return new Promise(function(resolve,reject){
                    if(!val.match(emailPattern)){
                        resolve(false);
                    }else{
                        resolve(true);
                    }
            });
            },
            message: "is not a valid email address!"
        }
    },
    phone: {type: String,
        validate: {
            validator: function(v) {
              return /\d{3}-\d{8}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
        },
    bio: {type:String},
    image: {type: String},
    dob: {type: Date, default: Date.now},
    active: {type: Boolean, default:true},
    orgUnit: {type: ObjectId, required: true, ref:"orgUnit",
        validate:{
                    validator: (val)=>{
                        return new Promise(async function(resolve,reject){
                            const t =await OrgUnit.findOne({_id:val})
                            if(t){
                                resolve(true);
                            }else{
                                resolve(false);
                            }
                            resolve(false)
                        });
                        },
                        message: "is not a valid Unit ID!"
                }
        },
    role: {type: ObjectId, required: true, ref:"UserRole",
        validate:{
                    validator: (val)=>{
                        return new Promise(async function(resolve,reject){
                            const t =await UserRole.findOne({_id:val})
                            if(t){
                                resolve(true);
                            }else{
                                resolve(false);
                            }
                            resolve(false)
                        });
                        },
                        message: "is not a valid Role ID!"
                }
        },
    unitLeader: {type: Boolean, default:false},
    reportingTo: {type: ObjectId, ref:"User"},
    tenant: {type: ObjectId, required: true, ref:"tenant",
    validate:{
        validator: (val)=>{
            return new Promise(async function(resolve,reject){
                const t =await tenant.findOne({_id:val})
                if(t){
                    resolve(true);
                }else{
                    resolve(false);
                }
                resolve(false)
            });
            },
            message: "is not a valid tenant ID!"
    }
    },
    actingAsRole: {type: ObjectId, ref:"UserRole",
    validate:{
        validator: (val)=>{
            return new Promise(async function(resolve,reject){
                const t =await UserRole.findOne({_id:val})
                if(t){
                    resolve(true);
                }else{
                    resolve(false);
                }
                resolve(false)
            });
            },
            message: "is not a valid Role ID!"
    }},
    actingAsUnit: {type: ObjectId, ref:"OrgUnit",
    validate:{
        validator: (val)=>{
            return new Promise(async function(resolve,reject){
                const t =await OrgUnit.findOne({_id:val})
                if(t){
                    resolve(true);
                }else{
                    resolve(false);
                }
                resolve(false)
            });
            },
            message: "is not a valid Unit ID!"
        }
    },
    actingAsReportingTo: {type: ObjectId, ref:"User"}
  });
  

  function determineUnitLeader(role, unit){
    if  role == manager => get higher unit and higher role in that unit
    if  role == employee => get higher role within same unit
    
    
    if  role == employee => get higher role within same unit
    if  role == employee => get higher role within same unit
    if  role == employee => get higher role within same unit
    if  role == employee => get higher role within same unit
    if  role == employee => get higher role within same unit
    if  role == employee => get higher role within same unit

  }

  userSchema.pre("save", async function(next){
    const userModel = this.constructor;
    const roleOfUser = await UserRole.findById(this.role);
    if(roleOfUser){
        if(!roleOfUser.acceptsMany){
            const currentUserInRole = await userModel.findOne({role:roleOfUser._id, orgUnit: this.orgUnit})
            if(currentUserInRole){
                if(currentUserInRole.active){
                    next(new Error("This Role is Already in Use"))
                }else{
                    next()
                }         
            }else{
                next()
            }
        } else{
            next()
        }   
    }else{
        next(new Error("Invalid Role!!!"));
    }
  })

  userSchema.pre("save", async function(next){
    const userModel = this.constructor;
    try{
        if(this.actingAsRole && this.actingAsUnit){
        const validActingRole = await UserRole.findOne({_id: this.role, tenant:this.tenant});
        const validActingUnit = await OrgUnit.findOne({_id: this.orgUnit, tenant:this.tenant});
        if(!validActingRole || !validActingUnit){
            next(new Error("Invalid Acting as Information"))
        }else{
            const existingRoleHolders = await userModel.find({role: validActingRole._id, orgUnit: validActingUnit._id, active: true});
            if(existingRoleHolders && existingRoleHolders.length>0){
                if(validActingRole.acceptsMany==false){
                    next(new Error("The specified role is occupied and cannot accept many"))
                }else{
                    next();
                }
            }
        }
        }else if (this.actingAsRole && !this.actingAsUnit){
            next(new Error("Missing Acting As Unit"));
        }else if(this.actingAsUnit && !this.actingAsRole){
            next(new Error("Missing Acting As role"));
        }else{
            next()
        }
    }catch(error){
    console.log(error)
}

  });


  userSchema.pre("save", async function(next){
    const userToAdd = this.constructor;
    try{
        if(!this.reportingTo){
            const unit = await OrgUnit.findOne({_id: this.orgUnit})
            if(unit){
                const levelOfUnit = await OrgLevel.findOne({_id: unit.unitLevel})
                if(levelOfUnit.level!==0){
                    next(new Error("reporting to field cannot be empty"))
                }else{
                    next();
                }
            }else{
                next(new Error("invalid user unit"))
            }
        }else{
            const managerOfUser = await userToAdd.findOne({_id: this.reportingTo});
            const unit = await OrgUnit.findOne({_id: this.orgUnit})
            if(!managerOfUser){
                next(new Error("invalid reporting to user"))
            }else if(managerOfUser.tenant.equals(this.tenant)){
                const managerUnit = await OrgUnit.findOne({_id: managerOfUser.orgUnit});
                const parentUnitOfUser = await OrgUnit.findOne({_id:unit.unitParent});
                console.log(this)
                if(this.unitLeader==true){
                    if(managerUnit._id.equals(parentUnitOfUser._id)){
                        next()
                    }else{
                        next(new Error("reporting To user should belong to the parent unit whom this user belongs to"))
                    }
                }else{
                    if(managerUnit._id.equals(this.orgUnit)){
                        next()
                    }else{
                        next(new Error("Reporting to user should belong to the user unit"))
                    }
                }
            }else{
                next(new Error("Invalid Reporting to user tenant"))
            }
        }
    }catch(err){
        console.log(err)
        next(err);
    }
})

userSchema.pre("save", async function(next){
    const userToAdd = this.constructor;

});

  mongoose.model('User', userSchema);
  module.exports = mongoose.model('User', userSchema);