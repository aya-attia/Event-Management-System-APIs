const { response } = require("express")
const { request } = require("express")
const {validationResult} = require("express-validator");
const Event = require("./../Models/EventModel");
const moment = require("moment");
const mongoose = require("mongoose");

function eventDataValidation(req)
{
    let result = validationResult(req);
    if(!result.isEmpty())
    {
        let message = result.array().reduce((current, error)=>current + " " + error.msg, ", ");
        let error = new Error(message);
        error.status = 422;
        console.log(message);
        throw error;        
    }
}

module.exports.getAllEvents=(request, response, next)=>{
    //console.log(request.query);
    //request.query.name
    console.log(request.params);
    Event.find({}).populate({path:"MainSpeakerId"}).populate({path:"OtherSpeakersIds"}).populate({path:"StudentIds"})
            .then((data)=>{
                response.status(200).json({data});
            })
            .catch(error=>{
                next(error);
            })
}

module.exports.getEvent=(request, response, next)=>{
    eventDataValidation(request);
    Event.findById(request.params['id']).populate({path:"MainSpeakerId"}).populate({path:"OtherSpeakersIds"}).populate({path:"StudentIds"})
            .then((data)=>{
            response.status(200).json({data});
            })
            .catch(error=>{
                next(error);
            })
}

module.exports.insertEvent=(request, response, next)=>{
    if(mongoose.isValidObjectId(request.body.MainSpeakerId) == false)
    {
        throw new Error("Invalid object Id");
    }
    for(var i=0; i<request.body.OtherSpeakersIds.length; i++)
    {
        if(mongoose.isValidObjectId(request.body.OtherSpeakersIds[i]) == false)
        {
            throw new Error("Invalid other object Id");
        }
    }
    eventDataValidation(request);
    let event = new Event({
        _id:request.body.id,
        Title:request.body.Title,
        Date:request.body.Date,
        MainSpeakerId:request.body.MainSpeakerId,
        OtherSpeakersIds:request.body.OtherSpeakersIds,
        StudentIds:request.body.StudentIds
    });

    event.save()
        .then((data)=>{
            response.status(201).json({message: "Event added", data});
        })
        .catch(error=>next(error)
        );

    // console.log(result);
    // console.log(request.body);
    
    // const time = moment(event.Date)
    // console.log(time.format('MMMM Do YYYY, h:mm:ss a'));
    
}

module.exports.updateEvent=(request, response, next)=>{
    Event.updateOne({_id:request.body.id}, { //or using params
        $set:{
            Title:request.body.Title,
            Date:request.body.Date,
            MainSpeakerId:request.body.MainSpeakerId,
            OtherSpeakersIds:request.body.OtherSpeakersIds,
            StudentIds:request.body.StudentIds
        }
    }).then(data=>{
        if(data.matchedCount == 0)
        {
            throw new Error("Event not exist");
        }

        response.status(200).json({message: "Event updated", data});
    })
    .catch(error=>next(error)
    );
}

module.exports.deleteEvent=(request, response, next)=>{
    Event.deleteOne({_id:request.body.id})
            .then((data)=>{
            response.status(200).json({data, message: "Event deleted"});
            })
            .catch(error=>{
                next(error);
            })
}

module.exports.addStudentToEvent=(request, response, next)=>{
    Event.updateOne({_id:request.body.id}, {
        $push:{
            StudentIds:request.body.StudentId
        }
    }).then(data=>{
        if(data.matchedCount == 0)
        {
            throw new Error("Event not exist");
        }

        response.status(200).json({message: "Student added to event", data});
    })
    .catch(error=>next(error)
    );
}

module.exports.addSpeakerToEvent=(request, response, next)=>{
    Event.updateOne({_id:request.body.id}, {
        $push:{
            OtherSpeakersIds:request.body.OtherSpeakerId
        }
    }).then(data=>{
        if(data.matchedCount == 0)
        {
            throw new Error("Event not exist");
        }

        response.status(200).json({message: "Speaker added to event", data});
    })
    .catch(error=>next(error)
    );
}

module.exports.addMainSpeakerToEvent=(request, response, next)=>{    
    Event.updateOne({_id:request.body.id}, {
        $set:{
            MainSpeakerId:request.body.MainSpeakerId
        }
    }).then(data=>{
        if(data.matchedCount == 0)
        {
            throw new Error("Event not exist");
        }

        response.status(200).json({message: "Main speaker added to event", data});
    })
    .catch(error=>next(error)
    );
}

module.exports.declineeventbyspeaker=(request, response, next)=>{
    Event.updateOne({_id:request.body.id}, {
        $pull:{
            OtherSpeakersIds:request.body.OtherSpeakerId
        }
    }).then(data=>{
        if(data.matchedCount == 0)
        {
            throw new Error("Event not exist");
        }

        response.status(200).json({message: "Speaker declined from event", data});
    })
    .catch(error=>next(error)
    );
}


