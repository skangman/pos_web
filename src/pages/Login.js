import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [phone, setPhone] = useState();
    const [pass, setPass] = useState();

    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const payload = {
                phone: phone,
                pass: pass
            }
            await axios.post(config.api_path + '/member/signin', payload).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Sign In',
                        text: 'เข้าสู้ระบบแล้ว',
                        icon: 'success',
                        timer: 2000
                    })
                    localStorage.setItem(config.token_name, res.data.token);
                    navigate('/home');
                } else {
                    Swal.fire({
                        title: 'Sign In',
                        text: 'ไม่พบข้อมูลในระบบ',
                        icon: 'warning',
                        timer: 2000
                    })
                }
            }).catch(err => {
                throw err.message.data;
            })

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e,
                icon: 'error'
            })
        }
    }

    return (
        <>
            {/* <div className="card container mt-5">
                <div className="card-header">
                    <div className="card-title">Login to POS</div>
                </div>

                <div className="card-body">
                    <div>
                        <label>เบอร์โทร</label>
                        <input onChange={e => setPhone(e.target.value)} className="form-control" />
                    </div>
                    <div className="mt-3">
                        <label>Password</label>
                        <input onChange={e => setPass(e.target.value)} className="form-control" />
                    </div>
                    <div className="mt-3">
                        <button onClick={handleSignIn} className="btn btn-primary">
                            <i className="fa fa-check" style={{ marginRight: '10px' }}></i>
                            Sign In
                        </button>
                    </div>
                </div>

            </div> */}

            <section className="ftco-section">
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-md-5">
                            <div className="login-wrap p-4 p-md-4 login-user">
                                <div className="icon d-flex align-items-center justify-content-center">
                                    <span className="fa fa-user"></span>
                                </div>
                                <h3 className="text-center mb-4">Login to POS</h3>
                                {/* <form className="login-form "> */}
                                <div className="form-group">
                                    <input type="text" onChange={e => setPhone(e.target.value)} className="form-control" placeholder="เบอร์โทร" />
                                </div>
                                <div className="form-group d-flex">
                                    <input type="password" onChange={e => setPass(e.target.value)} className="form-control" placeholder="Password" />
                                </div>
                                <div className="form-group d-md-flex">
                                    <div className="w-50">

                                    </div>
                                    <div className="w-50 text-md-right">
                                        <a href="#">Forgot Password</a>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button onClick={handleSignIn} className="btn btn-secondary p-3 px-4">
                                        <i className="fa fa-check me-2" ></i>
                                        Sign In
                                    </button>
                                </div>
                                {/* </form> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login;