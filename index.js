const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT, 
    REDIS_URL, 
    REDIS_PORT, 
    SESSION_SECRET 
} = require("./config/config");

/*
    Require and connect-redis and create a redis client
*/
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

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
    Setting up sessions using express-session and setting the store to redis
*/
app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30000
    }
}));

// Json middleware, this is needed to attach the actual request and attach it
// to the express request object.
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h2>Hi There!!!</h2>")
});

// Any URL formatted as domain:3000/api/vi/posts is redirected to the postRouter, etc...
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));