import { useEffect, useState } from "react";
import api from "../api";

const Actions = () => {
  const [actions, setActions] = useState([]);
  const [type, setType] = useState("gol");
  const [minute, setMinute] = useState("");
  const [dorsal, setDorsal] = useState("");

  useEffect(() => {
    api.get("/actions").then((response) => setActions(response.data));
  }, []);

  const addAction = async () => {
    await api.post("/actions", { type, minute, dorsal: dorsal });
    window.location.reload();
  };

  return (
    <div>
      <h2>Gestión de Acciones</h2>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="gol">Gol</option>
        <option value="asistencia">Asistencia</option>
        <option value="tarjeta amarilla">Tarjeta Amarilla</option>
        <option value="tarjeta roja">Tarjeta Roja</option>
      </select>
      <input type="number" placeholder="Minuto" onChange={(e) => setMinute(e.target.value)} />
      <input type="text" placeholder="ID del jugador" onChange={(e) => setDorsal(e.target.value)} />
      <button onClick={addAction}>Agregar</button>

      <ul>
        {actions.map((action) => (
          <li key={action.id}>
            {action.type} en el minuto {action.minute}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Actions;