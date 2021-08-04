if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)


const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const joi=require('joi');
const User=require('./models/user');

const mongoSanitize=require('express-mongo-sanitize');


const ExpressError=require('./utils/ExpressError');
const methodOverride=require("method-override")
const passport=require('passport');
const localStrategy=require('passport-local');

const userRoutes=require('./routes/users');
const farmhouseRoutes=require('./routes/farmhouses');
const reviewRoutes=require('./routes/reviews');

const MongoStore = require('connect-mongo');

const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/farm-house';


mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false

});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("DATABASE CONNECTED!");

});


const app=express();


app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const secret=process.env.SECRET || 'squirrel';


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});


const sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expire:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7

    }

}
app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req ,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})



app.use('/',userRoutes);
app.use('/farmhouses',farmhouseRoutes)
app.use('/farmhouses/:id/reviews',reviewRoutes)
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('home')
});




app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})



app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message) err.message='Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
   
    
})
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('serving on port 30')
})