import { useState } from "react";
import supabase from "../../../utils/supabase";
import { toast } from "sonner";

export function CreateType({ setTypes }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    capacity: "",
    description: "",
    size: "",
    bathrooms: "",
    bedrooms: "",
    beds: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.capacity ||
      !formData.size || !formData.bathrooms || !formData.bedrooms || !formData.beds) {
      toast.error("Todos los campos son requeridos");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: detailData, error: detailError } = await supabase
        .from('detail_room')
        .insert({
          size: formData.size,
          number_bathrooms: formData.bathrooms,
          number_rooms: formData.bedrooms,
          number_beds: formData.beds
        })
        .select()
        .single();

      if (detailError) throw detailError;

      const { data: typeData, error: typeError } = await supabase
        .from('type_room')
        .insert({
          type: formData.name,
          price_day: formData.price,
          capacity: formData.capacity,
          description: formData.description,
          id_detail: detailData.id
        })
        .select(`
          *,
          detail_room: id_detail (
            size,
            number_bathrooms,
            number_rooms,
            number_beds
          )
        `)
        .single();

      if (typeError) throw typeError;

      const newType = {
        ...typeData,
        size: typeData.detail_room.size,
        bathrooms: typeData.detail_room.number_bathrooms,
        bedrooms: typeData.detail_room.number_rooms,
        beds: typeData.detail_room.number_beds
      };

      setTypes(prev => [...prev, newType]);

      setFormData({
        name: "",
        price: "",
        capacity: "",
        description: "",
        size: "",
        bathrooms: "",
        bedrooms: "",
        beds: ""
      });

      toast.success("Tipo de habitación creado exitosamente");
    } catch (error) {
      console.error("Error creating room type:", error);
      toast.error("Error al crear el tipo de habitación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="tab-form-create" onSubmit={handleSubmit} noValidate>
      <article style={{ gridArea: 'type' }}>
        <label>Tipo de habitación</label>
        <input
          type="text"
          placeholder="Standard - King - Queen"
          className="bg-[#EFEFEF]"
          disabled
        />
      </article>

      <article style={{ gridArea: 'name' }}>
        <label>Nombre</label>
        <input
          type="text"
          name="name"
          placeholder="Standard - King - Queen"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </article>

      <article style={{ gridArea: 'price' }}>
        <label>Precio/noche</label>
        <input
          type="number"
          name="price"
          placeholder="250000"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
        />
      </article>

      <article style={{ gridArea: 'capacity' }}>
        <label>Capacidad (personas)</label>
        <input
          type="number"
          name="capacity"
          placeholder="2"
          value={formData.capacity}
          onChange={handleChange}
          required
          min="1"
        />
      </article>

      <article style={{ gridArea: 'description' }}>
        <label>Descripción</label>
        <textarea
          name="description"
          placeholder="Habitación cómoda y espaciosa"
          className="text-box"
          value={formData.description}
          onChange={handleChange}
        />
      </article>

      <article style={{ gridArea: 'size' }}>
        <label>Tamaño</label>
        <input
          type="number"
          name="size"
          placeholder="24"
          value={formData.size}
          onChange={handleChange}
          required
          min="0"
          step="0.1"
        />
      </article>

      <article style={{ gridArea: 'bathrooms' }}>
        <label>Baños</label>
        <input
          type="number"
          name="bathrooms"
          placeholder="2"
          value={formData.bathrooms}
          onChange={handleChange}
          required
          min="0"
        />
      </article>

      <article style={{ gridArea: 'bedrooms' }}>
        <label>Habitaciones</label>
        <input
          type="number"
          name="bedrooms"
          placeholder="2"
          value={formData.bedrooms}
          onChange={handleChange}
          required
          min="0"
        />
      </article>

      <article style={{ gridArea: 'beds' }}>
        <label>Camas</label>
        <input
          type="number"
          name="beds"
          placeholder="3"
          value={formData.beds}
          onChange={handleChange}
          required
          min="0"
        />
      </article>

      <button
        style={{ gridArea: 'send' }}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}