import { useEffect, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function Stock() {
    const [product, setProduct] = useState([]);
    const [productName, setProductName] = useState(''); //เก็บค่า product[] ตอนเลือกสินค้า
    const [productId, setProductId] = useState(0);
    const [qty, setQty] = useState(0);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        fetchDataStock();
    }, [])

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/product/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProduct(res.data.results);

                }
            })

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const fetchDataStock = async () => {
        try {
            await axios.get(config.api_path + '/stock/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setStocks(res.data.results);
                }
            }).catch(err => {
                throw err.response.data;
            })

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleChooseProduct = (item) => {
        setProductName(item.name);
        setProductId(item.id);

        const btns = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btns.length; i++) btns[i].click();
    }

    const handleSave = async () => {
        try {
            const payload = {
                qty: qty,
                productId: productId
            }

            await axios.post(config.api_path + '/stock/save', payload, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    fetchDataStock();
                    setQty(1);
                    Swal.fire({
                        title: 'บันทึก',
                        text: 'รับสินค้าเข้า สต็อกแล้ว',
                        icon: 'success',
                        timer: 2000
                    })
                }
            }).catch(err => {
                throw err.response.data;
            })

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleDelete = (item) => {
        try {
            Swal.fire({
                title: 'ลบรายการ',
                text: 'ยืนยันการลบรายการออกจากระบบ',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async res => {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + '/stock/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            fetchDataStock();

                            Swal.fire({
                                title: 'ลบสต็อกสินค้า',
                                text: 'ลบลบสต็อกสินค้าออกจากระบบแล้ว',
                                icon: 'success',
                                timer: 2000
                            })
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })

                }
            })

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                timer: 2000
            })
        }
    }

    return (
        <>
            <Template>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-title'>รับสินค้าเข้า Stock</div>
                    </div>
                    <div className='card-body'>
                        <div className="row">
                            <div className="col-4">
                                <div className="input-group">
                                    <span className="input-group-text">สินค้า</span>
                                    <input value={productName} className="form-control" disabled />
                                    <button onClick={fetchData}
                                        data-toggle="modal"
                                        data-target="#modalProduct"
                                        className="btn btn-primary">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="input-group">
                                    <span className="input-group-text">สินค้า</span>
                                    <input value={qty} onChange={e => setQty(e.target.value)} type="number" className="form-control" />
                                </div>
                            </div>
                            <div className="col-4">
                                <button onClick={handleSave}
                                    className="btn btn-primary">
                                    <i className="fa fa-check me-2"></i>
                                    บันทึก
                                </button>
                            </div>
                        </div>

                        <table className='mt-3 table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th width="150px">barcode</th>
                                    <th>รายการ</th>
                                    <th width="100px" className="text-end">จำนวน</th>
                                    <th width="180px">วันที่</th>
                                    <th width="200px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {'test:' + stocks.product} */}
                                {stocks.length > 0 ? stocks.map(item =>
                                    <tr>
                                        <td>{item.product.barcode}</td>
                                        <td>{item.product.name}</td>
                                        <td>{item.qty}</td>
                                        <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                        <td className="text-center">
                                            <button onClick={e => handleDelete(item)}
                                                className="btn btn-danger">
                                                <i className="fa fa-times me-2"></i>
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalProduct" title="เลือกสินค้า" modalSize="modal-lg">
                <table className='mt-3 table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th width="180px"></th>
                            <th>barcode</th>
                            <th>รายการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.length > 0 ? product.map(item =>
                            <tr>
                                <td className="text-center">
                                    <button onClick={e => handleChooseProduct(item)}
                                        className="btn btn-primary">
                                        <i className="fa fa-check me-2"></i>
                                        เลือกรายการ
                                    </button>
                                </td>
                                <td>{item.barcode}</td>
                                <td>{item.name}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default Stock;