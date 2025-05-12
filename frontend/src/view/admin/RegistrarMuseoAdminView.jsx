import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import '../../css/RegistrarMuseo.css';

const diasSemana = [
  "Lunes", "Martes", "Miércoles", "Jueves",
  "Viernes", "Sábado", "Domingo", "Feriado"
];

const RegistrarMuseoAdminView = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    ubicacion: '',
    historia: '',
    descripcion: '',
    departamento_id: ''
  });

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [horarios, setHorarios] = useState(
    diasSemana.map(dia => ({
      dia,
      apertura: '',
      cierre: '',
      cerrado: false
    }))
  );

  const [foto, setFoto] = useState(null);
  const [galeria, setGaleria] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/departamentos')
      .then(res => setDepartamentos(res.data))
      .catch(err => console.error('Error al obtener departamentos', err));

    axios.get('http://localhost:4000/api/categorias')
      .then(res => setCategoriasDisponibles(
        res.data.map(cat => ({ value: cat._id, label: cat.nombre }))
      ))
      .catch(err => console.error('Error al obtener categorías', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleHorarioChange = (index, field, value) => {
    setHorarios(prev => {
      const copia = [...prev];
      copia[index][field] = value;
      return copia;
    });
  };

  const handleCerradoChange = (index) => {
    setHorarios(prev => {
      const copia = [...prev];
      copia[index].cerrado = !copia[index].cerrado;
      if (copia[index].cerrado) {
        copia[index].apertura = '';
        copia[index].cierre = '';
      }
      return copia;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foto || galeria.length < 2) {
      return alert("Debe subir una foto principal y al menos 2 imágenes en la galería.");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append('foto', foto);
    galeria.forEach(img => formData.append('galeria', img));

    const categoriasId = categoriasSeleccionadas.map(c => c.value);
    formData.append('categorias', JSON.stringify(categoriasId));

    const horariosValidos = horarios.filter(h => !h.cerrado);
    formData.append('horarios', JSON.stringify(horariosValidos));

    try {
      const res = await axios.post('http://localhost:4000/api/museos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Museo registrado correctamente");
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

        <label>Categorías:</label>
        <Select
          options={categoriasDisponibles}
          isMulti
          value={categoriasSeleccionadas}
          onChange={setCategoriasSeleccionadas}
          placeholder="Seleccione categorías..."
        />

        <div className="horarios-box">
          <h3>Horarios</h3>
          {horarios.map((horario, index) => (
            <div key={horario.dia} className="horario-dia">
              <div className="horario-header">
                <strong>{horario.dia}</strong>
                <label className="cerrado-label">
                  <input
                    type="checkbox"
                    checked={horario.cerrado}
                    onChange={() => handleCerradoChange(index)}
                  />
                  Cerrado
                </label>
              </div>

              {!horario.cerrado && (
                <div className="horas-flex">
                  <label>
                    Apertura:
                    <input
                      type="time"
                      value={horario.apertura}
                      onChange={(e) => handleHorarioChange(index, 'apertura', e.target.value)}
                    />
                  </label>
                  <label>
                    Cierre:
                    <input
                      type="time"
                      value={horario.cierre}
                      onChange={(e) => handleHorarioChange(index, 'cierre', e.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <label>Foto principal:
          <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} required />
        </label>

        <label>Galería (mínimo 2 imágenes):
          <input type="file" accept="image/*" multiple onChange={(e) => setGaleria([...e.target.files])} required />
        </label>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistrarMuseoAdminView;