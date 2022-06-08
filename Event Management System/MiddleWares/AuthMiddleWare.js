const { request } = require("express");
const jwt=require("jsonwebtoken");

module.exports=(request,response,next)=>{
    let token = request.header("Authorization");
    if(token)
    {
        jwt.verify(token, "IamStudent", (err, decoded)=>{
            if(err)
            {
                response.status(401).json({message:"Invalid Token"});
            }
            else
            {
                request.user=decoded;
                next();
            }
        });

        jwt.verify(token, "IamSpeaker", (err, decoded)=>{
            if(err)
            {
                response.status(401).json({message:"Invalid Token"});
            }
            else
            {
                request.user=decoded;
                next();
            }
        });

        jwt.verify(token, "IamAdmin", (err, decoded)=>{
            if(err)
            {
                response.status(401).json({message:"Invalid Token"});
            }
            else
            {
                request.user=decoded;
                next();
            }
        });

    }
    else
    {
        response.status(401).json({message:"No Token"});
    }
}

    //console.log(request.body)
    //let token, decodedToken;

    // try
    // {
    //     token=request.get("Authorization").split(" ")[1];
    //     decodedToken=jwt.verify(token,"IamAdmin");//encryption
    //     console.log(decodedToken);
    // }
    // catch(error)
    // {
    //     try
    //     {
    //         decodedToken=jwt.verify(token,"IamStudent");
    //     }
    //     catch(error)
    //     {
    //         try
    //         {
    //             decodedToken=jwt.verify(token,"IamSpeaker");
    //         }
    //         catch(error)
    //         {
    //             next(new Error("Not Authenticated"));
    //         }
    //     }     
    // }
    
    //authenticated
    // request.role=decodedToken.role;
    // next();
    
//}