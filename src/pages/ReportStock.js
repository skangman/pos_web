import { useEffect, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function ReportStock() {
    const [stocks, setStock] = useState([]);
    const [currentstock, setCurrentstock] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/stock/report', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setStock(res.data.results);
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

    // const selectedStock = (item) => {
    //     setCurrentstocks(item)
    // }

    return (
        <>
            <Template>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-title'>รายงาน Stock</div>
                    </div>
                    <div className='card-body'>
                        <table className='mt-3 table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>barcode</th>
                                    <th>รายการ</th>
                                    <th className='text-end'>รับเข้า</th>
                                    <th className='text-end'>ขายออก</th>
                                    <th className='text-end'>คงเหลือ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.length > 0 ? stocks.map((item, i) =>
                                    <tr>
                                        <td>{item.result[i].barcode}</td>
                                        <td>{item.result[i].name}</td>
                                        <td className='text-end'>
                                            <a onClick={e => setCurrentstock(item.result[i])}
                                                className="btn btn-link text-success"
                                                data-toggle="modal"
                                                data-target="#modalStockIn">
                                                {(item.stockIn).toLocaleString('th-TH')}
                                            </a>
                                        </td>
                                        <td className='text-end'>
                                            <a onClick={e => setCurrentstock(item.result[i])}
                                                className="btn btn-link text-danger"
                                                data-toggle="modal"
                                                data-target="#modalStockOut">
                                                {item.stockOut.toLocaleString('th-TH')}
                                            </a>
                                        </td>
                                        <td className='text-end'>
                                            {(item.stockIn - item.stockOut).toLocaleString('th-TH')}
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

            </Template>
            <Modal id="modalStockIn" title="ข้อมูลการรับเข้าสต็อก" modalSize="modal-lg">
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th width="120px">barcode</th>
                            <th>รายการ</th>
                            <th width="100px" className='text-end'>จำนวน</th>
                            <th width="150px" className='text-center'>วันที่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {console.log(currentstock)} */}
                        {/* {console.log(currentstock.stocks != undefined && currentstock.stocks.length > 0 ? 'ok' : 'no')} */}
                        {currentstock.stocks != undefined && currentstock.stocks.length > 0
                            ? currentstock.stocks?.map(item =>
                                <tr>
                                    <td>{item.product.barcode}</td>
                                    <td>{item.product.name}</td>
                                    <td className='text-end'>{item.qty}</td>
                                    <td className='text-center'>{dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm')}</td>
                                </tr>
                            ) : ''}
                    </tbody>
                </table>
            </Modal>

            <Modal id="modalStockOut" title="ข้อมูลการขาย" modalSize="modal-lg">
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th width="120px">barcode</th>
                            <th>รายการ</th>
                            <th width="100px" className='text-end'>จำนวน</th>
                            <th width="150px" className='text-center'>วันที่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentstock.billSaleDetails != undefined && currentstock.billSaleDetails.length > 0
                            ? currentstock.billSaleDetails?.map(item =>
                                <tr>
                                    <td>{item.product.barcode}</td>
                                    <td>{item.product.name}</td>
                                    <td className='text-end'>{item.qty}</td>
                                    <td className='text-center'>{dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm')}</td>
                                </tr>
                            ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default ReportStock;