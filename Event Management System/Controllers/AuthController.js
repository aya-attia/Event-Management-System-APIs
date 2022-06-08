const { response } = require("express");
const { request } = require("express");
const jwt=require('jsonwebtoken');
const Student=require("./../Models/StudentModel")
const Speaker=require("./../Models/SpeakerModel");
const bcrypt = require('bcryptjs');


module.exports.login=(request,response,next)=>{
    //after connecting on db and check user
    //must be in find

    let token;
    if(request.body.email=="admin123@gmail.com" && request.body.password=="admin123456789")
    {
        token=jwt.sign({
            _id:1,
            username:request.body.email,
            role:"admin"},
            "IamAdmin",
            {expiresIn:"1h"}
        );
        response.status(200).json({msg:"login success for admin", token});
    }
    else
    {      
        Student.findOne({Email:request.body.email})
            .then(data=>{
                if(data!=null)
                {
                    bcrypt.compare(request.body.password, data.Password, function(err, res) {
                        if(res) {
                            console.log('Your password mached with database hash password');
                            token=jwt.sign({_id:data._id,
                                email:data.email,
                                role:"student"},
                                "IamStudent", //crypto
                                {expiresIn:"1h"}
                            );
                            response.status(200).json({msg:"login success for student",token}); 
                        } else {
                            console.log('Your password not mached.');
                            //throw new Error("Invalid Password");
                            response.status(500).json({message: err + " Invalid Password"});
                            //throw err;

                        }
                    });                  
                }
                else
                {
                    Speaker.findOne({Email:request.body.email})
                        .then(data=>{
                            if(data!=null)
                            {
                                bcrypt.compare(request.body.password, data.Password, function(err, res) {
                                    if(res) {
                                        console.log('Your password mached with database hash password');
                                        token=jwt.sign({_id:data._id,
                                            email:data.email,
                                            role:"speaker"},
                                            "IamSpeaker", //crypto
                                            {expiresIn:"1h"}
                                        );
                                        response.status(200).json({msg:"login success for speaker",token}); 
                                    } else {
                                        console.log('Your password not mached.');
                                        response.status(500).json({message: err + ""});
                                    }
                                });
                                                      
                            }
                            else
                            {
                                Speaker.findOne({UserName:request.body.username})
                                    .then(data=>{
                                        if(data!=null)
                                        {
                                            bcrypt.compare(request.body.password, data.Password, function(err, res) {
                                                if(res) {
                                                    console.log('Your password mached with database hash password');
                                                    token=jwt.sign({_id:data._id,
                                                        username:data.username,
                                                        role:"speaker"},
                                                        "IamSpeaker", //crypto
                                                        {expiresIn:"1h"}
                                                    );
                                                    response.status(200).json({msg:"login success for speaker",token}); 
                                                } else {
                                                    console.log('Your password not mached.');
                                                    response.status(500).json({message: err + ""});                        
                                                }
                                            });                
                                        }
                                        else
                                        {
                                            throw new Error("Username or Password incorrect");
                                        }
                                    })
                                    .catch(error=>next(error))
                            }                          
                    })
                    .catch(error=>next(error))
                }
        })
            .catch(error=>next(error))
    } 
}