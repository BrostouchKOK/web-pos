import React from 'react'
import { Outlet } from 'react-router-dom'

const MasterLayout = () => {
  return (
    <div>
      <div>
        <h1 className='bg-info'>Master Layout</h1>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MasterLayout
