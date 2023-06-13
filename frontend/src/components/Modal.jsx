import cancel from '../assets/icons/cancel.svg'

const classes = {
    modal: 'p-8 backdrop:bg-gray-700 backdrop:bg-opacity-90 rounded-lg',
}

export function closeModal(e) {
    e.preventDefault();
    e.target.closest("dialog").classList.toggle("hidden");
}

export function openModal(e) {
    e.preventDefault();
    // this must be changed bc only works if modal div comes straight after button opening it
    e.target.nextSibling.classList.toggle("hidden");
}

export function handleModal(e) {
    e.preventDefault();
   //check which button has been clicked
    if (e.target.getAttribute('name') === 'openModal') {
    //the modal is always next to the opening button
    const currentModal = e.target.nextElementSibling;
    currentModal.showModal(); } 
    else if (e.target.getAttribute('name') === 'closeModal') {
        // the modal is always the closest ancestor of 
        const currentModal = e.target.closest("dialog");
        currentModal.close();
   } else {
    //reload the page if name attribute is missing
    location.reload();

   }

}


export function Modal({children}) {
    return (
            <dialog className={classes.modal}>
                <img onClick={handleModal} name="closeModal" src={cancel} alt="" />
                    {children}
            </dialog>
   )
}

