import express from "express";

const PORT = 8000;

const app = express();

app.use(express.json())


const users = [
    {
        id : 1 , 
        name : "demo",
        "password" : "demo123",
        email : "demo@demo.com"
    }
];


// get all users
app.get("/api/users" , (req , res) => {
    const status_code = res.status(200);
    status_code.send({
        status_code : 200 , 
        data : users
    });
})

// search for another user
app.get("/api/users/search" , (req , res) => {
    const { query : {filter , value},} = req ; 
    if(!filter && !value) return res.send(users)
    else{
        if(!filter || !value) return res.send({
            status : 404,
            message : "Not found"
        })
        else {
            const filterArray = users.filter( user => 
                    user[filter].includes(value)
            )
            if(filterArray.length === 0){
                res.send({
                    status : 404,
                    message : "Not found"
                })
            }else{
                res.send(filterArray)
            }
        }
    }
 })

// create user

app.post("/api/auth/signup" , (req , res) => {
    const { body } = req ;
    const newUser = {id : users[users.length - 1].id + 1 , ...body}
    users.push(newUser)
    res.send(users);
})

// login
app.post("/api/auth/signin" , (req , res) => {
    const { body : { email , password } } = req ;
    const user = users.find(client => client.email === email);

    if( user && user.password === password){
        res.send({
            status : 200 , 
            message : "Success"
        })
    }else {
        res.status(401).send({ message: "Invalid credentials" });
    }
})

// update user info

// Update user info
app.put("/api/users/:id", (req, res) => {
    const { params: { id }, body } = req;
    const index = users.findIndex((user) => user.id.toString() === id);

    if (index === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    users[index] = { ...users[index], ...body };
    res.send({ message: "User updated successfully", data: users[index] });
});

// delete user account

// Delete user account
app.delete("/api/users/:id", (req, res) => {
    const { params: { id } } = req;
    const index = users.findIndex((user) => user.id.toString() === id);

    if (index === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    users.splice(index, 1);
    res.send({ message: "User deleted successfully" });
});

app.listen(PORT , () => {
    console.log("server is running on port : " + PORT);
})