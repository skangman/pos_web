import config from "../config";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useState, useEffect } from 'react';
import axios from "axios";

function Navbar() {
    const navigate = useNavigate();
    const [memberName, setMemberName] = useState();

    const handleSignOut = () => {
        Swal.fire({
            title: 'Sign Out',
            text: 'ยืนยันการออกจากระบบ',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(res => {
            if (res.isConfirmed) {
                localStorage.removeItem(config.token_name);
                navigate('/login');
            }
        })
    }

    const handleEditProfile = async () => {
        try {
            await axios.get(config.api_path + '/member/info', config.headers()).then(res => {

                if (res.data.message === 'success') {
                    setMemberName(res.data.result.name);
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

    const handleChangeProfile = async () => {
        try {
            const url = config.api_path + '/member/changeProfile';
            const payload = { memberName: memberName }
            await axios.put(url, payload, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'เปลี่ยนข้อมูล',
                        text: 'เปลี่ยนแปลงข้อมูลแล้ว',
                        icon: 'success',
                        timer: 2000
                    })
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

    // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const sideNavClicked = () => {
    //     setIsSidebarOpen(true);
    //     console.log('isSidebarOpen = ', isSidebarOpen)
    // }
    const progressSideBar = document.getElementById("progressSideBar");
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);

        console.log(isOpen);

        if (isOpen == false) {
            progressSideBar.style.display = "none";
        } else {
            progressSideBar.style.display = "block";
        }


    }

    // toggle == true ? progressSideBar.style.display = 'none' :'';
    // const progressSideBar = document.getElementById("progressSideBar");
    // // console.log(window);
    // // window.style.display = "none";
    // // progressSideBar.style.display = "block";
    // if (isOpen == true) {
    //     progressSideBar.style.display = "none";
    // }
    return (
        <>

            <nav class="main-header navbar navbar-expand navbar-white navbar-light">

                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button" onClick={toggle}><i class="fas fa-bars"></i></a>
                    </li>
                    {/* <li class="nav-item d-none d-sm-inline-block">
                        <a href="index3.html" class="nav-link">Home</a>
                    </li> */}

                </ul>


                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <button onClick={handleEditProfile} data-toggle='modal' data-target='#modalEditProfile' className="btn btn-info mr-2">
                            <i className="fa fa-user mr-2"></i>
                            Profile
                        </button>
                        <button onClick={handleSignOut} className="btn btn-danger">
                            <i className="fa fa-times mr-2"></i>
                            Sign Out
                        </button>
                    </li>
                </ul>
            </nav>

            <Modal id='modalEditProfile' title='แก้ไขข้อมูลร้าน'>
                <div>
                    <label>ชื่อร้าน</label>
                    <input value={memberName} onChange={e => setMemberName(e.target.value)} className="form-control" />
                </div>
                <div className="mt-3">
                    <button onClick={handleChangeProfile} className="btn btn-primary">
                        <i className="fa fa-check mr-2"></i>
                        Save
                    </button>
                </div>

            </Modal>

        </>
    )
}

export default Navbar;