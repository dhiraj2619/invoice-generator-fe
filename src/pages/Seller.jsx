import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners';

const Seller = () => {
   const [sellers, setSellers] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchSellers = async () => {
         try {
            const response = await axios.get('https://invoice-generator-be-brlf.onrender.com/api/seller/allsellers');

            setSellers(response.data);
         } catch (error) {
            console.error("unable to fetch sellers", error);
         } finally {
            setLoading(false);
         }
      };

      fetchSellers();
   }, [])
   return (

      <div className="container mt-5">
         <div className="row">
            <div className="col">
               <h4 className="text-dark">Sellers</h4>
            </div>
            <div className="col-auto">
               <button className="btn btn-dark" style={{ fontSize: "15px" }} onClick={() => navigate('/addseller')}><i className="bi bi-plus-circle me-1"></i>Add seller</button>
            </div>
         </div>

         <div className="mt-5">
            {loading ? (
               <div className="d-flex justify-content-center align-items-center" style={{ width:"100%",minHeight:"300px" }}>
                  <HashLoader size={40} color={"#36d9b8"} loading={loading} />
               </div>
            ) : (
               <table className="table table-bordered shadow-sm" style={{ fontSize: "13.5px" }}>
                  <thead className="table-info" >
                     <tr>
                        <th>Seller Id</th>
                        <th>Seller Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Pincode</th>
                        <th>PAN No</th>
                        <th>GST Registration No</th>
                        <th>Place of Supply</th>
                     </tr>
                  </thead>
                  <tbody>
                     {sellers.map((seller) => (
                        <tr key={seller._id}>
                           <td className="text-success">{seller.sellerId}</td>
                           <td>{seller.sellerName}</td>
                           <td>{seller.address}</td>
                           <td>{seller.city}</td>
                           <td>{seller.state}</td>
                           <td>{seller.pincode}</td>
                           <td>{seller.panNo}</td>
                           <td>{seller.GSTRegistrationNo}</td>
                           <td>{seller.placeofsupply}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}

         </div>
      </div>


   )
}

export default Seller