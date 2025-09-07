import React from 'react';
import { BarChart, Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Rendez-vous du jour',
      value: '12',
      icon: Calendar,
      change: '+2.5%',
      changeType: 'increase'
    },
    {
      name: 'Nouveaux clients',
      value: '24',
      icon: Users,
      change: '+3.7%',
      changeType: 'increase'
    },
    {
      name: 'Chiffre d\'affaires',
      value: '2.4M Ar',
      icon: TrendingUp,
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      name: 'Services réservés',
      value: '42',
      icon: BarChart,
      change: '+4.1%',
      changeType: 'increase'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-[#f18f34] rounded-md p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
};

export default Dashboard;