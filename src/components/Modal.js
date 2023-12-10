function Modal(props) {
    let modalSize = 'modal-dialog';

    if (props.modalSize) {
        modalSize += ' ' + props.modalSize;
    }
    return (
        <>
            <div className="modal" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={modalSize}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{props.title}</h5>
                            <button id="btnModalclose" type="button" className="btn-close btnClose" data-dismiss="modal" aria-label="Close" aria-hidden="true" ></button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Modal;