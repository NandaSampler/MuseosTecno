import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import '../../css/NuevaCategoriaView.css';

export default function NuevaCategoriaView() {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert('El nombre no puede quedar vacío.');
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/api/categorias', { nombre: nombre.trim() });
      alert('Categoría creada correctamente');
      setNombre('');
    } catch (err) {
      console.error(err);
      alert('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadmin-container">
      <h2>Agregar Nueva Categoría</h2>
      <form onSubmit={handleSubmit} className="form-nueva-categoria">
        <div className="input-group">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : <><FaPlus /> Agregar</>}
          </button>
        </div>
      </form>
    </div>
  );
}
