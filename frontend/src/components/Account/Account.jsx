import axiosInstance from "../../helpers/axios";
import { useState, useEffect } from "react";
import { testMail, testPassword } from '../../helpers/checks';
import { Modal, handleModal } from "../Modal";
import AnimationLoading from "../AnimationLoading";
import UpdateEmail from "./Subcomponents/UpdateEmail";
import ChangePassword from "./Subcomponents/ChangePassword";

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
    cancel: "",
    label: "", 
    input: "",
    dangertext: "text-red-800 font-bold",
    message: "border-red-800 active:outline-red-800",
    buttonwrapper: "flex space-4",
    dangercancelbutton: "btn bg-yellow-50 text-emerald-950 border-solid border-2 border-red-800",
    submissions: "scroll",
    confirmModal: "flex flex-col"
}


export default function Account() {
    const [ user, setUser ] = useState();
    const [ submissions, setSubmissions ] = useState([]);
    const [ loading, setLoading ] = useState(true);

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
    }, [])



    function handleDelete() {
        axiosInstance.delete('accounts/me/')
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }




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
                <UpdateEmail />    
            </Modal>
        </div>
        {/* Password change */}
        <div>
            <button className={classes.button} onClick={handleModal} name="openModal">Change password</button>
            <Modal>
                <ChangePassword/>
            </Modal>
        <div>
        
        {/* Delete account */}
        <button className={classes.button} onClick={handleModal}>Delete account</button>
        <Modal>
            <form action="">
                        <p className={classes.dangertext}>Are you sure you want to delete your account? This cannot be undone!</p>
                        <div className={classes.buttonwrapper}>
                        <button className={classes.dangerbutton} onClick={handleDelete}>Yes, I'm sure</button>
                        <button className={classes.dangercancelbutton} onClick={handleModal}>Cancel</button>
                        </div>
            </form>
        </Modal>
        </div>
        </div>

        <div className={classes.submissions}>

        <h3 className={classes.title}>My submissions</h3>
        <ul>
            {!submissions? <li>You have not submitted any data yet.</li> 
            : 
             submissions.map(submission => {
                return <li key={submission.id}>
                    📌 {new Date(submission.created_at).toLocaleString('en-GB')} near {submission.display_name || "unknown address"}
                    </li>})}
        </ul>
        </div>
        </div>
    )
}