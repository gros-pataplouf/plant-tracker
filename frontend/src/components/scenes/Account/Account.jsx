import { useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import { Modal, handleModal } from "../../elements/Modal";
import AnimationLoading from "../../elements/AnimationLoading";
import ChangePassword from "./Subcomponents/ChangePassword";
import DeleteAccount from "./Subcomponents/DeleteAccount";
import Submissions from "./Subcomponents/Submissions";
import UpdateEmail from "./Subcomponents/UpdateEmail";

const classes = {
    account: "p-4 space-2",
    modal: "flex flex-col w-[95vw] h-[45vh] justify-between m-auto p-8 rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 bg-white",
    title: "bg-emerald-900 text-yellow-50 p-4", 
    paragraph: "mt-4 mb-2", 
    button: "btn rounded-none",
    dangerbutton: "btn bg-red-800 text-white",
    cancelbutton: "btn bg-yellow-50 text-emerald-950 border-solid border-2 border-emerald-800", 
    backdrop: "hidden js__backdrop flex flex-col justify-center bg-black/90 fixed h-[100vh] w-[100vw] top-0 right-0 z-32",
    form: "flex flex-col", 
    dangertext: "text-red-800 font-bold",
    message: "border-red-800 active:outline-red-800",
    buttonwrapper: "flex space-4",
    dangercancelbutton: "btn bg-yellow-50 text-emerald-950 border-solid border-2 border-red-800",
    confirmModal: "flex flex-col"
}


export default function Account() {
    const [ user, setUser ] = useState();
    const [ submissions, setSubmissions ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ changes, setChanges ] = useState(false);

    useEffect(() => {
        axiosInstance.get('accounts/me/')
        //backend filters out the right user
        .then(res => {
            const user = res.data;
            setUser(user);
            axiosInstance.get(`api/locations?author=${user.id}`)
            .then(res => { setSubmissions(res.data); setLoading(false); console.log(submissions)})
            .catch(err => {console.error(err); setLoading(false)})
        })
        .catch(err => {
            console.log(err)
        }) 
    }, [changes])




    return (
        loading?
        <AnimationLoading>
        <p>Loading...</p>
        </AnimationLoading>
        :
        <div className={classes.account}>
        <h3 className={classes.title}>My account settings</h3>
        <div>
            <p className={classes.paragraph}>Username</p>
            {user && <p>{user.username}</p>}
            
        </div>
        {/* Email */}
        <div>
            <p className={classes.paragraph}>Email</p>
            {user && <p className={classes.paragraph}>{user.email}</p>}
            <button className={classes.button} name="openModal" onClick={handleModal}>Update</button>
            {/* Change email */}
            <Modal>
                <UpdateEmail props={{changes, setChanges}}/>    
            </Modal>
        </div>
        {/* Password change */}
        <div>
            <button className={classes.button} onClick={handleModal} name="openModal">Change password</button>
            <Modal>
                <ChangePassword/>
            </Modal>
       
        
        {/* Delete account */}
        <div>
            <button className={classes.button} name="openModal" onClick={handleModal}>Delete account</button>
            <Modal>
                <DeleteAccount/>
            </Modal>
        </div>


        </div>
        <Submissions props={{submissions}}/>
        </div>
    )
}