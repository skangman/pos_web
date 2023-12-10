import Template from "../components/Template";
import Swal from 'sweetalert2';
import config from '../config';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';

function BillSales() {
    const [billSales, setBillSales] = useState([]); //array
    const [selectBill, setSelectBill] = useState([]); //object

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/billSale/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    // console.log(res.data);
                    setBillSales(res.data.results);
                }
            }).catch(err => {
                // console.log(err);
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


    return (
        <>
            <Template>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-title'>รายงานบิลขาย</div>
                    </div>
                    <div className='card-body'>
                        <table className='table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th width="180px"></th>
                                    <th width="100px">เลขบิล</th>
                                    <th>วันที่</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billSales.length > 0 ? billSales.map(item =>
                                    <tr>
                                        <td className="text-center">
                                            <button onClick={e => setSelectBill(item)}
                                                data-toggle="modal" data-target="#modalBillSaleDetail"
                                                className="btn btn-primary">
                                                <i className="fa fa-file-alt me-2"></i>
                                                รายการบิลขาย
                                            </button>
                                        </td>
                                        <td>{item.id}</td>
                                        <td>{item.createdAt}</td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalBillSaleDetail" title="รายการในบิล" modalSize="modal-lg">
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th className="text-end">ราคา</th>
                            <th className="text-end">จำนวน</th>
                            <th className="text-end">ยอดรวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectBill != {} && selectBill.billSaleDetails != null ?
                            selectBill.billSaleDetails.map(item =>
                                <tr>
                                    <td>{item.product.name}</td>
                                    <td className="text-end">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                    <td className="text-end">{item.qty}</td>
                                    <td className="text-end">{(item.price * item.qty).toLocaleString('th-TH')}</td>
                                </tr>
                            ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default BillSales; 