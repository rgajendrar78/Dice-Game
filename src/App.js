import { useEffect, useState, useCallback } from "react";

export default function App() {
  const [dice, setDice] = useState([]);
  const [freeze, setFreeze] = useState([]);
  const [rollCount, setRollCount] = useState(0);
  const [win, setWin] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const DICE_COUNT = 10;

  const rollDice = useCallback(() => {
    setDice((prevDice) =>
      prevDice.map((value, index) =>
        freeze[index] ? value : Math.floor(Math.random() * 6) + 1
      )
    );
    setRollCount((prevCount) => prevCount + 1);
  }, [freeze]);

  const toggleFreeze = useCallback((index) => {
    setFreeze((prev) => prev.map((state, i) => (i === index ? !state : state)));
  }, []);

  const reset = useCallback(() => {
    setWin(false);
    setFreeze(Array(DICE_COUNT).fill(false));
    setRollCount(0);
    setGameTime(0);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    const initialDice = Array.from(
      { length: DICE_COUNT },
      () => Math.floor(Math.random() * 6) + 1
    );
    setDice(initialDice);
    setFreeze(Array(DICE_COUNT).fill(false));
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (freeze.every((item) => item)) {
      const allSame = dice.every((item) => item === dice[0]);
      if (allSame) {
        setWin(true);
      }
    }
    if (startTime) {
      setGameTime((Date.now() - startTime) / 1000);
    }
  }, [freeze, dice, startTime]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <h1>Dice Game</h1>
      {!win ? (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              maxWidth: 400,
              flexWrap: "wrap",
              alignItems: "center",
              margin: "0px auto",
            }}
          >
            {dice.map((item, index) => (
              <h1
                key={index}
                style={{
                  backgroundColor: freeze[index] ? "blueviolet" : "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "1px solid grey",
                  cursor: "pointer",
                }}
                onClick={() => toggleFreeze(index)}
              >
                {item}
              </h1>
            ))}
          </div>
          <h1>Roll Count: {rollCount}</h1>
          <button
            style={{
              padding: 10,
              backgroundColor: "blueviolet",
              color: "white",
            }}
            onClick={rollDice}
          >
            Roll Dice
          </button>
        </>
      ) : (
        <>
          <h1>🏆 Wooo! Winner! 🏆</h1>
          <h1>{formatTime(gameTime)} seconds</h1>
          <button onClick={reset}>Play Again</button>
        </>
      )}
    </div>
  );
}
