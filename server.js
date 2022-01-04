// Requirements
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const routes = express.Router();

// App config
app.use(cors());
app.use(express.json());
app.use('/Mazuren', routes);
app.listen(process.env.PORT || 5000);

// Schemas
let Expense = require('./models/expense')
mongoose.connect('mongodb+srv://admin:romeykeiapp@genshinplanner.ficwy.mongodb.net/Mazuren', 
                { useNewUrlParser: true }).then(db => console.log("Succesfull connection"))
                                          .catch(err => console.error(err))

const connection = mongoose.connection
connection.once('open', function () {
    console.log("MongoDB database connection established successfully")
})

// First of all we need to add an endpoint which is delivering all available user items with soft deletes
routes.get('/', (req, res) => {

    let query = {"deleted": false}
    Expense.find( query, (err,expenses) => {
        if(err){
            console.log(err);
        } else {
            res.json(expenses)
        }
    })
});

// Filter all available items by query with soft deleted
routes.get('/filter', (req, res) => {

    let query = req.query
    query['deleted'] =  false

    Expense.find( query, (err,expenses) => {
        if(err){
            console.log(err);
        } else {
            res.json(expenses)
        }
    })
});

// Add an expense
routes.route('/add').post((req, res) => {
    let expense = new Expense(req.body)
    expense.save()
        .then( expense => {
            res.status(200).send('Expense added successfully');
        })
        .catch( err => {
            res.status(400).send('Adding new expense failed')
        })
})

// Update expense
routes.route('/update/:id').post((req,res)=>{
    Expense.findById(req.params.id, (err,expense)=>{
        if (!expense) {
            res.status(404).send("Data is not found")
        } else {
            expense.description = req.body.description
            expense.category = req.body.category
            expense.responsible = req.body.responsible
            expense.value = req.body.value
            expense.date = req.body.date

            expense.save()
                .then( expense => { res.json('Expense updated!')})
                .catch(err => {res.status(400).send('Update is not posible')})
        }
    })
})

// Delete expense
routes.route('/delete/:id').post((req,res)=>{
    Expense.findById(req.params.id, (err,expense) => {
        if (!expense) {
            res.status(404).send("Data is not found")
        } else {
            expense.deleted = true
            expense.save()
                .then( expense => { res.json('Expense deleted!')})
                .catch(err => { res.status(400).send('Delete is not posible')})
        }
    })
})