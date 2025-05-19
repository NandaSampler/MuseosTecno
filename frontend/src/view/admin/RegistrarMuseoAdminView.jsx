import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import '../../css/RegistrarMuseo.css';
import { FaUniversity, FaMapMarkerAlt, FaLandmark, FaList, FaClock, FaImage } from 'react-icons/fa';

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
    diasSemana.map(dia => ({ dia, apertura: '', cierre: '', cerrado: false }))
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
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <h4>Datos del Museo</h4>
          <div className="input-group input-group-icon">
            <input type="text" name="nombre" placeholder="Nombre del museo" value={form.nombre} onChange={handleChange} required />
            <div className="input-icon"><FaLandmark /></div>
          </div>
          <div className="input-group input-group-icon">
            <input type="text" name="ubicacion" placeholder="Ubicación" value={form.ubicacion} onChange={handleChange} required />
            <div className="input-icon"><FaMapMarkerAlt /></div>
          </div>
          <div className="input-group">
            <textarea name="historia" placeholder="Historia" value={form.historia} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <select name="departamento_id" value={form.departamento_id} onChange={handleChange} required>
              <option value="">Seleccione un departamento</option>
              {departamentos.map((d) => (
                <option key={d._id} value={d._id}>{d.nombre}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <Select
              options={categoriasDisponibles}
              isMulti
              value={categoriasSeleccionadas}
              onChange={setCategoriasSeleccionadas}
              placeholder="Seleccione categorías..."
            />
          </div>
        </div>

        <div className="row">
          <h4><FaClock /> Horarios</h4>
          {horarios.map((horario, index) => (
            <div key={horario.dia} className="input-group">
              <strong>{horario.dia}</strong>
              <label>
                <input type="checkbox" checked={horario.cerrado} onChange={() => handleCerradoChange(index)} /> Cerrado
              </label>
              {!horario.cerrado && (
                <div className="row">
                  <div className="col-half">
                    <input type="time" value={horario.apertura} onChange={(e) => handleHorarioChange(index, 'apertura', e.target.value)} placeholder="Apertura" />
                  </div>
                  <div className="col-half">
                    <input type="time" value={horario.cierre} onChange={(e) => handleHorarioChange(index, 'cierre', e.target.value)} placeholder="Cierre" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="row">
          <h4><FaImage /> Imágenes</h4>
          <div className="input-group">
            <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} required />
          </div>
          <div className="input-group">
            <input type="file" accept="image/*" multiple onChange={(e) => setGaleria([...e.target.files])} required />
          </div>
        </div>

        <div className="row">
          <button type="submit">Registrar Museo</button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarMuseoAdminView;
