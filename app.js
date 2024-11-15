const express = require("express"); // подключаем express
const http = require("http"); // для создания HTTP сервера
const { Server } = require("socket.io"); // для работы с Socket.IO
const cors = require("cors"); // для разрешения кросс-доменных запросов

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "./state.json"); // __dirname - это путь к текущей директории

const app = express(); // создаем приложение Express
app.use(cors()); // подключаем CORS для работы с запросами с других доменов

const state = require("./state.json");
const { createNewRoom } = require("./Utils/createNewRoom");
const { addRoomToJSON } = require("./Utils/addRoomToJSON");

const server = http.createServer(app); // создаем HTTP сервер
const io = new Server(server, {
  cors: {
    origin: "*", // разрешаем запросы с клиента
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected"); // сообщение о новом подключении
  // console.log("Клиент подключился:", socket.id);

  socket.on("init", (token, callback) => {
    if (token !== "12gfds54-gg") {
      callback({ result: "invalid token" });
      return;
    }
    // Отправляем ответ обратно клиенту через callback
    callback({ data: "success" });
  });

  socket.on("connectToRoomById", (foundRoomId, callback) => {
    // console.log(foundRoomId);
    const foundRoom = state.find((elem) => elem.roomId === foundRoomId);

    // console.log("foundRoom", foundRoom);

    if (!foundRoom) {
      return callback({
        ok: false,
        msg: `Ooops, there is no room with this id - ${foundRoomId}`,
      });
    }

    if (foundRoom.players >= 2) {
      return callback({ ok: false, msg: "This room is already full" });
    }

    // console.log(foundRoom);

    const newState = state.map((elem) => {
      if (elem.roomId === foundRoom.roomId) {
        return { ...elem, players: elem.players + 1 }; // Изменяем только нужный объект
      }
      return elem;
    });
    // console.log("newState", newState);

    fs.writeFile(filePath, JSON.stringify(newState, null, 2), (err) => {
      if (err) {
        console.error("Ошибка записи файла:", err);
        return;
      }

      console.log("+1 Игрок успешно добавлен");
      callback({
        ok: true,
        msg: "connection has been successfull",
        foundRoom: foundRoom,
      });
    });
  });

  socket.on("createNewRoom", (callback) => {
    // console.log("state", state);
    if (state.length >= 15) {
      callback({ ok: false, msg: "There are already too much rooms" });
    }
    const newRoom = createNewRoom();
    addRoomToJSON(newRoom);

    callback({ ok: true, roomId: newRoom.roomId });
  });

  // socket.on("hello", (arg, callback) => {
  //   console.log(arg); // "world"
  //   callback("got it");
  // });
  socket.on("disconnect", () => {
    console.log("A user disconnected"); // сообщение о том, что пользователь отключился
  });
});

// Запускаем сервер на порту 3001
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});

// Отправляем текущее состояние игры новому пользователю
// socket.emit("gameState", gameState);

// Слушаем событие "makeMove" (когда пользователь делает ход)
// socket.on("makeMove", (index, player) => {
//   if (!gameState[index]) {
//     // если клетка не занята
//     gameState[index] = player; // обновляем состояние игры
//     io.emit("gameState", gameState); // отправляем обновленное состояние всем игрокам
//   }
// });

// Сброс игры
// socket.on("resetGame", () => {
//   gameState = Array(9).fill(null); // сбрасываем состояние игры
//   io.emit("gameState", gameState); // отправляем обновление всем игрокам
// });
