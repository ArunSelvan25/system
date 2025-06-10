import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div
                className={`bg-white border-r transition-all duration-300 ease-in-out 
                    ${sidebarOpen ? 'w-48' : 'w-16'} 
                    hidden sm:block`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                        <ApplicationLogo className="h-8 w-auto" />
                        
                        {sidebarOpen && (
                            <>
                                <span className="text-lg font-semibold text-gray-800">
                                    System
                                </span>
                            </>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="sm:hidden text-gray-500 focus:outline-none"
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <nav className="mt-4 space-y-2 px-4">
                    {/* Add more links as needed */}
                    {sidebarOpen && (
                        <div className='flex flex-col space-y-6 w-full p-4 bg-white'>
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </NavLink>
                            {(["list_role", "assign_permission_to_role", "create_role", "delete_role"].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && 
                                <NavLink href={route('role-permission.index')} active={route().current('role-permission.index')}>
                                    Roles
                                </NavLink>
                            }
                            {(['list_user', 'create_user', 'edit_user', 'delete_user'].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && 
                                <NavLink href={route('owner.index')} active={route().current('owner.index')}>
                                    User
                                </NavLink>
                            }
                            {(['assign_tenant_property'].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && 
                                <NavLink href={route('property.assignment.index')} active={route().current('property.assignment.index')}>
                                    Assignment
                                </NavLink>
                            }
                            <NavLink href="#" onClick={() => alert('Other Link')}>
                                Link 2
                            </NavLink>
                        </div>
                    )}
                </nav>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex sm:hidden">
                    <div className="relative w-64 bg-white border-r">
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="text-lg font-semibold">System</span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-600 focus:outline-none"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="flex flex-col space-y-4 p-4">
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </NavLink>
                            {(["list_role", "assign_permission_to_role", "create_role", "delete_role"].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && 
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Roles
                                </NavLink>
                            }
                            {(['list_user', 'create_user', 'edit_user', 'delete_user'].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && 
                                <NavLink href={route('owner.index')} active={route().current('owner.index')}>
                                    User
                                </NavLink>
                            }
                            {(['assign_tenant_property'].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && 
                                <NavLink href={route('property.assignment.index')} active={route().current('property.assignment.index')}>
                                    User
                                </NavLink>
                            }
                            <NavLink href="#" onClick={() => alert('Other Link')}>
                                Link 2
                            </NavLink>
                            <NavLink href={route('profile.edit')} active={route().current('profile.edit')}>
                                Profile
                            </NavLink>
                            <NavLink href={route('logout')} method="post" as="button">
                                Logout
                            </NavLink>
                        </div>
                    </div>
                    {/* Overlay */}
                    <div
                        className="flex-1 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                </div>
            )}


            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation Bar */}
                <nav className="border-b border-gray-100 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex items-center space-x-8">
                                {/* Only visible on small screens */}
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="sm:hidden text-gray-500"
                                >
                                    <FaBars />
                                </button>
                                {header && (
                                    <header className="">
                                        <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                                    </header>
                                )}
                            </div>

                            <div className="hidden sm:flex sm:items-center">
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                

                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    );
}
