const express = require("express");
const mongoose = require("mongoose");

const app = express();

/*
    We need to pass in some information for mongoose to connect to the mongodb container.
    Instead of an IP we can use the service name (mongo) since composer created a custom
    default network that has DNS. We can confirm a successful connection by checking 
    the logs of the node container.
*/
mongoose.connect("mongodb://root:secret@mongo:27017/?authSource=admin")
    .then(() => console.log("Connection Success"))
    .catch((e) => console.log(e));

app.get("/", (req, res) => {
    res.send("<h2>Hi There!!!</h2>")
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening onport ${port}`));