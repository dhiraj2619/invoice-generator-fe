import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Addseller = () => {

    const [formData, setFormData] = useState({
        sellerName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        panNo: '',
        GSTRegistrationNo: '',
        placeofsupply: '',
        signature: null,
    });

    const navigate = useNavigate();

    const handleOnChange=(e)=>{
        const {name,value} = e.target;
        setFormData({...formData,
            [name]:value
        })
    }

    const handleFileChange=(e)=>{
        setFormData({...formData,signature:e.target.files[0]});
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();

        const data = new FormData();
        for(const key in formData){
            data.append(key,formData[key]);
        }

        try {
           await axios.post('https://invoice-generator-be-brlf.onrender.com/api/seller/addsellers',data);
           navigate('/sellers');
        } catch (error) {
            console.error("unable to add seller",error);
        }
    }
    return (
        <div className="container mt-5">
            <h6 className="text-dark">Add seller</h6>
            <div className="card mt-3 border-0">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-4 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="sellerName" value={formData.sellerName}  onChange={handleOnChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">sellername</label>
                                </div>

                            </div>
                            <div className="col-lg-8 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="address" value={formData.address} onChange={handleOnChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">address</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="city" value={formData.city} onChange={handleOnChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">city</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="state" className="form-control" placeholder="name@example.com" requiredvalue={formData.state} onChange={handleOnChange}/>
                                    <label for="floatingInput">state</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleOnChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">pincode</label>
                                </div>
                            </div>

                            <div className="col-lg-6 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="panNo" value={formData.panNo} onChange={handleOnChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">pan number</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="GSTRegistrationNo" value={formData.GSTRegistrationNo} onChange={handleOnChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">GST Reg no</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="text" name="placeofsupply" value={formData.placeofsupply} onChange={handleOnChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">Place of supply</label>
                                </div>
                            </div>
                            <div className="col-lg-8 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input type="file" name="signature"  onChange={handleFileChange} className="form-control" placeholder="name@example.com" required/>
                                    <label for="floatingInput">signature</label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <button  className="btn btn-secondary me-3" onClick={()=>navigate('/sellers')}>Back</button>
                            <button type="submit" className="btn" style={{ backgroundColor: "#1976d2", color: "white" }}>Add seller</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Addseller