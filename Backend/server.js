const express = require("express");
const app = express();
const uuidv1 = require('uuid/v1');
const cors = require('cors')
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const file = require('./chatdb.json')
const fs = require("fs");
const fse = require('fs-extra')

app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

 
//---------------------------- GET ALL ROOMS  ---------------------------------//

app.get("/rooms", function (req, res) {
  res.status(200).send(file);
})

//------------------------------- ADD ROOM  -----------------------------------//

app.post("/rooms", function (req, res) {
  if (!req.body || !req.body.name) {
    res.status(400).end();
    return;
  }
  console.log(req.body.name)
  let room = {
    id: uuidv1(),
    name: req.body.name,
    msg: []

  };
  file.rooms.push({ room })

  fs.writeFile("./chatdb.json", JSON.stringify(file), err => {
    if (err) {
      res.status(500).end();
      return;
    }
    res.status(201).json(file);

  });
});


//------------------------------- GET MESSAGES BY ID OF ROOM -----------------------------//

app.get("/room/:id", function (req, res) {
  const id = req.params.id;

  if (!id) {
    res.status(400).end();
    return;
  }
  let room = file.rooms.find(el => el.room.id == id);
  if (room) {
    res.json(room);
  } else {
    res.status(404).end();
  }
})


//------------------------------- ADD MESSAGES -----------------------------------//

io.on('connection', (socket) => {
  socket.on('new_message', (message) => {
    io.emit('new_message', message)

    let id = message.id
    let selectedRoom = file.rooms.find(temp => temp.room.id == id)

    if (selectedRoom !== -1) {

      let newMessage = selectedRoom.room.msg

      newMessage.push(message.msg)

      fs.writeFile('chatdb.json', JSON.stringify(file), 'utf-8', (err) => {
        if (err) {
          console.log(err)
        }
      })
    }
  });
});



//------------------------------- DELETE ROOM -----------------------------------//

app.delete("/room/:id", function (req, res) {

  const id = req.params.id;
  const rooms = file.rooms;
  const selectedRoom = rooms.findIndex(data => data.room.id == id)
  const room = rooms[selectedRoom];
  const name = room.name;


  fse.remove(`./rooms/${name}.json`, err => {

    if (err) {
      res.status(500).end;
      return;
    }

    rooms.splice(selectedRoom, 1);

    res.status(204).end();

    fs.writeFile("./chatdb.json", JSON.stringify({ rooms }), err => {
      if (err) {
        res.status(500).end();
      }

      res.status(204).end();
    });
  });

});


const PORT = 8091;
server.listen(PORT, () => console.log(`listening on ${PORT}`));
