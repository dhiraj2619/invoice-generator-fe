import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Addinvoicestep1 = ({ setStep1Data }) => {
    const [formData, setFormData] = useState({
        companylogo: null,
        seller: '',
        billingDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            stateUTCode: ''
        },
        shippingDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            stateUTCode: ''
        },
        orderDetails: {
            orderNo: '',
            orderDate: ''
        },
        invoiceDetails: {
            invoiceDetails: '',
            reverseCharge: 'no' 
        },
        placeOfDelivery: ''
    });

    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await axios.get('https://invoice-generator-be-brlf.onrender.com/api/seller/allsellers');
                setSellers(response.data);
            } catch (error) {
                console.error('Error fetching sellers:', error);
            }
        };
        fetchSellers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prevData => ({ ...prevData, companylogo: files[0] }));
        } else {
            const [section, key] = name.split('.');
            if (section && key) {
                setFormData(prevData => ({
                    ...prevData,
                    [section]: { ...prevData[section], [key]: value }
                }));
            } else {
                setFormData(prevData => ({ ...prevData, [name]: value }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === 'companylogo') {
                    formDataToSend.append(key, formData[key]);
                } else if (typeof formData[key] === 'object') {
                    Object.keys(formData[key]).forEach((subKey) => {
                        formDataToSend.append(`${key}.${subKey}`, formData[key][subKey]);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await axios.post('https://invoice-generator-be-brlf.onrender.com/api/invoice/add', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    timeout: 10000
                }
            });

            setLoading(false);
            navigate('/invoices');
        } catch (error) {
            setLoading(false);
            setError(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    return (
        <div className="container mt-5">
            <h5 className="text-dark text-center">Add Invoice</h5>
            <div className="card mt-3 border-0">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-6 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="file"
                                        name="companylogo"
                                        className="form-control"
                                        placeholder="Company Logo"
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="floatingInput">Company Logo</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-12">
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        id="floatingSelect"
                                        name="seller"
                                        value={formData.seller}
                                        onChange={handleInputChange}
                                        aria-label="Floating label select example"
                                    >
                                        <option value="" disabled>Select seller</option>
                                        {sellers.map(seller => (
                                            <option key={seller._id} value={seller._id}>
                                                {seller.sellerName}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="floatingSelect">Sellers</label>
                                </div>
                            </div>
                            <h6 className="text-secondary mb-3" style={{ fontSize: "14px" }}>Shipping details</h6>
                            {Object.keys(formData.shippingDetails).map(key => (
                                <div className="col-lg-4 col-sm-6 col-12" key={key}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            name={`shippingDetails.${key}`}
                                            className="form-control"
                                            placeholder={key}
                                            value={formData.shippingDetails[key]}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor={`floatingInput`}>{key}</label>
                                    </div>
                                </div>
                            ))}
                            <h6 className="text-secondary mb-3" style={{ fontSize: "14px" }}>Billing details</h6>
                            {Object.keys(formData.billingDetails).map(key => (
                                <div className="col-lg-4 col-sm-6 col-12" key={key}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            name={`billingDetails.${key}`}
                                            className="form-control"
                                            placeholder={key}
                                            value={formData.billingDetails[key]}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor={`floatingInput`}>{key}</label>
                                    </div>
                                </div>
                            ))}
                            <div className="col-lg-6 col-sm-6 col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="placeOfDelivery"
                                        className="form-control"
                                        placeholder="Place of Delivery"
                                        value={formData.placeOfDelivery}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="floatingInput">Place of Delivery</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <h6 className="text-secondary" style={{ fontSize: '14px' }}>Order details</h6>
                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="orderDetails.orderNo"
                                        className="form-control"
                                        placeholder="Order Number"
                                        value={formData.orderDetails.orderNo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="floatingInput">Order Number</label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <input
                                        type="date"
                                        name="orderDetails.orderDate"
                                        className="form-control"
                                        placeholder="Order Date"
                                        value={formData.orderDetails.orderDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="floatingInput">Order Date</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <h6 className="text-secondary" style={{ fontSize: '14px' }}>Invoice details</h6>
                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="invoiceDetails.invoiceDetails"
                                        className="form-control"
                                        placeholder="Invoice Number"
                                        value={formData.invoiceDetails.invoiceDetails}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="floatingInput">Invoice Number</label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        name="invoiceDetails.reverseCharge"
                                        value={formData.invoiceDetails.reverseCharge}
                                        onChange={handleInputChange}
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                    <label htmlFor="floatingInput">Reverse Charge</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default Addinvoicestep1;
