"use client";
import { useState } from "react";

export default function ClientWorkout() {
  const [code, setCode] = useState("");
  const [workouts, setWorkouts] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState("");

  // Fetch by code
  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/workouts/${code}`);
      const data = await res.json();
      if (res.ok) {
        setWorkouts(data.workouts);
        const names = Object.keys(data.workouts || {}).sort();
        if (names.length) setSelectedWorkout(names[0]);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch");
    }
  };

  // Beginner workout handler
  const handleBeginner = async () => {
    const beginnerCode = "iniciantes";
    setCode(beginnerCode);
    try {
      const res = await fetch(`/api/workouts/${beginnerCode}`);
      const data = await res.json();
      if (res.ok) {
        setWorkouts(data.workouts);
        const names = Object.keys(data.workouts || {}).sort();
        if (names.length) setSelectedWorkout(names[0]);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load beginner workout");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#f68635]">
          Digit Seu Código
        </h1>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="e.g., JS1234"
            className="p-3 w-full sm:w-64 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 w-full sm:w-auto bg-[#f68635] text-white rounded-lg hover:bg-[#d66e2c] transition duration-200"
          >
            Buscar Treino
          </button>
          <button
            onClick={handleBeginner}
            className="px-4 py-2 w-full sm:w-auto bg-[#4caf50] text-white rounded-lg hover:bg-[#43a047] transition duration-200"
          >
            Treino Iniciante
          </button>
        </div>

        {workouts && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#f68635]">
              Selecione Seu Treino
            </h2>
            <select
              value={selectedWorkout}
              onChange={(e) => setSelectedWorkout(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#f68635]"
            >
              {Object.keys(workouts)
                .sort()
                .map((workoutName) => (
                  <option key={workoutName} value={workoutName}>
                    {workoutName}
                  </option>
                ))}
            </select>
            {selectedWorkout && workouts[selectedWorkout] && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-[#f68635]">
                  {selectedWorkout}
                </h3>
                <ul className="space-y-4">
                  {workouts[selectedWorkout].exercises.map(
                    (exercise, index) => (
                      <li
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                          <img
                            src={`/gifs/${exercise.demoGif}`}
                            alt={`${exercise.name} Demo`}
                            className="w-full sm:w-48 h-auto rounded-lg border border-[#d66e2c]"
                          />
                          <div>
                            <strong className="text-lg">{exercise.name}</strong>
                            : {exercise.sets} séries de {exercise.reps}{" "}
                            repetições
                            {exercise.notes && (
                              <p className="mt-2 text-gray-300">
                                Obs: {exercise.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
