import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Seller from './pages/Seller'
import Invoice from './pages/Invoice'
import Addseller from './pages/Addseller'
import Addinvoicestep1 from './pages/Addinvoicestep1'
import AddItems from './pages/AddItems'
import Viewinvoice from './pages/Viewinvoice'


const AllRoute = () => {


  return (
    <Routes>
          <Route path='/sellers' element={<Seller/>}/>
          <Route path='/invoices' element={<Invoice/>}/>
          <Route path='/addseller' element={<Addseller/>}/>
          <Route path='/addinvoicestep1' element={<Addinvoicestep1/>}/>
          <Route path='/add-items/:id' element={<AddItems/>}/>
          <Route path='/view-invoice/:id' element={<Viewinvoice/>}/>
    </Routes>
  )
}

export default AllRoute