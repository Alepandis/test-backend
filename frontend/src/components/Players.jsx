import { useEffect, useState } from "react";
import api from "../api";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [dorsal, setDorsal] = useState("");
  const [posicion, setPosicion] = useState("");

  // Cargar jugadores
  useEffect(() => {
    api.get("/players").then((response) => setPlayers(response.data));
  }, []);

  // Agregar jugador
  const addPlayer = async () => {
    if (!nickname || !dorsal || !posicion) {
      return alert("Todos los campos son obligatorios");
    }

    try {
        await api.post(
            "/players",
            { nickname, dorsal, posicion },  // Datos enviados
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        window.location.reload();
    } catch (error) {
        console.error("Error al agregar jugador:", error.response?.data || error.message);
    }
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
      <input placeholder="Posición" onChange={(e) => setPosicion(e.target.value)} />
      <button onClick={addPlayer}>Agregar</button>

      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.nickname} - {player.dorsal} ({player.posicion})
            <button onClick={() => deletePlayer(player.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;