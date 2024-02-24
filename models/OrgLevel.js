const mongoose = require("mongoose");
const tenant = require("./Tenant");
const orgUnit = require("./OrgUnit");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const orgLevelsSchema = new mongoose.Schema({
    level: { type: Number, required: true, default: -1, min:-1, max:10},
    levelName:{type: String, required: true},
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
    }
  });

  orgLevelsSchema.pre("save", async function(next){
    const level = this.constructor;
    try{
        const duplicateName = await level.findOne({levelName: this.levelName, tenant: this.tenant});
        const duplicateLevel = await level.findOne({level: this.level, tenant: this.tenant});
        if(duplicateName || duplicateLevel){
            next(new Error("Duplicate found!"))
        }else(
            next()
        )
    }catch(err){
        console.log(err.message)
        next(new Error("query error!"))
    }
  })

  mongoose.model('OrgLevel', orgLevelsSchema);
  module.exports = mongoose.model('OrgLevel', orgLevelsSchema);