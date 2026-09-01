import {createBrowserRouter} from "react-router";
import Login from "./feautres/auth/pages/Login";
import Register from "./feautres/auth/pages/Register";
import Protected from "./feautres/auth/components/Protected";
import Home from "./feautres/interview/pages/Home"
import Interview from "./feautres/interview/pages/interview";


export const router = createBrowserRouter([
    {
        path:"/login",
        element: <Login/>
    },{
        path:"/register",
        element: <Register />
    },{
        path:"/",
        element:<Protected><Home/></Protected>
    },{
        path:"/interview/:interviewId",
        element:<Protected><Interview/></Protected>
    }
]);