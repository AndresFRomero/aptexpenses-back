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

// First of all we need to add an endpoint which is delivering all available user items:
routes.get('/', async (req, res) => {
    const expenses = await Expense.find()
    res.json(expenses);
});

routes.route('/add').post( async (req, res) => {
    let expense = new Expense(req.body)
    expense.save()
        .then( expense => {
            res.status(200).json({'expense': expense.description});
        })
        .catch( err => {
            res.status(400).send('adding new user failed')
        })
})