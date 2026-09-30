import React, { useEffect } from 'react';
import type { ProtectedRouteProps } from '../types';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated, fallback, redirectTo }) => {
	useEffect(() => {
		if (!isAuthenticated && redirectTo && typeof window !== 'undefined') {
			window.location.href = redirectTo;
		}
	}, [isAuthenticated, redirectTo]);

	if (!isAuthenticated) {
		return fallback ? <>{fallback}</> : null;
	}

	return <>{children}</>;
};
