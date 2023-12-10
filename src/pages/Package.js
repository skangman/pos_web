import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

import '../css/style.css';
import '../css/css/mixins/bootstrap-reboot.css';
import '../css/animate.css';
import '../css/magnific-popup.css';
import '../css/owl.theme.default.min.css';

function Package() {
    const [packages, setPackages] = useState([]); //set array []
    const [yourPackage, setYourPackage] = useState({}); //set object {}
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            axios.get(config.api_path + '/package/list').then(res => {
                setPackages(res.data.results);
                // console.log(res.data.results);
            })
        } catch (e) {
            console.log(e.message);
        }

    }

    const choosePackage = (item) => {
        setYourPackage(item);
        // console.log(yourPackage);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        // console.log(name);
        if (name == undefined || name == '') {
            Swal.fire({
                title: 'แจ้งเตือนการทำรายการ',
                text: 'กรุณากรอกชื่อร้าน',
                icon: 'warning'
            })

        } else if (phone == undefined || phone == '') {
            Swal.fire({
                title: 'แจ้งเตือนการทำรายการ',
                text: 'กรุณากรอกเบอร์โทร',
                icon: 'warning'
            })

        } else if (email == undefined || email == '') {
            Swal.fire({
                title: 'แจ้งเตือนการทำรายการ',
                text: 'กรุณากรอก E-mail',
                icon: 'warning'
            })

        } else if (pass == undefined || pass == '') {
            Swal.fire({
                title: 'แจ้งเตือนการทำรายการ',
                text: 'กรุณากรอก Password',
                icon: 'warning'
            })

        } else {

            try {
                Swal.fire({
                    title: 'ยืนยันการสมัคร',
                    text: 'โปรดยืนยันการสมัครใช้บริการ Package ของเรา',
                    icon: 'question',
                    showCancelButton: true,
                    showConfirmButton: true
                }).then(res => {
                    if (res.isConfirmed) {
                        const payload = {
                            packageId: yourPackage.id,
                            name: name,
                            phone: phone,
                            email: email,
                            pass: pass
                        }
                        axios.post(config.api_path + '/package/memberRegister', payload).then(res => {
                            if (res.data.message === 'success') {
                                Swal.fire({
                                    title: 'บันทึกข้อมูล',
                                    text: 'บันทึกข้อมูลการสมัครแล้ว',
                                    icon: 'success',
                                    timer: 2000
                                })
                                document.getElementById('btnModalclose').click();
                                navigate('/login');
                            } else {
                                Swal.fire({
                                    title: 'แจ้งเตือนการทำรายการ',
                                    text: 'E-mail นี้มีในระบบแล้ว',
                                    icon: 'warning',
                                    timer: 2000
                                })
                            }
                        }).catch(err => {
                            throw err.response.data;
                        })
                    }
                })

            } catch (e) {
                // console.log(e.message);
                Swal.fire({
                    title: 'error',
                    message: e.message,
                    icon: 'error'
                })
            }

        }
    }

    return (
        <>

            <body>
                <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                    <div className="container">
                        <Link className="navbar-brand" to="/">Cloud POS</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="oi oi-menu"></span> Menu
                        </button>

                        <div className="collapse navbar-collapse" id="ftco-nav">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item active">
                                    <Link to="#" className="nav-link">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="#" className="nav-link">Company</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="hero-wrap js-fullheight">
                    <div className="overlay"></div>
                    <div className="container-fluid px-0">
                        <div className="row d-md-flex no-gutters slider-text align-items-center js-fullheight justify-content-start">
                            <img className="one-third js-fullheight align-self-end order-md-first img-fluid"
                                src="dist/img/undraw_co-working_825n.svg" alt="" />
                            <div className="one-forth d-flex ">
                                <div className="text mt-5">
                                    {/* <span className="subheading">Cloud Template</span> */}
                                    <h1 className="mb-3"><span>Point</span> <span>of Sale</span> <span>on Cloud</span></h1>
                                    <p>สมัครใช้งาน Point of Sale on Cloud ด้วย Package Free จะช่วยคุณขายสินค้าได้ 100 บิลต่อเดือน รวมถึง เมนู เพิ่มสต็อกสินค้า รายงาน วัน,เดือน,ปี</p>
                                    <p>
                                        <Link to="/login" className="btn btn-secondary px-4 py-3">
                                            <span className='fa fa-user-circle me-2'></span>
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="ftco-section bg-light">
                    <div className="container">
                        <div className="row justify-content-center mb-5 pb-3">
                            <div className="col-md-7 text-center heading-section ">
                                <h2 className="mb-4">POS Cloud Services</h2>
                            </div>
                        </div>
                        <div className="row d-flex">

                            {packages.map(item =>
                                <div className="col-lg-3 col-md-6 ftco-animate fadeInUp ftco-animated">
                                    <div className="block-7">
                                        <div className="text-center">
                                            <h2 className="heading">{item.name}</h2>
                                            <div className="price"><sup>฿</sup>
                                                <span className="number">
                                                    {parseInt(item.price).toLocaleString('th-TH')}
                                                    <small className="per">/mo</small>
                                                </span>

                                                <span className="excerpt d-block">100% free. Forever</span>
                                                <h3 className="heading-2 mb-3">Enjoy All The Features</h3>

                                                <ul className="pricing-text mb-4">
                                                    <li><strong> {parseInt(item.bill_amount).toLocaleString('th-TH')}</strong> บิลต่อเดือน</li>
                                                    {/* <li><strong>100 GB</strong> Storage</li>
                                                    <li><strong>$1.00 / GB</strong> Overages</li> */}
                                                    <li>All features</li>
                                                </ul>
                                                <button onClick={e => choosePackage(item)} type='button' data-toggle='modal'
                                                    data-target='#modalRegister' className="btn btn-tertiary px-3 py-3 mb-4">
                                                    <span className="mr-3 fa fa-hand-pointer"></span>
                                                    สมัครใช้บริการ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </section>


                <Modal id='modalRegister' title='สมัครใช้บริการ'>

                    <form>
                        <h2 class="mb-3 text-center" style={{ fontWeight: 'bold' }}>
                            <span className='me-1'>{yourPackage.name} </span>
                            ราคา <span style={{ color: '#ff8ba7' }}>{yourPackage.price} </span>
                            <small className="per">/เดือน</small>
                        </h2>
                        <div className="form-group">
                            <label>ชื่อร้าน</label>
                            <input type="text" onChange={e => setName(e.target.value)} className="form-control" placeholder="ชื่อร้าน" />
                        </div>
                        <div className="form-group">
                            <label>เบอร์โทร</label>
                            <input type="text" onChange={e => setPhone(e.target.value)} className="form-control" placeholder="เบอร์โทร" />
                        </div>
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" onChange={e => setEmail(e.target.value)} class="form-control" placeholder="E-mail" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" onChange={e => setPass(e.target.value)} class="form-control" placeholder="Password" />
                        </div>
                        <div className="form-group">
                            <button onClick={handleRegister} className="btn btn-primary py-3 px-5">
                                <span className="mr-3 fa fa-check"></span>
                                ยืนยันการสมัคร
                            </button>
                        </div>
                    </form>

                </Modal>

                <footer className="ftco-footer ftco-bg-dark ftco-section">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md">
                                <div className="ftco-footer-widget mb-4">
                                    <h2 className="ftco-heading-2">Cloud POS</h2>
                                    <p>สมัครใช้งาน Point of Sale on Cloud ด้วย Package Free จะช่วยคุณขายสินค้าได้ 100 บิลต่อเดือน รวมถึง เมนู เพิ่มสต็อกสินค้า รายงาน วัน,เดือน,ปี</p>
                                    <ul className="ftco-footer-social list-unstyled mb-0">
                                        <li className="ftco-animate"><a href="#"><span className="fa fa-twitter"></span></a></li>
                                        <li className="ftco-animate"><a href="#"><span className="fa fa-facebook"></span></a></li>
                                        <li className="ftco-animate"><a href="#"><span className="fa fa-instagram"></span></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md">
                                {/* <div className="ftco-footer-widget mb-4 ml-md-5">
                                    <h2 className="ftco-heading-2">Unseful Links</h2>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="py-2 d-block">Company</a></li>
                                        <li><a href="#" className="py-2 d-block">Pricing</a></li>
                                        <li><a href="#" className="py-2 d-block">Leadership</a></li>
                                        <li><a href="#" className="py-2 d-block">Blog</a></li>
                                        <li><a href="#" className="py-2 d-block">Contact</a></li>
                                    </ul>
                                </div> */}
                            </div>
                            <div className="col-md">
                                {/* <div className="ftco-footer-widget mb-4">
                                    <h2 className="ftco-heading-2">Navigational</h2>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="py-2 d-block">Join Us</a></li>
                                        <li><a href="#" className="py-2 d-block">Blog</a></li>
                                        <li><a href="#" className="py-2 d-block">Privacy &amp; Policy</a></li>
                                        <li><a href="#" className="py-2 d-block">Terms &amp; Condition</a></li>
                                    </ul>
                                </div> */}
                            </div>
                            <div className="col-md">
                                <div className="ftco-footer-widget mb-4">
                                    <h2 className="ftco-heading-2">Contact</h2>
                                    <div className="block-23 mb-3">
                                        <ul>
                                            {/* <li><span className="mr-3 fa fa-map-marker"></span><span className="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li> */}
                                            <li><a href="#"><span className="mr-3 fa fa-phone"></span><span className="text">+66 8501 4174</span></a></li>
                                            <li><a href="#"><span className="mr-3 fa fa-envelope"></span><span className="text">info@yourdomain.com</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">

                                <p>
                                    Copyright &copy;{new Date().getFullYear()} All rights reserved | This template is made with <i className="fa fa-heart" aria-hidden="true"></i> by Dev
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>


            </body >



        </>
    )
}

export default Package;