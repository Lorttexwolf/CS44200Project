'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, loading, logout, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    if (loading) {
        return (
            <>
                
                <div className="min-h-screen flex items-center justify-center" style={{ marginTop: '72px' }}>
                    <div className="text-xl text-gray-600">Loading...</div>
                </div>
                
            </>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ marginTop: '72px' }}>
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <p className="text-blue-100 mt-1">{user.email}</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                    <span className="text-white font-medium capitalize">
                                        {user.servicePermissions}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="px-6 py-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <div className="text-gray-900 bg-gray-50 rounded-md px-4 py-2">
                                        {user.firstName}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <div className="text-gray-900 bg-gray-50 rounded-md px-4 py-2">
                                        {user.lastName}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="text-gray-900 bg-gray-50 rounded-md px-4 py-2">
                                        {user.email}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Account Status
                                    </label>
                                    <div className="bg-gray-50 rounded-md px-4 py-2">
                                        <span className="inline-flex items-center text-green-700">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="border-t px-6 py-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(user.servicePermissions === 'admin' || user.servicePermissions === 'campus_admin') && (
                                    <Link href="/admin">
                                        <Button className="w-full bg-linear-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white cursor-pointer">
                                            🔧 Admin Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/map">
                                    <Button variant="outline" className="w-full cursor-pointer">
                                        View Parking Map
                                    </Button>
                                </Link>
                                <Link href="/reservations">
                                    <Button variant="outline" className="w-full cursor-pointer">
                                        My Reservations
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Sections */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Parking Stats */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Parking Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Reservations</span>
                                    <span className="font-semibold text-gray-900">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Active Reservations</span>
                                    <span className="font-semibold text-gray-900">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Favorite Spots</span>
                                    <span className="font-semibold text-gray-900">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="text-gray-500 text-center py-8">
                                No recent activity
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
