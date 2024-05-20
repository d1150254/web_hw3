var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const sqlite3 = require('sqlite3').verbose();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db=new sqlite3.Database('sqlite.db',(err)=>{
    if(err){
        return console.error(err.message);
    }
    console.log('Database Connected!');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/getalldata', (req,res)=>{
    db.all('select * from tissue',(err,rows)=>{
        if(err){
            return console.error(err.message);
        }
        console.log(rows);
        res.json(rows);
    });
});

app.get('/api/test', (req,res)=>{
    if(req.query.year && req.query.month){
        const month=req.query.month;
        const year=req.query.year;
        console.log(year,month);
        db.all('select * from tissue where years='+year+' and month='+month, (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(rows);
            res.json(rows);
        });
    }
});


module.exports = app;
