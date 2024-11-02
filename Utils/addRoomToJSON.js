const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../state.json"); // __dirname - это путь к текущей директории

const addRoomToJSON = (newRoom) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Ошибка чтения файла:", err);
      return;
    }

    // Парсим JSON данные
    const jsonData = JSON.parse(data);
    console.log("jsonData", jsonData);

    // Добавляем новый объект в массив rooms
    jsonData.push(newRoom);

    // Записываем обновленный массив обратно в файл
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Ошибка записи файла:", err);
        return;
      }
      console.log("Новый объект успешно добавлен!");
    });
  });
};

module.exports = { addRoomToJSON };
