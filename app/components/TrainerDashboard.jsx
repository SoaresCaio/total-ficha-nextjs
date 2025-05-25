"use client";

import { useState } from "react";

export default function TrainerDashboard() {
  // ––––––– Separate code states –––––––
  const [loadCode, setLoadCode] = useState("");
  const [createCode, setCreateCode] = useState("");

  // ––––––– Authentication –––––––
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // ––––––– Loaded workouts –––––––
  const [workouts, setWorkouts] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState("");

  // ––––––– New workout form –––––––
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", notes: "", demoGif: "" },
  ]);

  // ––––––– Shared GIF options –––––––
  const availableGifs = [
    { value: "", label: "None" },
    { value: "abdutora.gif", label: "Abdutora" },
    { value: "adutora.gif", label: "Adutora" },
    { value: "abinfra.gif", label: "Abdominal Infra" },
    { value: "absupra.gif", label: "Abdominal Supra" },
    { value: "prancha.gif", label: "Abdominal Prancha" },
    { value: "agachamentolivre.gif", label: "Agachamento Livre" },

    { value: "agachamentosmith.gif", label: "Agachamento Smith" },
    { value: "agachamentosumo.gif", label: "Agachamento Sumo" },
    { value: "bulgaro.gif", label: "Bulgaro" },
    { value: "cadeiraflexora.gif", label: "Cadeira Flexora" },
    { value: "crossover.gif", label: "Crossover" },
    { value: "crucifixohalteres.gif", label: "Crucifixo" },
    { value: "crucifixoinclinado.gif", label: "Crucifixo Inclinado" },
    { value: "crucifixoinverso.gif", label: "Crucifixo Inverso" },
    {
      value: "desenvolvimentohalteres.gif",
      label: "Desenvolvimento c/ Halteres",
    },
    { value: "elevacaofrontal.gif", label: "Elevação Frontal" },
    { value: "elevacaolateral.gif", label: "Elevação Lateral" },
    { value: "elevacaopelvica.gif", label: "Elevação Pelvica" },
    { value: "extensora.gif", label: "Extensora" },
    { value: "facepull.gif", label: "Face Pull" },
    { value: "hack.gif", label: "Agachamento Hack" },
    { value: "hiperextensão.gif", label: "Hiperextensão Lombar" },
    { value: "legpress.gif", label: "Leg Press 45" },
    { value: "levantamentoterra.gif", label: "Levantamento Terra" },
    { value: "mesaflexora.gif", label: "Mesa Flexora" },
    { value: "puxadaalta.gif", label: "Puxada Alta" },
    { value: "panturrilhaempé.gif", label: "Panturrilha Em Pé" },
    { value: "panturrilhasentado.gif", label: "Panturrilha Sentado" },
    { value: "peckdeck.gif", label: "Peck Deck" },
    { value: "passada.gif", label: "Passada" },
    { value: "remadaalta.gif", label: "Remada Alta" },
    { value: "remadaarticuladapron.gif", label: "Remada Articulada Pronada" },
    { value: "remadabaixa.gif", label: "Remada Baixa" },
    { value: "remadacurvadapronada.gif", label: "Remada Curvada Pronada" },
    { value: "remadacurvadasupinada.gif", label: "Remada Curvada Supinada" },
    { value: "rolinho.gif", label: "Abdominal Rolinho" },
    { value: "roscaalternada.gif", label: "Rosca Alternada" },
    { value: "roscadireta.gif", label: "Rosca Direta" },
    { value: "roscadiretacabo.gif", label: "Rosca Direta Pulley" },
    { value: "roscamartelo.gif", label: "Rosca Martelo" },
    { value: "roscascott.gif", label: "Rosca Scott" },
    { value: "roscascottmaquina.gif", label: "Rosca Scott Máquina" },
    { value: "stiff.gif", label: "Stiff" },
    {
      value: "supinoinclinadohalteres.gif",
      label: "Supino Inclinado c/ Halteres",
    },
    { value: "supinoreto.gif", label: "Supino Reto Barra" },
    { value: "supinodeclinado.gif", label: "Supino Declinado Máquina" },
    { value: "supinoinclinado.gif", label: "Supino Inclinado Barra" },
    { value: "supinoinclinadoart.gif", label: "Supino Inclinado Articulado" },
    { value: "tricepspulley.gif", label: "Triceps Pulley" },
    { value: "tricepstestacabo.gif", label: "Triceps Testa Cabo" },
  ];

  // ––––––– Handlers –––––––

  const handleAuth = () => {
    if (passcode === process.env.NEXT_PUBLIC_TRAINER_PASSCODE) {
      setAuthenticated(true);
    } else {
      alert("Wrong passcode!");
    }
  };

  const handleFetchWorkouts = async () => {
    if (!loadCode) {
      alert("Enter a code to load");
      return;
    }
    try {
      const res = await fetch(`/api/workouts/${loadCode.toLowerCase()}`);
      const data = await res.json();
      if (res.ok) {
        setWorkouts(data.workouts || {});
        const names = Object.keys(data.workouts || {}).sort();
        setSelectedWorkout(names[0] || "");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch workouts");
    }
  };

  const handleAddExercise = () =>
    setExercises((exs) => [
      ...exs,
      { name: "", sets: "", reps: "", notes: "", demoGif: "" },
    ]);
  const handleRemoveExercise = (i) =>
    setExercises((exs) => exs.filter((_, idx) => idx !== i));
  const handleExerciseChange = (i, field, value) =>
    setExercises((exs) =>
      exs.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex))
    );

  const handleSubmit = async () => {
    if (!createCode) {
      alert("Enter a code to save under");
      return;
    }
    if (!workoutName) {
      alert("Enter a workout name");
      return;
    }
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: createCode.toLowerCase(),
          workoutName,
          exercises,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Workout saved!");
        setWorkoutName("");
        setExercises([
          { name: "", sets: "", reps: "", notes: "", demoGif: "" },
        ]);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save workout");
    }
  };

  const handleDeleteWorkout = async (toDelete) => {
    if (!window.confirm(`Delete workout "${toDelete}"?`)) return;
    try {
      const res = await fetch(
        `/api/workouts/${loadCode.toLowerCase()}/${toDelete}`,
        { method: "DELETE" }
      );
      let data = {};
      try {
        data = await res.json();
      } catch {}
      if (res.ok) {
        alert(data.message || "Workout deleted!");
        handleFetchWorkouts();
      } else {
        alert(data.error || "Failed to delete workout");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete workout");
    }
  };

  const handleDeleteUser = async () => {
    if (!loadCode) {
      alert("Enter a code to delete");
      return;
    }
    if (
      !window.confirm(
        `⚠️ This will remove ALL workouts under '${loadCode}'. Continue?`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/workouts/${loadCode.toLowerCase()}`, {
        method: "DELETE",
      });
      let data = {};
      try {
        data = await res.json();
      } catch {}
      if (res.ok) {
        alert(data.message || "User deleted!");
        setWorkouts(null);
        setSelectedWorkout("");
        setLoadCode("");
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // ––––––– Edit existing workout –––––––
  const handleEditWorkout = () => {
    if (!selectedWorkout) {
      alert("Selecione um treino para editar");
      return;
    }
    setCreateCode(loadCode);
    setWorkoutName(selectedWorkout);
    setExercises(workouts[selectedWorkout].exercises.slice());
  };

  // ––––––– Render –––––––

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-sm w-full">
          <h1 className="text-3xl text-center mb-4 text-[#f68635]">
            Trainer Login
          </h1>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-[#f68635]"
          />
          <button
            onClick={handleAuth}
            className="mt-4 w-full py-2 bg-[#f68635] rounded hover:bg-[#d66e2c] transition"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* — Panel A: Procurar/Deletar Usuário — */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#f68635]">
            Procurar/Deletar Usuário
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={loadCode}
              onChange={(e) => setLoadCode(e.target.value)}
              placeholder="ex: usuário123"
              className="flex-1 p-3 bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-[#f68635]"
            />
            <button
              onClick={handleFetchWorkouts}
              className="px-6 py-2 bg-[#f68635] rounded hover:bg-[#d66e2c] transition"
            >
              Procurar
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-6 py-2 bg-red-600 rounded hover:bg-red-500 transition"
            >
              Deletar Usuário
            </button>
          </div>
        </section>

        {/* — Panel B: Criar / Salvar Treino — */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#f68635]">
            Criar / Salvar Treino
          </h2>
          <input
            type="text"
            value={createCode}
            onChange={(e) => setCreateCode(e.target.value)}
            placeholder="salvar treino em usuário123"
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-[#f68635]"
          />
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="nome do treino (costas, peito, etc)"
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-[#f68635]"
          />

          {exercises.map((ex, i) => (
            <div
              key={i}
              className="p-4 bg-gray-800 rounded border border-gray-700 space-y-2"
            >
              <div className="flex justify-between items-center">
                <strong>Exercício {i + 1}</strong>
                <button
                  onClick={() => handleRemoveExercise(i)}
                  className="text-red-500 hover:underline"
                >
                  Remover
                </button>
              </div>
              <input
                type="text"
                placeholder="Nome do exercício"
                value={ex.name}
                onChange={(e) =>
                  handleExerciseChange(i, "name", e.target.value)
                }
                className="w-full p-2 bg-gray-900 rounded border border-gray-700"
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="séries"
                  value={ex.sets}
                  onChange={(e) =>
                    handleExerciseChange(i, "sets", e.target.value)
                  }
                  className="flex-1 p-2 bg-gray-900 rounded border border-gray-700"
                />
                <input
                  type="number"
                  placeholder="repetições"
                  value={ex.reps}
                  onChange={(e) =>
                    handleExerciseChange(i, "reps", e.target.value)
                  }
                  className="flex-1 p-2 bg-gray-900 rounded border border-gray-700"
                />
              </div>
              <textarea
                placeholder="descrição"
                value={ex.notes}
                onChange={(e) =>
                  handleExerciseChange(i, "notes", e.target.value)
                }
                className="w-full p-2 bg-gray-900 rounded border border-gray-700"
              />
              <select
                value={ex.demoGif}
                onChange={(e) =>
                  handleExerciseChange(i, "demoGif", e.target.value)
                }
                className="w-full p-2 bg-gray-900 rounded border border-gray-700"
              >
                {availableGifs.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              onClick={handleAddExercise}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              Adicionar Exercício
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#f68635] rounded hover:bg-[#d66e2c] transition"
            >
              Salvar Treino
            </button>
          </div>
        </section>

        {/* — Existing Workouts & Edit/Delete Workout — */}
        {workouts && (
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#f68635]">
              Your Workouts
            </h2>
            <div className="flex space-x-4">
              <select
                value={selectedWorkout}
                onChange={(e) => setSelectedWorkout(e.target.value)}
                className="flex-1 p-3 bg-gray-800 rounded border border-gray-700"
              >
                {Object.keys(workouts)
                  .sort()
                  .map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleEditWorkout}
                className="px-6 py-2 bg-[#2196f3] rounded hover:bg-[#1976d2] transition"
              >
                Editar Treino
              </button>
              <button
                onClick={() => handleDeleteWorkout(selectedWorkout)}
                className="px-6 py-2 bg-red-600 rounded hover:bg-red-500 transition"
              >
                Deletar Treino
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
