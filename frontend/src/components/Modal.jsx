const classes = {
    modal: 'flex flex-col justify-center w-[85vw] min-h-[40vh] m-auto p-8 bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 m-4',
    backdrop: "js__backdrop hidden flex flex-col justify-center bg-black/90 fixed h-[100vh] w-[100vw] top-0 right-0 z-32",
}

export function closeModal(e) {
    e.preventDefault();
    e.target.closest(".js__backdrop").classList.toggle("hidden")
}

export function openModal(e) {
    e.preventDefault();
    // this must be changed bc only works if modal div comes straight after button opening it
    e.target.nextSibling.classList.toggle("hidden");
}

export function Modal({children}) {
    return (
            <div className={classes.backdrop}> 
                <div className={classes.modal}>
                    {children}
                </div>
            </div>
   )
}