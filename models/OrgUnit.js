const mongoose = require("mongoose");
const tenant = require("./Tenant");
const orgLevel = require("./OrgLevel");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const orgUnitSchema = new mongoose.Schema({
    unitName: { type: String, required: true},
    unitShort: {type: String, required: true},
    unitLevel: {type: ObjectId, ref: "OrgLevels", required: true,
    validate:{
        validator: (val)=>{
            return new Promise(async function(resolve,reject){
                const temp = await mongoose.models["OrgLevel"].findById(val).exec();
                if(temp){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
            },
            message: "is not a valid Level ID!"
        }
    },
    unitParent: {type: ObjectId, ref:"OrgUnit",
    validate:{
        validator: (val)=>{
            return new Promise(async function(resolve,reject){
                const temp = await mongoose.models["OrgUnit"].findById(val).exec();
                if(temp){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
            },
            message: "is not a valid unit ID!"
        }
    },
    tenant: {type: ObjectId, required: true, ref:"Tenant",
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


  orgUnitSchema.pre("save", async function(next){
    try{
        const pUnit = this.constructor;
        const duplicateName = await pUnit.findOne({unitName:this.unitName, tenant: this.tenant});
        if(duplicateName){
            next(new Error("duplicate name found"))
        }else{
            next()
        }
    }catch(err){
        console.log(err)
        next(new Error("query Error2"))
    }
})


orgUnitSchema.pre("save", async function(next){
    try{
        const level = await orgLevel.findById(this.unitLevel);
        if(level.tenant.equals(this.tenant)){
            next()
        }
        else{
            next(new Error("levels should have the same tenant"))
        }
    }catch(err){
        console.log(err)
        next(new Error("query error1"))
    }
})

orgUnitSchema.pre("save", async function(next){
    try{
        const pUnit = this.constructor;
        const level = await orgLevel.findById(this.unitLevel);
        if(this.unitParent){
            const parentofCurrent = await pUnit.findById(this.unitParent);
            const levelofParent = await orgLevel.findById(parentofCurrent.unitLevel);
            if(levelofParent.level>=level.level){
                next(new Error("parent should be a higher level unit"))
            }else if(!parentofCurrent.tenant.equals(this.tenant)){
                    next(new Error("parent should be a in the same tenant"))
            }else{
            next()
            }
        }else{
            if(level.level!==0){
                next(new Error("unit without parent should be a root unit"))
            }else{
                next()
            }
            
        }
        
    }catch(err){
        console.log(err)
        next(new Error("query Error2"))
    }

})

mongoose.model('OrgUnit', orgUnitSchema);
module.exports = mongoose.model('OrgUnit', orgUnitSchema);