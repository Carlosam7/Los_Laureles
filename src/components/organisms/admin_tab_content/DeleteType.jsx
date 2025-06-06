import { useEffect, useState } from "react"
import supabase from "../../../utils/supabase"
import { toast } from "sonner"

export function DeleteType({ types, setTypes }) {
  const [selectedType, setSelectedType] = useState(null)
  const [isBtnDisabled, setBtnDisabled] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
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

    const getUsedTypes = async () => {
      const { data, error } = await supabase.from('room').select('*').eq('id_type', selectedType)

      if (error) {
        console.error('Error fetching used types:', error)
        return
      }

      console.log(`type ${selectedType} used by`, data)
      setBtnDisabled(data && data.length > 0)
    }
    getUsedTypes()
  }, [selectedType, types])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsDeleting(true)

    const typeToDelete = types.find(t => t.id === selectedType)

    const deleteType = async () => {
      const { error: typeError } = await supabase.from('type_room').delete().eq('id', selectedType)

      if (typeError) throw typeError

      const { error: detailError } = await supabase.from('detail_room').delete().eq('id', typeToDelete.id_detail)

      if (detailError) throw detailError

      setTypes(types.filter(t => t.id !== selectedType));

      if (types.length > 1) {
        const remainingTypes = types.filter(t => t.id !== selectedType);
        setSelectedType(remainingTypes[0].id);
      } else {
        setSelectedType(null);
      }
    }

    toast.promise(deleteType(), {
      loading: 'Eliminando...',
      success: () => {
        setIsDeleting(false)
        return 'Tipo eliminado'
      },
      error: (errr) => {
        setIsDeleting(false)
        return errr.message
      }
    })

  }

  return (
    <form className="tab-form-delete" onSubmit={handleSubmit}>
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
        <input type="text" placeholder="Standard - King - Queen" value={name} onChange={(e) => setName(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'price' }}>
        <label>Precio/noche</label>
        <input type="text" placeholder="3501" value={price} onChange={(e) => setPrice(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'capacity' }}>
        <label>Capacidad (personas)</label>
        <input type="text" placeholder="2" value={capacity} onChange={(e) => setCapacity(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'description' }}>
        <label>Descripción</label>
        <textarea name="description" placeholder="Habitación cómoda y espaciosa" className="text-box" value={description} onChange={(e) => setDescription(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'size' }}>
        <label>Tamaño</label>
        <input type="text" placeholder="24 m" value={size} onChange={(e) => setSize(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'bathrooms' }}>
        <label>Cantidad de baños</label>
        <input type="text" placeholder="2" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'bedrooms' }}>
        <label>Cantidad de habitaciones</label>
        <input type="text" placeholder="2" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'beds' }}>
        <label>Cantidad de camas</label>
        <input type="text" placeholder="3" value={beds} onChange={(e) => setBeds(e.target.value)} disabled />
      </article>
      <article style={{ gridArea: 'send' }}>
        <button disabled={isBtnDisabled || isDeleting} className={isBtnDisabled ? 'btn-disabled' : ''}>
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </article>
      {
        isBtnDisabled && (
          <p className="text-red-400 text-sm text-balance text-center mt-10" style={{ gridArea: 'assistiveText' }}>No se puede eliminar: existen habitaciones relacionadas a este tipo.</p>
        )
      }
    </form>
  )
}