const fs = require('fs');
const express = require('express');
const expressHbs = require("express-handlebars");
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const configHbs = expressHbs.engine({
    layoutsDir: 'views',
    extname: 'hbs'
});




// const handlebars = expressHandlebars.create({
// 	defaultLayout: 'main', 
// 	extname: 'hbs',
//     helpers: GetMarks
// });


app.engine('hbs', configHbs);
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())


/* mongo DB */

const { MongoClient, ObjectId } = require('mongodb');
const res = require('express/lib/response');

const url = 'mongodb+srv://admin:admin123@cluster0.0wjaw.mongodb.net/test';
const client = new MongoClient(url);

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('users');
    const collection = db.collection('personal_data');

    const dbl = client.db('journal');
    const lessons = dbl.collection('attemps');

    const news = client.db('news');
    const news_collection = news.collection('news');

    const comm = client.db('comments');
    const comments = comm.collection('CommBs');
  
    // the following code examples can be pasted here...

    // x = new Date();
    // x.setDate(x.getDate()-7);
    // x.setHours(0);
    // x.setMinuts(0);
    // x.setSeconds(0);

    // start = x.getTime()
    // end = (new Date()).getTime()
    


    app.get('/main', async function (req, res) {
        await res.render('main', {
            layout: 'main'
        })
    });
    
    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);

    const findDate = await lessons.find({}).toArray();
    console.log('Found documents =>', findDate);

    const findNews = await news_collection.find({}).toArray();
    console.log('Found documents =>', findNews);

    const findComm = await comments.find({}).toArray();
    console.log('Found documents =>', findComm);
    
    app.post('/login', async function (req, res) {
        const user = await collection.find({login: req.body.name, password: req.body.pass}).toArray();

        if (user.length) {
            if (user[0].permission == 'admin') {
                res.redirect('/main')
            }
            else if (user[0].permission == 'pupil') {
                res.redirect('/groups')
            }
            
        }
        else{
            res.redirect('/main')
        }
    });

    let base = [];

    app.get('/groups', async function (req, res) {
        await res.render('groups', {
            layout: 'groups',
            items: base
        })
    });
    app.get('/news/', async function (req, res) {
        await res.render('news', {
            layout: 'news',
        });
    });

    app.get('/api/news/', async function (req, res) {
        const info_news = await news_collection.find({}).toArray();
        // let filtered_news = info_news.filter(item => { item.created_date >= start && item.created_date <= end })
        if (info_news.length) {
            return res.status(200).json(info_news) 
        }
        else {
            return res.status(403).json({
                error: 'This user does not exist'
            })
        }
    });

    app.get('/comments', async function (req, res) {
        await res.render('comments', {
            layout: 'comments'
        })
    });

    app.get('/api/comments', async function (req, res) {
        const arr_comm = await comments.find({}).toArray();

        if (arr_comm.length) {
            return res.status(200).json(arr_comm) 
        }
        else {
            return res.status(403).json({
                error: 'This user does not exist'
            })
        }
    });

    app.post('/comments', async function (req, res) {
        const send = await comments.insertOne({
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            mark: req.body.mark,
            permission: req.body.permission,
            comment: req.body.comment
        });
        console.log(send)
        res.redirect('comments');
    })
    app.get('/target', async function (req, res) {
        await base.push({
            ...req.query
        });
        console.log(req.query.items)
        res.redirect('/groups')
    });


    app.get('/attemps/:group/', async function (req, res) {
        res.render('attemps', {
            layout: 'attemps',
            group: req.params.group,

        });
    });

    app.get('/api/attemps/:group/users', async function (req, res) {
        let users_info = await collection.find({
            group_name: req.params.group
        }).toArray();

        if (users_info.length) {
            return res.status(200).json(users_info) 
        }
        else {
            return res.status(403).json({
                error: 'This user does not exist'
            })
        }

    });

    

    app.get('/api/attemps/:group/:month', async function (req, res) {
        let users_info = await collection.find({
            group_name: req.params.group,
        }).toArray();

        if (users_info.length) {
            return res.status(200).json(users_info[0].marks[req.params.month]); 
        }
        else {
            return res.status(403).json({
                error: 'This user does not exist'
            })
        }

    });
    app.post('/attemps/:group/update', async(req, res) => {
        let { first_name, second_name} = req.body;
        await collection.insertOne({
            first_name,
            second_name
        })
        res.redirect('attemps')
    });

    app.post('/api/attemps/:group/update', async (req, res) => {
        let users_id = Object.keys(req.body);
        for (let user_id of users_id) {
            let month = Object.keys(req.body[user_id]);
            let users_info = await collection.findOne({ _id: ObjectId(user_id) })
            users_info.marks[month] = req.body[user_id][month];
            try {
                await collection.updateOne({ _id: ObjectId(user_id) }, {
                    $set: {
                        marks: users_info.marks
                    }
                }, () => {
                    res.render('chat', {
                        status: true,
                        message: 'Дані успішно збережено'
                    })
                    return res.json({ status: true, message: 'Дані успішно збережено'})
                });
            } catch (error) {
                return res.json({ status: false, message: 'Error'})
            }
        }
        

        // let users_info = await collection.findOne({
        //     first_name: req.body.first_name,
        //     second_name: req.body.second_name
        // });
        
        // users_info.marks[req.body.month][req.body.day] = [req.body.class_work, req.body.home_work]

        // console.log(users_info)
        // await collection.updateOne({ 
        //     first_name: req.body.first_name,
        //     second_name: req.body.second_name
        // },{
        //     $set: {
        //         marks: users_info.marks
        //     }
        // }, (err) => {
        //     return res.json({ status: 'Sucess' })
        // })
        
    });

    app.listen(port, () => {
        console.log(`Програму запущено ${port}`)
    });
    
    
}
main();



