import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimalLetterInputs from "./AnimalLetterInputs"; // <-- Add this line
import ScoreBoard from "./ScoreBoard";


const AnimalGame = () => {
  const [animals, setAnimals] = useState([]);
  const [index, setIndex] = useState(0);
  const [inputLetters, setInputLetters] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0); 


  // Fetch animals on load
  useEffect(() => {
    axios.get("/api/animals")
      .then((res) => {
        setAnimals(res.data);
      })
      .catch((err) => {
        console.error("Error fetching animals:", err);
      });
  }, []);

  // Setup input boxes when animal changes
  useEffect(() => {
    if (animals.length > 0 && animals[index]) {
      const current = animals[index];
      // Pre-fill alternate letters, others blank
      const letters = Array.from(current.name).map((ch, i) =>
        i % 2 === 0 ? ch : ""
      );
      setInputLetters(letters);
      setFeedback("");
    }
  }, [animals, index]);

  // Handle letter typing
  const handleChange = (i, value) => {
    if (!animals[index]) return;
    const letters = [...inputLetters];
    // Only allow typing in blank positions (odd indices)
    if (i % 2 !== 0) {
      letters[i] = value.toLowerCase();
      setInputLetters(letters);

      const guess = letters.join("");
      const actual = animals[index].name.toLowerCase();

      if (guess === actual) {
        setFeedback("✅ Correct!");
        setScore((prev) => prev + 1); 

      } else {
        setFeedback("Wrong guess, keep trying!");
      }
    }
  };

  // Go to next animal
  const handleNext = () => {
    if (animals.length === 0) return;
    if (index < animals.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
  setIndex(0);
  setScore(0);
  setFeedback("");
  if (animals.length > 0) {
    const first = animals[0];
    const letters = Array.from(first.name).map((ch, i) =>
      i % 2 === 0 ? ch : ""
    );
    setInputLetters(letters);
  }
};

  if (animals.length === 0 || !animals[index]) return <p>Loading...</p>;

  const current = animals[index];
  const isGameOver = index === animals.length - 1;

  return (
  <div className="animal-game-bg">
    <div className="animal-game-box">
      <h2>Guess the Animal</h2>
      <ScoreBoard score={score} total={animals.length} />

      <img
        src={current.image_url}
        alt="animal"
        className="animal-image"
      />

      <AnimalLetterInputs
        inputLetters={inputLetters}
        animalName={current.name}
        onChange={handleChange}
      />

      <div className="animal-feedback">{feedback}</div>

      <button
        onClick={handleNext}
        style={{ marginTop: "20px", padding: "10px 20px" }}
        disabled={animals.length === 0 || isGameOver}
      >
        Next
      </button>

      {isGameOver && (
        <div className="animal-game-over">
          🎉 Game Over! Your score: {score} / {animals.length}
          <br />
          <button
            onClick={handleRestart}
            style={{ marginTop: "16px", padding: "8px 20px" }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  </div>
);

};

export default AnimalGame;
