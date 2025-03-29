import { useEffect, useState } from "react";
import api from "../api";

const Lineups = () => {
  const [lineups, setLineups] = useState([]);
  const [formation, setFormation] = useState("4-4-2");
  const [type, setType] = useState("local");

  // Cargar alineaciones
  useEffect(() => {
    api.get("/lineups").then((response) => setLineups(response.data));
  }, []);

  // Crear alineación
  const createLineup = async () => {
    await api.post("/lineups", { formation, type });
    window.location.reload();
  };

  return (
    <div>
      <h2>Gestión de Alineaciones</h2>
      <select onChange={(e) => setFormation(e.target.value)}>
        <option value="4-4-2">4-4-2</option>
        <option value="4-3-3">4-3-3</option>
        <option value="3-4-3">3-4-3</option>
      </select>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="local">Local</option>
        <option value="visitante">Visitante</option>
      </select>
      <button onClick={createLineup}>Crear</button>

      <ul>
        {lineups.map((lineup) => (
          <li key={lineup.id}>
            {lineup.formation} - {lineup.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lineups;