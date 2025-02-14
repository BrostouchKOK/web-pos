import React from 'react'

const HomeGrid = ({title, total}) => {
  return (
    <div className='bg-info p-4 my-4' >
      <div className='fs-3 fw-bold'>{title}</div>
      <div className='fs-5'>{total}</div>
    </div>
  )
}

export default HomeGrid
