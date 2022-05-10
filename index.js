const { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT, 
    REDIS_URL, 
    REDIS_PORT, 
    SESSION_SECRET 
} = require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
let redisStore = require('connect-redis')(session);
const { createClient } = require("redis")
const cors = require("cors");

/*
    Create a redis client log any errors when connecting.
*/
let redisClient = createClient({
    legacyMode: true,
    url: `redis://:@${REDIS_URL}:${REDIS_PORT}`
})
redisClient.connect().catch(console.error);

/*
    Routes files
*/
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

/*
    We need to pass in some information for mongoose to connect to the mongodb container.
    Instead of an IP we can use the service name (mongo) since composer created a custom
    default network that has DNS. We can confirm a successful connection by checking 
    the logs of the node container.
*/
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

/*
    Retrying the connection if it fails, the timer doesn't work now, it's still
    retrying every 30 seconds.
*/
const connectWithRetry = () => {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connection Success"))
        .catch((e) => {
            console.log(e)
            // If we can't connect to the mongo service keep trying every 5 seconds
            setTimeout(connectWithRetry, 1000);
        });
}

connectWithRetry();

/*
    Since we are using nginx as a load balance and forwarding the senders ip
    this setting will allow us access to it.
*/
app.enable("trust proxy");

/*
    Cors is used for allowing a different domain to access our api. Useful in
    cases for when the frontend and backend are on different domains.
*/
app.use(cors({}));

/*
    Setting up sessions using express-session and setting the store to redis.
*/
app.use(session({
    store: new redisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30000
    }
}));

// Json middleware, this is needed to attach the actual request and attach it
// to the express request object.
app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi There! :)</h2>")
});

// Any URL formatted as domain:3000/api/vi/posts is redirected to the postRouter, etc...
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));