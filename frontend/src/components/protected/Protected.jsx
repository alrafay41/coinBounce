import { Navigate } from "react-router-dom";

function Protected(isAuth, children)
// children is the component inside the route in app.js 
{
    if (isAuth) {
        return children
    }
    else {
        return <Navigate to='/login' />
    }

}

export default Protected;