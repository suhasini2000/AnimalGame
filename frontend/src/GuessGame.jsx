import React, { useEffect, useState } from "react";

function GuessGame() {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/animals")
      .then((res) => res.json())
      .then((data) => setAnimals(data));
  }, []);

  return (
    <div>
      <h2>Animal Images</h2>
      <div>
        {animals.map((animal) => (
          <div key={animal.id} style={{ marginBottom: "20px" }}>
            <img
              src={`http://localhost:5000${animal.image_url}`}
              alt={animal.name}
              style={{ width: "200px", height: "auto" }}
            />
            <div>{animal.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuessGame;
