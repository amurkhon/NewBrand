import express from 'express';
import path from 'path';
import routerAdmin from './router-admin';
import router from './router';
import morgan from 'morgan';


import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';
import { T } from './libs/types/common';
import { MORGAN_FORMAT } from './libs/config';
const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore(
    {
        uri: process.env.MONGO_URL,
        collection: 'sessions',
    }
)





/* Entrance */ 
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('./uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));


/* Sessions */
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 //  1 MONTH
  },
  store: store,
  resave: true,
  saveUninitialized: true,
}));

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/* Views */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* Routers */

app.use('/admin', routerAdmin); // SSR
app.use('/', router); // SPA


export default app;