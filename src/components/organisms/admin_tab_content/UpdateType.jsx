import { useEffect, useState } from "react"
import supabase from "../../../utils/supabase"
import { toast } from "sonner"

export function UpdateType({ types, setTypes }) {
  const [selectedType, setSelectedType] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [capacity, setCapacity] = useState('')
  const [description, setDescription] = useState('')
  const [size, setSize] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [beds, setBeds] = useState('')

  useEffect(() => {
    if (types.length > 0 && !selectedType) {
      setSelectedType(types[0].id)
    }
  }, [types, selectedType])

  useEffect(() => {
    if (!selectedType || types.length === 0) return;

    const selected = types.find((t) => t.id === selectedType)
    if (selected) {
      setName(selected.type)
      setPrice(selected.price_day)
      setCapacity(selected.capacity)
      setDescription(selected.description)
      setSize(selected.size)
      setBathrooms(selected.bathrooms)
      setBedrooms(selected.bedrooms)
      setBeds(selected.beds)
    }
  }, [selectedType, types])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedType || !name || !price || !capacity || !description || !size || !bathrooms || !bedrooms || !beds) {
      toast.error('Por favor, completa todos los campos')
      return
    }

    const updatePromise = async () => {
      const { error } = await supabase.from('type_room').update({
        type: name,
        price_day: price,
        capacity: capacity,
        description: description
      }).eq('id', selectedType)

      if (error) {
        console.error('Error updating room type:', error)
        toast.error('Error al actualizar el tipo de habitación')
        return
      }

      const typeData = types.find(t => t.id === selectedType)

      const { error: detailError } = await supabase.from('detail_room').update({
        size: size,
        number_bathrooms: bathrooms,
        number_rooms: bedrooms,
        number_beds: beds
      }).eq('id', typeData.id_detail)

      if (detailError) {
        console.error('Error updating room detail:', detailError)
        toast.error('Error al actualizar los detalles del tipo de habitación')
        return
      }
    }

    toast.promise(updatePromise(), {
      loading: 'Actualizando...',
      success: () => {
        const updatedTypes = types.map(t =>
          t.id === selectedType
            ? { ...t, type: name, price_day: price, capacity, description, size, bathrooms, bedrooms, beds }
            : t
        )
        setTypes(updatedTypes)
        return 'Tipo de habitación actualizado con éxito'
      },
      error: 'Ha ocurrido un error al actualizar el tipo de habitación'
    })
  }

  return (
    <form className="tab-form-update" onSubmit={handleSubmit}>
      <article style={{ gridArea: 'type' }}>
        <label>Tipo de habitación</label>
        <select value={selectedType ?? ''} onChange={(e) => setSelectedType(parseInt(e.target.value))}>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.type}
            </option>
          ))}
        </select>
      </article>
      <article style={{ gridArea: 'name' }}>
        <label>Nombre</label>
        <input type="text" placeholder="Standard - King - Queen" value={name} onChange={(e) => setName(e.target.value)} />
      </article>
      <article style={{ gridArea: 'price' }}>
        <label>Precio/noche</label>
        <input type="number" placeholder="250000" value={price} onChange={(e) => setPrice(e.target.value)} />
      </article>
      <article style={{ gridArea: 'capacity' }}>
        <label>Capacidad (personas)</label>
        <input type="number" placeholder="2" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
      </article>
      <article style={{ gridArea: 'description' }}>
        <label>Descripción</label>
        <textarea name="description" placeholder="Habitación cómoda y espaciosa" className="text-box" value={description} onChange={(e) => setDescription(e.target.value)} />
      </article>
      <article style={{ gridArea: 'size' }}>
        <label>Tamaño</label>
        <input type="number" placeholder="24 m" value={size} onChange={(e) => setSize(e.target.value)} />
      </article>
      <article style={{ gridArea: 'bathrooms' }}>
        <label>Cantidad de baños</label>
        <input type="number" placeholder="2" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
      </article>
      <article style={{ gridArea: 'bedrooms' }}>
        <label>Cantidad de habitaciones</label>
        <input type="number" placeholder="2" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
      </article>
      <article style={{ gridArea: 'beds' }}>
        <label>Cantidad de camas</label>
        <input type="number" placeholder="3" value={beds} onChange={(e) => setBeds(e.target.value)} />
      </article>
      <button style={{ gridArea: 'send' }}>Actualizar</button>
    </form>
  )
}
