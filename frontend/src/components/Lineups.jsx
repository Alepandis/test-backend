import { useEffect, useState } from "react";
import api from "../api";

const Lineups = () => {
  const [lineups, setLineups] = useState([]);
  const [formacion, setFormacion] = useState("0-0-0");
  const [type, setType] = useState("local");

  // Cargar alineaciones
  useEffect(() => {
    api.get("/lineups").then((response) => setLineups(response.data));
  }, []);

  // Crear alineación
  const createLineup = async () => {
    await api.post("/lineups", { formacion, type });
    window.location.reload();
  };

  return (
    <div>
      <h2>Gestión de Alineaciones</h2>
      <select onChange={(e) => setFormacion(e.target.value)}>
        <option value="3-4-3">3-4-3</option>
      </select>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="local">Local</option>
        <option value="visitante">Visitante</option>
        <option value="defensiva">defensiva</option>
        <option value="equilibrada">equilibrada</option>
        <option value="ofensiva">ofensiva</option>
      </select>
      <button onClick={createLineup}>Crear</button>
      <ul>
        {lineups.map((lineup) => (
          <li key={lineup.id}>
            {lineup.formacion} - {lineup.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lineups;