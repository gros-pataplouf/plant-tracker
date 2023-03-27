export default function Login() {
    function submitHandler() {
        
    }

    return (
        <form action="">
            <label htmlFor="">Please enter your email</label>
            <input type="text" />
            <label htmlFor="">Please enter your password</label>
            <input type="text" />
            <button type="submit" onSubmit={submitHandler}>Submit</button>
         </form>
    )
}