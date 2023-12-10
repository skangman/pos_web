import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'; //เติม forwardRef, useImperativeHandle fixbug รีเฟสเปอร์เซ็นขาย
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import { useNavigate } from "react-router-dom";
//omise
import Script from "react-load-script";
let OmiseCard

//omise

const Sidebar = forwardRef((props, sidebarRef) => { //เติม fixbug รีเฟสเปอร์เซ็นขาย
    // function Sidebar() {
    const navigate = useNavigate();

    const [membername, setMemberName] = useState();
    const [memberEmail, setMemberEmail] = useState();
    const [packageName, setPackageName] = useState();
    const [packages, setPackages] = useState([]);
    const [totalBill, setTotalBill] = useState(0);
    const [billAmount, setBillAmount] = useState();
    const [banks, setBanks] = useState([]);
    const [choosePackage, setChoosePackage] = useState({});

    useEffect(() => {

        const getToken = localStorage.getItem('pos_token');
        // console.log('Token: ' + getToken);
        if (!getToken) {
            navigate('/Login');
        } else {
            fetchData();
            fetchDataTotalBill();
        }


    }, []) //เติมกามปูไม่ให้เบิ้ล


    const fetchDataTotalBill = async () => {
        try {
            axios.get(config.api_path + '/package/countBill', config.headers()).then(res => {
                if (res.data.totalBill != undefined) {
                    setTotalBill(res.data.totalBill);
                }
            }).catch(err => {
                throw err.response.data;
            })

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e,
                icon: 'error'
            })
        }
    }

    const fetchData = async () => {

        try {
            axios.get(config.api_path + '/member/info', config.headers()).then(res => {

                if (res.data.message === 'success') {
                    setMemberName(res.data.result.name);
                    setMemberEmail(res.data.result.email);
                    setPackageName(res.data.result.package.name);
                    setBillAmount(res.data.result.package.bill_amount);
                }
            }).catch(err => {
                throw err.response.data;
            })

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e,
                icon: 'error'
            })
        }
    }

    const renderButton = (item) => {
        if (packageName === item.name) {
            return (
                <button className='btn btn-primary btn-lg' disabled>
                    <i className='fa fa-check me-2'></i>
                    เลือกแพคเกจ
                </button>
            );
        } else {
            return (
                <button onClick={e => handleChoosePackage(item)}
                    data-toggle="modal"
                    data-target="#modalBank"
                    className='btn btn-primary btn-lg'>
                    <i className='fa fa-check me-2'></i>
                    เลือกแพคเกจ
                </button>
            );
        }
    }

    const handleChoosePackage = (item) => { //คลิ๊ก handleChoosePackage ทำสองเรื่อง

        setChoosePackage(item);
        fetchDataBank();
        // console.log(choosePackage.name);

    }

    const fetchDataBank = async () => {
        if (banks.length == 0) { //ให้ทำเมื่อ banks เป็น 0 เท่านั้น
            try {
                await axios.get(config.api_path + '/bank/list', config.headers()).then(res => {
                    if (res.data.message === 'success') {
                        setBanks(res.data.results);
                    }
                }).catch(err => {
                    throw err.response.data;
                })

            } catch (e) {
                Swal.fire({
                    title: 'error',
                    text: e,
                    icon: 'error'
                })
            }
        }
    }

    const fetchPackages = async () => {
        try {
            await axios.get(config.api_path + '/package/list', config.headers()).then(res => {
                if (res.data.results.length > 0) {
                    setPackages(res.data.results);

                }
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e,
                icon: 'error'
            })
        }

    }

    const computePercen = (totalBill, billAmount) => {
        return ((totalBill * 100) / billAmount);
    }

    const handleChangePackage = async () => {

        const payload = {
            id: choosePackage.id,
            price: choosePackage.price
        }
        // console.log(payload);
        try {
            await axios.post(config.api_path + '/package/changePackage', payload, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'ส่งข้อมูล ',
                        text: 'ส่งข้อมูลการขอเปลี่ยน แพกเกจ ของคุณแล้ว',
                        icon: 'success',
                        timer: 2000
                    })

                    const btns = document.getElementsByClassName('btnClose');
                    for (let i = 0; i < btns.length; i++) btns[i].click();
                } else {
                    Swal.fire({
                        title: 'ส่งข้อมูล ',
                        text: 'การร้องขอเปลี่ยน แพกเกจ ของคุณแล้ว มีในระบบแล้ว, รอการตรวจสอบ',
                        icon: 'warning'
                    })
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e,
                icon: 'error'
            })
        }
    }

    useImperativeHandle(sidebarRef, () => ({ //เติม fixbug รีเฟสเปอร์เซ็นขาย
        refreshCountBill() {
            fetchDataTotalBill();
        }
    }));
    // const omiseKey = process.env.REACT_APP_OMISE_PUBLIC_KEY;
    // console.log('Env: ' + omiseKey);


    //  ###########omise########### //
    const handleLoadScript = () => {
        OmiseCard = window.OmiseCard
        OmiseCard.configure({
            publicKey: 'pkey_test_5xuq98uo66tbzz8be82',//process.env.REACT_APP_OMISE_PUBLIC_KEY,
            currency: 'THB',
            frameLabel: 'SkangMan Shop',
            submitLabel: 'Pay NOW',
            buttonLabel: 'Pay with Omise'
        });
    }

    const creditCardConfigure = () => {
        OmiseCard.configure({
            defaultPaymentMethod: 'credit_card',
            otherPaymentMethods: []
        });
        OmiseCard.configureButton("#credit-card");
        OmiseCard.attach();
    }

    const handleClick = (e) => {
        e.preventDefault();
        creditCardConfigure();
        omiseCardHandler();
        // console.log();
    }

    const [payDate, setPayDate] = useState(() => { //default วันปัจจุบัน
        const date = new Date();
        const futureDate = date.getDate();
        date.setDate(futureDate);
        return date.toLocaleDateString('en-CA');
    })

    const omiseCardHandler = () => {
        const payMember = membername;
        const payEmail = memberEmail;
        const payPrice = choosePackage.price + '00';

        // console.log('payEmail:' + memberEmail);

        OmiseCard.open({
            amount: payPrice,
            onCreateTokenSuccess: (token) => {
                axios.post(config.api_path + '/payment/checkout', {
                    email: payEmail,
                    name: payMember,
                    amount: payPrice,
                    token: token,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(async (res) => {
                    if (res.data.status === 'successful') { //ติดตรงนี้
                        const payload = {
                            id: choosePackage.id,
                            price: choosePackage.price,
                            payDate: payDate,
                            channel: 'credit_card',
                            status: res.data.status
                        }

                        await axios.post(config.api_path + '/package/changePackage', payload, config.headers()).then(res => {
                            if (res.data.message === 'success') {
                                Swal.fire({
                                    title: 'ส่งข้อมูล ',
                                    text: 'เปลี่ยน แพกเกจ ของคุณแล้ว',
                                    icon: 'success',
                                    timer: 2000
                                })

                                const btns = document.getElementsByClassName('btnClose');
                                for (let i = 0; i < btns.length; i++) btns[i].click();
                            } else {
                                Swal.fire({
                                    title: 'ส่งข้อมูล ',
                                    text: 'การร้องขอเปลี่ยน แพกเกจ ของคุณแล้ว มีในระบบแล้ว, รอการตรวจสอบ',
                                    icon: 'warning'
                                })
                            }
                        }).catch(err => {
                            throw err.response.data;
                        })

                    } else {
                        Swal.fire({
                            title: 'การชำระเงิน',
                            text: 'การชำระเงินล้มเหลว',
                            icon: 'error',
                        })
                    }
                })
            },
            onFormClosed: () => { },
        })
    }


    //  ###########omise########### //

    return (
        <>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <Link to="/Dashbord" className="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">POS on Cloud</span>
                </Link>

                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info text-white">
                            <div>{membername}</div>
                            <div> {packageName}</div>
                            <div className='d-grid'>
                                <button onClick={fetchPackages}
                                    data-toggle="modal"
                                    data-target="#modalPackage"
                                    className='btn btn-warning mt-2'>
                                    <i className='fa fa-arrow-up me-2'></i>
                                    Upgrade
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id='progressSideBar' style={{ display: 'block' }}>
                        <div className='ms-2 text-white'>
                            <div className='float-start'>
                                {totalBill} / {parseInt(billAmount).toLocaleString('th-TH')}
                            </div>
                            <div className='float-end me-2'>
                                {computePercen(totalBill, billAmount)}%
                            </div>
                            <div className='clearfix'></div>
                        </div>
                        <div className="progress ms-2 me-2 ">
                            <div className="progress-bar" role="progressbar" style={{ width: computePercen(totalBill, billAmount) + '%' }} aria-valuenow={totalBill}
                                aria-valuemin="0" aria-valuemax="100"> </div>
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* <div className="input-group" data-widget="sidebar-search">
                            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-sidebar">
                                    <i className="fas fa-search fa-fw"></i>
                                </button>
                            </div>
                        </div> */}
                    </div>

                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                            <li className="nav-item">
                                <Link to="/Dashbord" className="nav-link">
                                    <i className="nav-icon fas fa-th"></i>
                                    <p>Dashbord</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/Sale" className="nav-link">
                                    <i className="nav-icon fas fa-dollar-sign"></i>
                                    <p>ขายสินค้า</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/Product" className="nav-link">
                                    <i className="nav-icon fas fa-box"></i>
                                    <p> สินค้า</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/User" className="nav-link">
                                    <i className="nav-icon fas fa-person"></i>
                                    <p>ผู้ใช้งานระบบ</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/sumSalePerDay" className="nav-link">
                                    <i className="nav-icon fas fa-file-alt"></i>
                                    <p>สรุปรายงานยอดรายวัน</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/billSales" className="nav-link">
                                    <i className="nav-icon fas fa-list-alt"></i>
                                    <p>รายงานบิลขาย</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/stock" className="nav-link">
                                    <i className="nav-icon fas fa-home"></i>
                                    <p>รับสินค้าเข้า Stock</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/reportStock" className="nav-link">
                                    <i className="nav-icon fas fa-file"></i>
                                    <p>รายงาน Stock</p>
                                </Link>
                            </li>


                        </ul>
                    </nav>
                </div>
            </aside>

            <Modal id="modalPackage" title="เลือกแพคเกจที่ต้องการ" modalSize="modal-lg">
                <div className='row'>
                    {packages.length > 0 ? packages.map(item =>
                        <div className='col-4'>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className='h3'>{item.name}</div>
                                    <div className='h4 mt-3 text-primary'>
                                        <strong>
                                            {parseInt(item.price).toLocaleString('th-TH')} .-
                                        </strong>
                                        <span> / เดือน </span>
                                    </div>
                                    <div className='mt-3'>จำนวนบิล
                                        <span className='text-danger ms-2 me-2'>
                                            <strong> {parseInt(item.bill_amount).toLocaleString('th-TH')} </strong>
                                        </span>
                                        ต่อเดือน</div>
                                    <div className='mt-3 text-center'>
                                        {renderButton(item)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </Modal>

            <Modal id="modalBank" title="ช่องทางชำระเงิน" modalSize="modal-lg">
                <div className='h4 text-secondary'>
                    Package ที่เลือกคือ <span className='text-primary'>{choosePackage.name}</span>
                </div>
                <div className='mt-3 h5'>
                    ราคา <span className='text-danger'>{parseInt(choosePackage.price).toLocaleString('th-TH')} </span>บาท/เดือน
                </div>

                <table className='mt-3 table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>ธนาคาร</th>
                            <th>เลขบัญชี</th>
                            <th>เจ้าของบัญชี</th>
                            <th>สาขา</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banks.length > 0 ? banks.map(item =>
                            <tr>
                                <td>{item.bankType}</td>
                                <td>{item.bankCode}</td>
                                <td>{item.bankName}</td>
                                <td>{item.bankBranch}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
                <div className='alert mt-3 alert-warning'>
                    <i className='fa fa-info-circle me-2'></i>
                    เมื่อโอนชำระเงินแล้วให้แจ้งที่ไลน์ ID : dragonskang
                </div>

                <div className='mt-3 text-center'>
                    <div className='row'>
                        <div className='col-6'>
                            <button onClick={handleChangePackage}
                                className='btn btn-primary float-end'>
                                <i className='fa fa-check me-2'></i>
                                ยืนยันการสมัคร
                            </button>
                        </div>

                        <div className='col-6'>
                            <div className="own-form">
                                <Script
                                    url="https://cdn.omise.co/omise.js"
                                    onLoad={handleLoadScript}
                                />
                                <form>
                                    <div className='btn btn-primary float-start'
                                        id="credit-card"
                                        type="button"
                                        onClick={handleClick}>

                                        <i className='fa fa-credit-card me-2'></i>
                                        ชำระเงินด้วยบัตรเครดิต
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

            </Modal>

        </>
    )
    // }
})

export default Sidebar;