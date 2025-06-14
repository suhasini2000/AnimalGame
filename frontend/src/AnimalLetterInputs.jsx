import React, { useEffect, useState } from "react";
import axios from "axios";

// --- New component for letter inputs ---
const AnimalLetterInputs = ({ inputLetters, animalName, onChange }) => {
  return (
    <div style={{ margin: "20px", fontSize: "24px" }}>
      {inputLetters.map((letter, i) =>
        i % 2 === 0 ? (
          <input
            key={i}
            type="text"
            value={letter}
            readOnly
            aria-label={`Letter ${i + 1} (given)`}
            tabIndex={-1}
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
          <input
            key={i}
            type="text"
            value={letter}
            maxLength={1}
            aria-label={`Letter ${i + 1} (type your guess)`}
            tabIndex={0}
            onChange={e => onChange(i, e.target.value)}
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
  );
};
export default AnimalLetterInputs;
// --- end new component ---

