const { response } = require("express")
const { request } = require("express")
const {validationResult} = require("express-validator");
const Speaker = require("./../Models/SpeakerModel");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var salt =10;

function speakerDataValidation(req)
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

module.exports.getAllSpeakers=(request, response, next)=>{
    console.log(request.query);
    console.log(request.params);
    Speaker.find({})
            .then((data)=>{
                response.status(200).json({data});
            })
            .catch(error=>{
                next(error);
            })
}

module.exports.getSpeaker=(request, response, next)=>{
    if(mongoose.isValidObjectId(request.params['id']) == false)
    {
        throw new Error("Invalid object Id");
    }
    Speaker.findById(request.params['id'])
            .then((data)=>{
            response.status(200).json({data});
            })
            .catch(error=>{
                next(error);
            })    
}

module.exports.insertSpeaker=(request, response, next)=>{
    speakerDataValidation(request);
    bcrypt.hash(request.body.Password, salt, function (error, hash) {
        //console.log(hash);
        let speaker = new Speaker({
            _id:mongoose.Types.ObjectId(),
            Email:request.body.Email,
            UserName:request.body.UserName,
            Password:hash,
            Address:{
                City:request.body.City,
                Street:request.body.Street,
                Building:request.body.Building
            }
        });
    
        speaker.save()
            .then((data)=>{
                if (error) {
                    //return console.log('Cannot encrypt');
                    throw new Error("Cannot encrypt");
                    //response.status(500).json({message:"Cannot encrypt"});//check for another way
            }
            response.status(201).json({message: "Speaker added", data});
        })
        .catch(error=>next(error)
        );                       
            
    })
        
        // console.log(result);
        // console.log(request.body);
}

module.exports.updateSpeaker=(request, response, next)=>{        
    speakerDataValidation(request);
    bcrypt.hash(request.body.Password, salt, (error, encrypted) => {
        //request.body.Password = encrypted
        Speaker.updateOne({_id:request.body.id}, { //or using params
            $set:{
                Email:request.body.Email,
                UserName:request.body.UserName,
                Password:encrypted,
                Address:{
                    City:request.body.City,
                    Street:request.body.Street,
                    Building:request.body.Building
                }
            }
        }).then(data=>{
            if(data.matchedCount == 0)
            {
                throw new Error("Speaker not exist");
            }
            if(error)
            {
                throw new Error("Cannot encrypt");
            }
    
            response.status(200).json({message: "Student updated", data});
        })
        .catch(error=>next(error)
        );        
        })
}

module.exports.deleteSpeaker=(request, response)=>{
    if(mongoose.isValidObjectId(request.body.id) == false)
    {
        throw new Error("Invalid object Id");
    }
    Speaker.deleteOne({_id:request.body.id})
            .then((data)=>{
            response.status(200).json({data, message: "Speaker deleted"});
            })
            .catch(error=>{
                next(error);
            })
}

module.exports.editwithoutusernameorpassword=(request, response, next)=>{
    speakerDataValidation(request);
    Speaker.updateOne({_id:request.body.id}, { //or using params
        $set:{
            Email:request.body.Email,
            Address:{
                City:request.body.City,
                Street:request.body.Street,
                Building:request.body.Building
            }
        }
    }).then(data=>{
        if(data.matchedCount == 0)
        {
            throw new Error("Speaker not exist");
        }
        response.status(200).json({message: "Speaker updated", data});
    })
    .catch(error=>next(error)
    );
}