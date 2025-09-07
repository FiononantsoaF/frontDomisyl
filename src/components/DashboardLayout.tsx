import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Award, BarChart, LogOut, 
  Menu, X, ChevronDown 
} from 'lucide-react';
import { useAuthStore } from '../stores/auth';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: BarChart, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Rendez-vous', path: '/admin/appointments' },
    { icon: Users, label: 'Clients', path: '/admin/clients' },
    { icon: Award, label: 'Services', path: '/admin/services' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/domisyl-logo.png"
                alt="Logo"
                className="h-8"
              />
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;