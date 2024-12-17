import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Hook/useAuthContext';
import Notification from './Notification'; // Import the Notification component

const ProtectedRoute = ({ allowedRoles, allowedPermissions }) => {
    const { user } = useAuthContext(); // Get the current user from the AuthContext
    const [notification, setNotification] = useState(null); // State to manage notifications
    const navigate = useNavigate(); // For navigation control, in case you need to redirect

    useEffect(() => {
        // If no user exists, navigate to login
        if (!user) {
            navigate('/login');
            return;
        }

        const userPermissions = [
            user.data.permission1,
            user.data.permission2,
            user.data.permission3,
            user.data.permission4
        ].filter(permission => permission && permission !== '-'); // Filter out invalid permissions

        const hasValidRole = allowedRoles?.includes(user.data.role);
        const hasValidPermission = allowedPermissions?.some(permission =>
            userPermissions.includes(permission)
        );
        console.log('hasValidPermission', hasValidPermission)
        console.log('hasValidRole', hasValidRole)
        console.log('!hasValidRole && !hasValidPermission', !hasValidRole && !hasValidPermission)
        console.log('User Role:', user.data.role);
        console.log('User Permissions:', userPermissions);
        console.log('Allowed Roles:', allowedRoles);
        console.log('Allowed Permissions:', allowedPermissions);

        // If the user role and permissions do not match, show notification
        if (!hasValidRole && !hasValidPermission) {
            setNotification({
                message: 'Access Denied: กรุณาติดต่อ admin เพื่อตำเนินการ.',
                type: 'warning',
            });
        } else {
            setNotification(null); // Clear notification if access is granted
        }
    }, [user, allowedRoles, allowedPermissions, navigate]);

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

    // Render the child routes (protected content) if access is granted
    return <Outlet />;
};

export default ProtectedRoute;
