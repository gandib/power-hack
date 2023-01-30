import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';


const RequireAuth = ({ children }) => {
    const userToken = localStorage.getItem('accessToken');
    const location = useLocation();


    if (!userToken) {
        return <Navigate to='/login' state={{ from: location }} replace></Navigate>
    }



    return children;
};

export default RequireAuth;