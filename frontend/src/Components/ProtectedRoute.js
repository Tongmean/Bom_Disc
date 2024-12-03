import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Hook/useAuthContext';
import Notification from './Notification'; // Import the Notification component

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuthContext(); // Get the current user from the AuthContext
    const [notification, setNotification] = useState(null); // State to manage notifications
    const navigate = useNavigate(); // For navigation control, in case you need to redirect
    // console.log('user', user.data.role)
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (allowedRoles && !allowedRoles.includes(user.data.role)) {
            // If user doesn't have the required role, show the permission-denied notification
            setNotification({
                message: 'Access Denied: กรุณาติดต่อ admin เพื่อตำเนินการ.',
                type: 'warning',
            });
        } else {
            // If user is authenticated and has the required role, clear the notification
            setNotification(null);
        }
    }, [user, allowedRoles, navigate]);

    // Function to close the notification and navigate back
    const handleNotificationClose = () => {
        setNotification(null);
        navigate(-1); // Navigate back one step in the history
    };

    // Prevent rendering child routes if notification exists (indicating denied access)
    if (notification) {
        return (
            <>
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleNotificationClose}
                />
            </>
        );
    }

    // Render the child routes (protected content) if the user is authenticated and has the correct role
    return <Outlet />;
};

export default ProtectedRoute;
