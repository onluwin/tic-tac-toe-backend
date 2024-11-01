const createNewRoom = () => {
  const result = {
    roomId: getRandomRoomId(),
    board: Array(9).fill(null),
    isXNext: true,
    players: 0,
  };
  return result;
};

function getRandomRoomId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const randomLetters =
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNumbers =
    numbers.charAt(Math.floor(Math.random() * numbers.length)) +
    numbers.charAt(Math.floor(Math.random() * numbers.length)) +
    numbers.charAt(Math.floor(Math.random() * numbers.length));

  return randomLetters + randomNumbers;
}

module.exports = { createNewRoom };
