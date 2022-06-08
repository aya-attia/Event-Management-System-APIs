const { response } = require("express")
const { request } = require("express")
const {validationResult} = require("express-validator");
const Student = require("./../Models/StudentModel");
const bcrypt = require('bcryptjs');
var salt =10;

function studentDataValidation(req)
{
    var result = validationResult(req);
    if(!result.isEmpty())
    {
        let message = result.array().reduce((current, error)=>current + " " + error.msg, ", ");
        let error = new Error(message);
        error.status = 422;
        console.log(message);
        throw error;       
    }
}

module.exports.getAllStudents=(request, response, next)=>{
    console.log(request.query);
    //request.query.name
    console.log(request.params);
    Student.find({})
            .then((data)=>{
                response.status(200).json({data});
            })
            .catch(error=>{
                next(error);
            })
}

module.exports.getStudent=(request, response, next)=>{
    // console.log(request.query);
    // console.log(request.params);
    // response.status(200).json({message: "Student by ID"});   
    studentDataValidation(request);
    Student.findById(request.params['id'])
            .then((data)=>{
            response.status(200).json({data});
            })
            .catch(error=>{
                next(error);
            })
}

module.exports.insertStudent=(request, response, next)=>{
    Student.findOne().sort({"_id": -1}).exec(function(err, post) {
        //console.log( post._id+1 );

    studentDataValidation(request);
    bcrypt.hash(request.body.Password, salt, function (error, hash) {
        //console.log(hash);
        let student = new Student({
            _id:post._id+1,
            Email:request.body.Email,
            // Password:request.body.Password
            Password:hash
        });
    
        student.save()
            .then((data)=>{
                if (error) {
                    //return console.log('Cannot encrypt');
                    throw new Error("Cannot encrypt");
                    //response.status(500).json({message:"Cannot encrypt"});//check for another way
            }
            response.status(201).json({message: "Student added", data});
        })
        .catch(error=>next(error)
        );                       
            
    })
        
        // console.log(result);
        // console.log(request.body); 
    }); 
}


module.exports.updateStudent=(request, response, next)=>{
    console.log(request.role)
    // if(request.role !== "admin")
    // {
    //     throw new Error("Not Authorized");
    // }
    
    studentDataValidation(request);
    bcrypt.hash(request.body.Password, salt, (error, encrypted) => {
        //request.body.Password = encrypted
        Student.updateOne({_id:request.body.id}, { //or using params
            $set:{
                Email:request.body.Email,
                //Password:request.body.Password
                Password:encrypted
            }
        }).then(data=>{
            if(data.matchedCount == 0)
            {
                throw new Error("Student not exist");
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


    //another solution
    // Student.findById(request.body.id)
    //         .then(data=>{
    //             if(data == null)
    //             {
    //                 throw new Error("Student not exist");
    //             }

    //             data.Email = request.body.Email;
    //             data.Password = request.body.Password;
    //             return data.save()
    //         })
    //         .then(data=>{
    //             response.status(200).json({message: "Student updated", data});
    //         })
    //         .catch(error=>next(error)
    //         );
}

module.exports.deleteStudent=(request, response)=>{
    studentDataValidation(request);
    Student.deleteOne({_id:request.body.id})
            .then((data)=>{
            response.status(200).json({data, message: "Student deleted"});
            })
            .catch(error=>{
                next(error);
            })
}





// bcrypt.compare(password, hashedPassword, 
//     async function (err, isMatch) {

//     // Comparing the original password to
//     // encrypted password   
//     if (isMatch) {
//         console.log('Encrypted password is: ', password);
//         console.log('Decrypted password is: ', hashedPassword);
//     }

//     if (!isMatch) {
      
//         // If password doesn't match the following
//         // message will be sent
//         console.log(hashedPassword + ' is not encryption of ' 
//         + password);
//     }
// })