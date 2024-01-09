
function CustomInput({ isInput, placeholderText, buttonSvg, handleChange, handleClick }) {
  return (
    <div>
      <div className='flex flex-row my-1'>
        {
          isInput ?
            <input className='p-1 w-96 bg-slate-200 rounded border flex items-center justify-center' type="text" placeholder={placeholderText} onChange={(e) => { handleChange(e.target.value) }} />
            :
            <div className='w-96 bg-slate-200 rounded-l border flex items-center justify-center'>
              {
                placeholderText
              }
            </div>
        }
        {
          buttonSvg !== null ?
            <div className='hover:bg-slate-400 p-2 border transition ease-in-out delay-250 rounded-r flex items-center'>
              <button onClick={handleClick}>
                {buttonSvg}
              </button>
            </div>
            :
            null
        }

      </div>
    </div>
  )
}

export default CustomInput