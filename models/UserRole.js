const mongoose = require("mongoose");
const tenant = require("./Tenant");
const orgLevel = require("./OrgLevel");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userRoleSchema = new mongoose.Schema({
    roleName: { type: String, required: true},
    roleShort: {type: String},
    grade: {type: Number, required:true , min:1, max:50},
    acceptsMany: {type: Boolean, default: true},
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
    Description: {type:String}
  });

  userRoleSchema.pre("save", async function(next){
    const role = this.constructor;
    try{
        const duplicateName = await role.findOne({roleName: this.roleName, tenant: this.tenant});
        const duplicateGrade = await role.findOne({grade: this.grade, tenant:this.tenant});
        if(duplicateName || duplicateGrade){
            next(new Error("Duplicate found!"))
        }else(
            next()
        )
    }catch(err){
        console.log(err.message)
        next(new Error("query error!"))
    }
  })

  mongoose.model('UserRole', userRoleSchema);
  module.exports = mongoose.model('UserRole', userRoleSchema);