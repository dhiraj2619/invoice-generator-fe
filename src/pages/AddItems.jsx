import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';


const AddItems = () => {
    const { id } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`https://invoice-generator-be-brlf.onrender.com/api/invoice/${id}`);
                const fetchedInvoice = response.data;
                const taxRate = fetchedInvoice.placeOfDelivery === fetchedInvoice.seller?.placeofsupply ? 9 : 18;

                const updatedItems = (fetchedInvoice.items || []).map(item => ({
                    ...item,
                    taxRate: taxRate
                }));

                setInvoice(fetchedInvoice);
                setItems(updatedItems);
            } catch (error) {
                setError(error.response ? error.response.data.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const handleItemChange = (index, event) => {
        const { name, value } = event.target;
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [name]: value
        };

        if (name === 'quantity' || name === 'unitPrice' || name === 'discount') {
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
            const discount = parseFloat(newItems[index].discount) || 0;
            const netAmount = (quantity * unitPrice) - discount;
            newItems[index].netAmount = netAmount;
        }
        setItems(newItems);
    };

    const handleAddItem = () => {
        const taxRate = invoice.placeOfDelivery === invoice.seller?.placeofsupply ? 9 : 18;
        setItems(prevItems => [
            ...prevItems,
            { description: '', quantity: 0, unitPrice: 0, discount: 0, netAmount: 0, taxRate: taxRate }
        ]);
    };

    const handleRemoveItem = (index) => {
        setItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`https://invoice-generator-be-brlf.onrender.com/api/invoice/${id}`, {
                ...invoice,
                items
            });
          
            navigate('/invoices');
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center w-100">
            <HashLoader size={40} color={"#36d9b8"} loading={loading} />
        </div>
    );

    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-5">
           
            <h5 className="text-dark text-center">Edit Items - Invoice {invoice?.invoiceDetails?.invoiceNo}</h5>
            <form onSubmit={handleSubmit}>
                {items.map((item, index) => (
                    <div key={index} className="row border-bottom mt-4">
                        <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="description"
                                    className="form-control"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, e)}
                                    required
                                />
                                <label htmlFor="floatingInput">Description</label>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    name="quantity"
                                    className="form-control"
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, e)}
                                    required
                                />
                                <label htmlFor="floatingInput">Quantity</label>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    name="unitPrice"
                                    className="form-control"
                                    placeholder="Unit Price"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(index, e)}
                                    required
                                />
                                <label htmlFor="floatingInput">Unit Price</label>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    name="discount"
                                    className="form-control"
                                    placeholder="Discount"
                                    value={item.discount}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                                <label htmlFor="floatingInput">Discount</label>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    name="netAmount"
                                    className="form-control"
                                    placeholder="Net Amount"
                                    value={item.netAmount}
                                    readOnly
                                />
                                <label htmlFor="floatingInput">Net Amount</label>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    name="taxRate"
                                    className="form-control"
                                    placeholder="Tax Rate"
                                    value={item.taxRate}
                                    readOnly
                                />
                                <label htmlFor="floatingInput">Tax Rate</label>
                            </div>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-12 mb-3">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem(index)}>
                                <i className='bi bi-trash'></i>
                            </button>
                        </div>
                    </div>
                ))}
                <div className="row">
                    <div className="col-lg-12 text-center mt-3">
                        <button type="button" className="btn btn-sm btn-dark" onClick={handleAddItem}>
                            Add Item
                        </button>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-lg-6">
                        <button type="submit" className="btn" style={{ backgroundColor: "#1976d2", color: "white" }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
                {error && <p className="text-danger mt-3">{error}</p>}
            </form>
        </div>
    );
}

export default AddItems;
