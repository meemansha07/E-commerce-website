const express = require('express');
const cors = require('cors');
//const path = require('path');

var jwt = require('jsonwebtoken');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
const bodyParser = require('body-parser')
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

const port = 4000
const mongoose = require('mongoose');
console.log('Mongoose version', mongoose.version);

// const mongoURI = 'mongodb://localhost:27017/test';

// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('mongodb://localhost:27017/test');

mongoose.connect('mongodb://127.0.0.1:27017/test');//, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(error => console.error('Error connecting to MongoDB:', error));

const Users = mongoose.model('Users', { username: String, password: String });
const Products = mongoose.model('Products', { pname: String, pdesc: String, price: String, category : String, pimage: String });
//const connection = mongoose connection;
app.get('/', (req, res) => {
  res.send('hello...')
})

app.post('/add-product',upload.single('pimage'),  (req, res)=>{
  console.log(req.body);
  console.log(req.file.path);
  const pname = req.body.pname;
  const pdesc = req.body.pdesc;
  const price = req.body.price;
  const category = req.body.category;
  const pimage = req.file.path;

  const product = new Products({ pname, pdesc, price, category, pimage})
  product.save()
  .then(() => {
    res.send({ message : 'saved successfully.'})
})
.catch(()=>{
    res.send({ message : 'server error'})
})
  return;
})

app.get('/get-products', (req, res)=>{
   Products.find()
   .then((result)=>{
      console.log(result, "user data")
      res.send({ message: 'success'})
   })
   .catch((err)=>{
    res.send({ message: 'server err'})
   })
})


app.post('/signup', (req, res)=>{
  console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const user = new Users({ username: username, password: password});
    user.save().then(() => {
        res.send({ message : 'saved successfully.'})
})
    .catch(()=>{
        res.send({ message : 'server error'})
    })

})

app.post('/login', (req, res)=>{
  console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    //const user = new Users({ username: username, password: pass });
    
    Users.findOne( { username : username})
    .then((result) => {
        console.log(result, "user data")
        if(!result){
          res.send({ message : 'user not found.'})
        }
        else{

          if(result.password==password){
            const token = jwt.sign({
              data: result
            }, 'MYKEY', {expiresIn: '1h'});
            res.send({ message : 'find success.', token:token})
          }
          if(result.password!=password){
            res.send({ message : 'password wrong.'})
          }
        }
       
})
    .catch(()=>{
        res.send({ message : 'server error'})
    })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
