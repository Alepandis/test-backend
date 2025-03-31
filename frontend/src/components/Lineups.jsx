import { useEffect, useState } from "react";
import api from "../api";

const Lineups = () => {
  const [lineups, setLineups] = useState([]);
  const [formacion, setFormacion] = useState("");
  const [type, setType] = useState("local");
  const [jugadores, setJugadores] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // Cargar alineaciones
  useEffect(() => {
    api.get("/lineups").then((response) => setLineups(response.data));
    api.get("/players")
    .then((response) => {
      console.log("Jugadores:", response.data);
      setJugadores(response.data);})
    .catch((error) => console.error("Error cargando los jugadores:", error));
  }, []);

  // Crear alineación
  const createLineup = async () => {
    await api.post("/lineups", { formacion, type, jugadores: selectedPlayers });
    window.location.reload();
  };

  const handleCheckboxChange = (playerId) => {
    setSelectedPlayers((prevState) =>
      prevState.includes(playerId)
        ? prevState.filter((id) => id !== playerId)
        : [...prevState, playerId]
    );
  };

  return (
    <div>

      <h2>Gestión de Alineaciones</h2>

      <select onChange={(e) => setFormacion(e.target.value)}>
        <option value="5-4-1">5-4-1</option>
        <option value="4-5-1">4-5-1</option>
        <option value="5-3-2">5-3-2</option>
        <option value="4-4-2">4-4-2</option>
        <option value="4-3-3">4-3-3</option>
        <option value="3-4-3">3-4-3</option>
        <option value="3-5-2">3-5-2</option>
      </select>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="local">Local</option>
        <option value="visitante">Visitante</option>
        <option value="defensiva">defensiva</option>
        <option value="equilibrada">equilibrada</option>
        <option value="ofensiva">ofensiva</option>
      </select>

      <div>
        <h3>Selecciona los jugadores:</h3>
        {jugadores.length === 0 ? (
          <p>Cargando jugadores...</p>
        ) : (
          jugadores.map((jugador) => (
            <div key={jugador._id}>
              <input
                type="checkbox"
                id={jugador._id}
                value={jugador._id}
                onChange={() => handleCheckboxChange(jugador._id)}
              />
              <label htmlFor={jugador._id}>{jugador.nickname}</label>
            </div>
          ))
        )}
      </div>

      <button onClick={createLineup}>Crear</button>

      <h2>Alineaciones registradas</h2>

      <ul>
        {lineups.map((lineup) => (
          <li key={lineup.id}>
            {lineup.formacion} - {lineup.type}
            <ul>
              {lineup.jugadores?.map((jugadorId) => {
                const jugador = jugadores.find((jug) => jug._id === jugadorId);
                return jugador ? (
                  <li key={jugador._id}>{jugador.nickname}</li>
                ) : (
                  <li key={jugadorId}>Jugador no encontrado</li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lineups;