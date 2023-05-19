const classes = {
    modal: "flex flex-col w-[95vw] justify-between m-auto p-8 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 bg-white",
    backdrop: "hidden flex flex-col justify-center bg-black/90 fixed h-[100vh] w-[100vw] top-0 right-0 z-32",
}

export function closeModal(e) {
    e.preventDefault();
    e.target.parentNode.parentNode.parentNode.parentNode.classList.toggle("hidden")
}

export function openModal(e) {
    e.preventDefault();
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