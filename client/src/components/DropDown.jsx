import { useState } from 'react'

function DropDown({ text, element }) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    const curr = open
    setOpen(!curr)
  }

  return (
    <div className='flex flex-col w-fit p-2 bg-slate-300'>
      <div onClick={handleOpen}>
        {text}
      </div>
      {
        open ?
          <div>
            {element}
          </div>
          :
          null
      }
    </div>
  )
}

export default DropDown