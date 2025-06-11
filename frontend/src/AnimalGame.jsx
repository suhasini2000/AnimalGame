import React, { useEffect, useState } from "react";
import axios from "axios";

const AnimalGame = () => {
  const [animals, setAnimals] = useState([]);
  const [index, setIndex] = useState(0);
  const [inputLetters, setInputLetters] = useState([]);
  const [feedback, setFeedback] = useState("");

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
      } else {
        setFeedback("");
      }
    }
  };

  // Go to next animal
  const handleNext = () => {
    if (animals.length === 0) return;
    setIndex((prev) => (prev + 1) % animals.length);
  };

  if (animals.length === 0 || !animals[index]) return <p>Loading...</p>;

  const current = animals[index];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Guess the Animal</h2>
      <img
        src={current.image_url}
        alt="animal"
        style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "12px" }}
      />

      <div style={{ margin: "20px", fontSize: "24px" }}>
        {inputLetters.map((letter, i) =>
          i % 2 === 0 ? (
            // Show alternate letter as read-only
            <input
              key={i}
              type="text"
              value={letter}
              readOnly
              style={{
                width: "40px",
                height: "40px",
                fontSize: "24px",
                textAlign: "center",
                marginRight: "5px",
                background: "#eee",
                border: "1px solid #ccc"
              }}
            />
          ) : (
            // Allow typing in the other positions
            <input
              key={i}
              type="text"
              value={letter}
              maxLength={1}
              onChange={(e) => handleChange(i, e.target.value)}
              style={{
                width: "40px",
                height: "40px",
                fontSize: "24px",
                textAlign: "center",
                marginRight: "5px"
              }}
            />
          )
        )}
      </div>

      <div style={{ fontSize: "20px", color: "green", height: "24px" }}>{feedback}</div>

      <button
        onClick={handleNext}
        style={{ marginTop: "20px", padding: "10px 20px" }}
        disabled={animals.length === 0}
      >
        Next
      </button>
    </div>
  );
};

export default AnimalGame;