import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/RegistrarMuseo.css'; // Asegúrate de crear este archivo

const RegistrarMuseoAdminView = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    ubicacion: '',
    historia: '',
    descripcion: '',
    departamento_id: '',
  });
  const [foto, setFoto] = useState(null);
  const [galeria, setGaleria] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/departamentos')
      .then(res => setDepartamentos(res.data))
      .catch(err => console.error('Error al obtener departamentos', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foto || galeria.length < 2) {
      return alert("Debe subir una foto principal y al menos 2 imágenes en la galería.");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append('foto', foto);
    for (let img of galeria) formData.append('galeria', img);

    try {
      const res = await axios.post('http://localhost:4000/api/museos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Museo registrado correctamente");
      console.log(res.data);
    } catch (error) {
      alert("Error al registrar el museo");
      console.error(error);
    }
  };

  return (
    <div className="registro-container">
      <h2>Registrar nuevo museo</h2>
      <form onSubmit={handleSubmit} className="form-museo">
        <label>Nombre del museo:
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>

        <label>Ubicación:
          <input type="text" name="ubicacion" value={form.ubicacion} onChange={handleChange} required />
        </label>

        <label>Historia:
          <textarea name="historia" value={form.historia} onChange={handleChange} required />
        </label>

        <label>Descripción:
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
        </label>

        <label>Departamento:
          <select name="departamento_id" value={form.departamento_id} onChange={handleChange} required>
            <option value="">Seleccione un departamento</option>
            {departamentos.map((d) => (
              <option key={d._id} value={d._id}>{d.nombre}</option>
            ))}
          </select>
        </label>

        <label>Foto principal:
          <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} required />
        </label>

        <label>Galería (mínimo 3 imágenes):
          <input type="file" accept="image/*" multiple onChange={(e) => setGaleria([...e.target.files])} required />
        </label>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistrarMuseoAdminView;
