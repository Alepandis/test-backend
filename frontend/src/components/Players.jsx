import { useEffect, useState } from "react";
import api from "../api";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [dorsal, setDorsal] = useState("");
  const [position, setPosition] = useState("");

  // Cargar jugadores
  useEffect(() => {
    api.get("/players").then((response) => setPlayers(response.data));
  }, []);

  // Agregar jugador
  const addPlayer = async () => {
    if (!nickname || !dorsal || !position) return alert("Todos los campos son obligatorios");
    
    await api.post("/players", { nickname, dorsal, position });
    window.location.reload();
  };

  // Eliminar jugador
  const deletePlayer = async (id) => {
    await api.delete(`/players/${id}`);
    window.location.reload();
  };

  return (
    <div>
      <h2>Gestión de Jugadores</h2>
      <input placeholder="Nickname" onChange={(e) => setNickname(e.target.value)} />
      <input placeholder="Dorsal" type="number" onChange={(e) => setDorsal(e.target.value)} />
      <input placeholder="Posición" onChange={(e) => setPosition(e.target.value)} />
      <button onClick={addPlayer}>Agregar</button>

      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.nickname} - {player.dorsal} ({player.position})
            <button onClick={() => deletePlayer(player.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;