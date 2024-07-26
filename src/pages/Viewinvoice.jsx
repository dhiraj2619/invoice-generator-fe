import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewInvoice = () => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const invoiceRef = useRef(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`https://invoice-generator-be-brlf.onrender.com/api/invoice/${id}`);
                setInvoice(response.data);
            } catch (error) {
                setError(error.response ? error.response.data.message : "Unable to get invoice");
                toast.error("Unable to get invoice");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const calculateTotalNetAmount = () => {
        return invoice.items.reduce((total, item) => total + (parseFloat(item.netAmount) || 0), 0);
    };

    const getImageSrc = useCallback((url) => {
        return url ? `https://invoice-generator-be-brlf.onrender.com/${url.replace(/\\/g, "/")}` : '/path/to/placeholder/image.jpg';
    }, []);

    const handleImageLoad = (event) => {
        // Handle any logic after image loads, if necessary
    };

    const downloadPDF = () => {
        if (!invoiceRef.current) {
            toast.error("Invoice content is not available.");
            return;
        }

        html2canvas(invoiceRef.current, { useCORS: true, logging: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('invoice.pdf');
        }).catch(err => {
            toast.error("Error generating PDF");
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ width: "100%", minHeight: "300px" }}>
                <HashLoader size={40} color={"#36d9b8"} loading={loading} />
            </div>
        );
    }

    return (
        <div className="w-100" style={{ backgroundColor: "#ccc" }}>
            <ToastContainer />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div ref={invoiceRef} className="bg-white p-3">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div>
                                        <img
                                            src={getImageSrc(invoice.companylogo)}
                                            width="150px"
                                            className="img-fluid"
                                            alt="Company Logo"
                                            onError={(e) => e.target.src = '/path/to/placeholder/image.jpg'}
                                            onLoad={handleImageLoad}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h5 className="text-dark" style={{ fontSize: "17px", fontWeight: "600" }}>
                                        Tax invoice/Bill of supply/Cash memo
                                    </h5>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-lg-6">
                                    <span className='text-dark' style={{ fontWeight: "600", fontSize: "15px" }}>Sold By:</span>
                                    <div style={{ fontSize: "14px" }} className="mt-2">
                                        <p className="mb-0">{invoice.seller.sellerName}</p>
                                        <div>{invoice.seller.address}</div>
                                        <span>{invoice.seller.city},{invoice.seller.state},{invoice.seller.pincode}</span>
                                    </div>
                                    <div className="mt-3" style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>PAN no: <span className="fw-normal">{invoice.seller.panNo}</span></span>
                                    </div>
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>GST Registration No: <span className="fw-normal">{invoice.seller.GSTRegistrationNo}</span></span>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <span className='text-dark' style={{ fontWeight: "600", fontSize: "15px" }}>Billing Address:</span>
                                    <div style={{ fontSize: "14px" }} className="mt-2">
                                        <div>{invoice.billingDetails.name}</div>
                                        <div>{invoice.billingDetails.address}</div>
                                        <span>{invoice.billingDetails.city},{invoice.billingDetails.state},{invoice.billingDetails.pincode}</span>
                                    </div>
                                    <div style={{ fontSize: "14px" }} className="mt-2">
                                        <span className='text-dark' style={{ fontWeight: "600" }}>State/UT code: <span className="fw-normal">{invoice.billingDetails.stateUTCode}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-1">
                                <div className="col-lg-6"></div>
                                <div className="col-lg-6">
                                    <span className='text-dark' style={{ fontWeight: "600", fontSize: "15px" }}>Shipping Address:</span>
                                    <div style={{ fontSize: "14px" }} className="mt-2">
                                        <div>{invoice.shippingDetails.name}</div>
                                        <div>{invoice.shippingDetails.address}</div>
                                        <span>{invoice.shippingDetails.city},{invoice.shippingDetails.state},{invoice.shippingDetails.pincode}</span>
                                    </div>
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>State/UT code: <span className="fw-normal">{invoice.shippingDetails.stateUTCode}</span></span>
                                    </div>
                                    <div style={{ fontSize: "14px" }} className="mt-1">
                                        <span className='text-dark' style={{ fontWeight: "600" }}>Place of supply: <span className="fw-normal">{invoice.seller.placeOfSupply}</span></span>
                                    </div>
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>Place of delivery: <span className="fw-normal">{invoice.placeOfDelivery}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2 align-items-center">
                                <div className="col-lg-6">
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>Order Number: <span className="fw-normal">{invoice.orderDetails.orderNo}</span></span>
                                    </div>
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>Order Date: <span className="fw-normal">{new Date(invoice.orderDetails.orderDate).toLocaleDateString('en-GB')}</span></span>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>Invoice Number: <span className="fw-normal">{invoice.invoiceDetails.invoiceNo}</span></span>
                                    </div>
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>Invoice Details: <span className="fw-normal">{invoice.invoiceDetails.invoiceDetails}</span></span>
                                    </div>
                                    <div style={{ fontSize: "14px" }}>
                                        <span className='text-dark' style={{ fontWeight: "600" }}>Invoice Date: <span className="fw-normal">{new Date(invoice.invoiceDetails.invoiceDate).toLocaleDateString('en-GB')}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <table className="table table-bordered" style={{ fontSize: "14px" }}>
                                    <thead className="table-secondary">
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Item Description</th>
                                            <th>Unit Price</th>
                                            <th>Qty</th>
                                            <th>Discount</th>
                                            <th>Net Amount</th>
                                            <th>Tax Rate (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>{item.description}</td>
                                                <td>{item.unitPrice}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.discount}</td>
                                                <td>{item.netAmount}</td>
                                                <td>{item.taxRate}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="5" className="text-end border"><strong>Total Net Amount:</strong></td>
                                            <td colSpan="2" className="table-secondary">
                                                <strong>₹{calculateTotalNetAmount()}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4"></td>
                                            <td colSpan="3">
                                                <h6>For {invoice.seller.sellerName}</h6>
                                                <img src={getImageSrc(invoice.seller.signature)} alt="" width="90px" style={{ height: "auto", border: "1px solid #ddd" }} />
                                                <h6>Authorized Signatory</h6>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-dark"><small>Whether tax is payable under reverse charge? {invoice.invoiceDetails.reverseCharge}</small></p>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={downloadPDF} className="btn btn-primary">Download</button>
        </div>
    );
}

export default ViewInvoice;
