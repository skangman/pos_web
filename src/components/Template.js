import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { forwardRef, useImperativeHandle } from "react"; //เติม fixbug รีเฟสเปอร์เซ็นขาย
import { useRef } from "react"; //เติม fixbug รีเฟสเปอร์เซ็นขาย

const Template = forwardRef((props, ref) => { //เติม fixbug รีเฟสเปอร์เซ็นขาย
    useImperativeHandle(ref, () => ({
        refreshCountBill() {
            if (templateRef.current) {
                templateRef.current.refreshCountBill();
            }
        },
    }));

    const templateRef = useRef(); //เติม fixbug รีเฟสเปอร์เซ็นขาย
    // function Template(props) {

    return (
        <>
            <div className="wrapper">
                <Navbar />
                <Sidebar ref={templateRef} />  {/* //เติม fixbug รีเฟสเปอร์เซ็นขาย */}
                <div class="content-wrapper pt-3">
                    <section class="content">
                        {props.children}
                    </section>

                </div>

            </div>
        </>
    )

    // }
}); //เติม fixbug รีเฟสเปอร์เซ็นขาย

export default Template;