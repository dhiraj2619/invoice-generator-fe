import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ 
      width: "300px", 
      height: "100vh", 
      position: "sticky",
      top: 0,
      left: 0
    }}>

      <h5 className="text-white"><span><i className="bi bi-receipt me-4"></i></span> Invoice Generator</h5>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/sellers" className="nav-link text-white">
            <span className="me-2" style={{ fontSize: "13px" }}><i className="bi bi-people"></i></span> Sellers
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/invoices" className="nav-link text-white">
            <span className="me-2" style={{ fontSize: "13px" }}><i className="bi bi-receipt-cutoff"></i></span> Invoices
          </Link>
        </li>

      </ul>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>User</strong>
        </a>
        <ul className="dropdown-menu text-small shadow" >
          <li><a className="dropdown-item" href="#">New project...</a></li>
          <li><a className="dropdown-item" href="#">Settings</a></li>
          <li><a className="dropdown-item" href="#">Profile</a></li>

          <li><a className="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar