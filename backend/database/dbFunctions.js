const { MongoClient } = require("mongodb");
const mdbclient = new MongoClient(process.env.MONGO_URI);

const users = async () => {
    const result = await mdbclient.connect();
    const db = result.db('GoalFi');
    return db.collection('users');
};

const events = async () => {
    const result = await mdbclient.connect();
    const db = result.db('GoalFi');
    return db.collection('events');
};


const login = async (data)=>{
    if(!data.email || !data.password){
        return {'message': 'All fields are required'};
    }
    const db = await users();
    const response = await db.find({ "email": data.email, "password": data.password }).toArray();
    if(response.length!=0){
        return {'message': 'success'};
    }
    return {'message': 'Wrong Email/Password'};
}

const signup = async(data)=>{
    if(!data.name || !data.email|| !data.password){
        return {'message': 'All fields are required'};
    }
    const db = await users();
    const dbe = await events();
    const response = await db.find({ "email": data.email}).toArray();
    if(response.length!=0){
        return {'message': 'Email Already registered. Go to login page'};
    }
    await dbe.insertOne({"username": data.email,  "created_events":[], "got_invited":[] })
    await db.insertOne({"name": data.name, "email": data.email, "password": data.password})
    return {'message': 'success'};
}

const createevent = async(data)=>{
    if(!data.inputs.eventname || !data.inputs.description || !data.inputs.date){
        return {'message': 'All fields are required'};
    }
    const db = await events();
    const response = await db.find({ "username": data.user}).toArray();
    let same_name=false;
    response[0].created_events.forEach(event => {
        if(event.name == data.inputs.eventname){
            same_name=true;
            return;
        }
    });
    if(same_name){
        return {'message': 'Event with same name exist, please use different events name.'};
    }
    await db.updateOne({"username": data.user}, { $push: { "created_events": { $each: [{ "name": data.inputs.eventname, "description": data.inputs.description, "date": data.inputs.date, "invited": []}], $position: 0 } } })
    return {'message': 'success'};
}

const getuserevents = async(data)=>{
    const db = await events();
    const response = await db.find({ "username": data}).toArray();
    return {'events': response.length>0?response[0]:null};
}

const getusers = async()=>{
    const db = await users();
    const response = await db.find().toArray();
    return {'users': response};
}

const inviteuser = async(data)=>{
    const db = await events();
    await db.updateOne({"username": data.inviter, "created_events.name": data.event}, {$push: {"created_events.$.invited": data.invited}});
    await db.updateOne({"username": data.invited}, {$push: {"got_invited": {"event": data.event, "inviter": data.inviter}}});
    return {'message': 'success'};
}

const getinvitedusers = async(data)=>{
    const db = await events();
    const response = await db.find({"username": data.user}).toArray();
    for await(const event of response[0].created_events){
        if(event.name == data.event){
            return {'invitedusers': event.invited};
        }
    }
}

const getuserinvitedevents = async(data)=>{
    const db = await events();
    const response = await db.find().toArray();
    let event = [];

    data.forEach(dat => {
        response.forEach(res => {
            if(dat.inviter == res.username){
                res.created_events.forEach(c_event => {
                    if(c_event.name == dat.event){
                        event.push({"name": c_event.name, "description":c_event.description, "date":c_event.date, "inviter": dat.inviter});
                        return;
                    }
                });
            }
        });
    });

    return {'events': event};
}

const changepassword = async(data)=>{
    if(!data.inputs.oldpassword || !data.inputs.newpassword || !data.inputs.confirmnewpassword){
        return {'message': 'All fields are required'};
    }
    if(data.inputs.newpassword != data.inputs.confirmnewpassword){
        return {'message':"New password doesn't match"};
    }
    const db = await users();
    const response = await db.find({ "email": data.user}).toArray();
    if(response[0].password != data.inputs.oldpassword){
        return {'message': "Old password Doesn't match"};
    }

    db.updateOne({ "email": data.user }, {$set: {"password": data.inputs.newpassword}})
    return {'message': 'success'};
}

module.exports = { login, signup, getuserevents, createevent, getusers, inviteuser, getinvitedusers, getuserinvitedevents, changepassword }