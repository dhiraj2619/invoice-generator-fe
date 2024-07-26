import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners';

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async (req, res) => {
            try {
                const response = await axios.get('https://invoice-generator-be-brlf.onrender.com/api/invoice/allinvoice');
                setInvoices(response.data);
                
            } catch (error) {
                console.error("unable to fetch invoices", error);
            }finally{
                setLoading(false);
            }
        }
        fetchInvoices();
    }, []);

    const navigate = useNavigate();

    
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <h4 className="text-dark">Invoices</h4>
                </div>
                <div className="col-auto">
                    <button className="btn btn-dark" onClick={() => navigate('/addinvoicestep1')} style={{ fontSize: "15px" }}><i className="bi bi-plus-circle me-1"></i>Add invoice</button>
                </div>
            </div>

            <div className="mt-5">
                {loading ? (<div className="d-flex justify-content-center align-items-center" style={{ width: "100%", minHeight: "300px" }}>
                    <HashLoader size={40} color={"#36d9b8"} loading={loading} />
                </div>) :
                    (
                        <table className="table table-bordered shadow-sm" style={{ fontSize: "13.5px" }}>
                        <thead className="table-info" >
                           <tr>
                              <th>Invoice no</th>
                              <th>comapny logo</th>
                              <th>place of delivery</th>
                              <th>seller name</th>
                              <th>Actions</th>
                             
                           </tr>
                        </thead>
                        <tbody>
                           {invoices.map((invoice) => (
                              <tr key={invoice._id}>
                                 <td className="text-success">{invoice.invoiceDetails.invoiceNo}</td>
                                 <td>
                                    <img src={`https://invoice-generator-be-brlf.onrender.com/${invoice.companylogo.replace(/\\/g, "/")}`} className="img-fluid" width="100px" alt="" />
                                 </td>
                                 <td>{invoice.placeOfDelivery}</td>
                                 <td>{invoice.seller?.sellerName}</td>
                                 <td>
                                    <Link to={`/add-items/${invoice._id}`} className="btn btn-sm btn-secondary me-2 rounded-4">
                                    Add items
                                    </Link>
                                   {invoice.items.length > 0 && <Link Link to={`/view-invoice/${invoice._id}`} className="btn btn-sm btn-outline-success rounded-4">
                                       view invoice
                                    </Link>}
                                 </td>
                                
                              </tr>
                           ))}
                        </tbody>
                     </table>
                )}
            </div>
        </div>

    )
}

export default Invoice