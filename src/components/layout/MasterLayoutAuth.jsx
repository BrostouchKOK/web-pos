import React from 'react'
import { Outlet } from 'react-router-dom'

const MasterLayoutAuth = () => {
  return (
    <div>
      <div>
        <h1 className='bg-success text-center'>Auth Master Layout</h1>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MasterLayoutAuth
