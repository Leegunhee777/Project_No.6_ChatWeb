const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


/////////// socket.io를 위한 서버처리 1
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
  cors: {
    methods: ['GET', 'POST'],
  },
})
///////////////


const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());


const { Chat } = require("./models/Chat");
const {auth} = require("./middleware/auth");

app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'))
/////////////////////////////////////////////////
//채팅 파일 업로드 처리를 위한것
//npm install multer --save
const multer = require("multer");


var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'uploads/')
  },
  filename: function(req, file, cb){
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, res, cb)=>{
    const ext = path.extname(file.originalname)
    
    if(ext !== '.jpg' && ext !== '.png' && ext !== '.mp4'){
      return cb(res.status(400).end('only jpg,png,mp4 is allowed'), false)
    }
    cb(null, true)
  }
})

var upload = multer({storage:storage}).single('file');
//post 처리안에서 upload()함수를 발동시키면, client에서 온 파일data를
//uploads폴더안에 저장시키고, uploads폴더안의 파일 path를 응답한다.
app.post("/api/chat/uploadfiles",auth, (req, res)=>{
  upload(req, res, err => {
    if(err){
      return res.json({ success: false, err})
    }
    return res.json({success: true, url: res.req.file.path}); //uploads폴더안에있는 파일경로req.file.path를 client측에 보내줌
  })
});
///////////////////////////////////////////////////////////////



/////////// socket.io를 위한 서버처리 2
io.on("connection", socket => {
  socket.on("Input Chat Message", msg => {

    connect.then(db => {
      
      try {
          let chat = new Chat({ message: msg.chatMessage, sender:msg.userId, type: msg.type })
        
          chat.save((err, doc) => {
            if(err) return res.json({ success: false, err })

            Chat.find({ "_id": doc._id })
            .populate("sender")
            .exec((err, doc)=> {

                return io.emit("Output Chat Message", doc);
            })
          })
      } catch (error) {
        console.error(error);
      }
    }) 
   })



})

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads')); // string의 /upload/를만나면 실제 uploads폴더와 매칭시켜준다. 우리의 파일을 정상적으로 렌더시키기위한 조치임

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000


/////////// socket.io를 위한 서버처리 3 listen앞을 바꿔줘야함
server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});