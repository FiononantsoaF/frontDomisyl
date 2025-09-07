import React from "react";
import { AppointmentList } from "../api/serviceCategoryApi";

interface Props {
  appointments?: AppointmentList;
}

const AppointmentsTable: React.FC<Props> = ({ appointments }) => {
  if (!appointments || appointments.data.length === 0) {
    return <p>Aucun rendez-vous trouvé.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Agency FB' }} >📅 Mes Rendez-vous</h3>
        <table className="min-w-full divide-y  text-sm text-700">
        <thead className="bg-[#f18f34] text-white"  >
            <tr>
            <th className="px-6 py-3 text-left font-semibold">Service</th>
            <th className="px-6 py-3 text-left font-semibold">Formule</th>
            <th className="px-6 py-3 text-left font-semibold">Date</th>
            <th className="px-6 py-3 text-left font-semibold">Prestataire</th>
            <th className="px-6 py-3 text-left font-semibold">Prix Normal</th>
            <th className="px-6 py-3 text-left font-semibold">Prix promotion</th>

            <th className="px-6 py-3 text-left font-semibold">Statut</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
            {appointments?.data?.map((appt, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{appt.service}</td>
                <td className="px-6 py-4">{appt.formule}</td>
                <td className="px-6 py-4 text-base text-gray-800 font-medium whitespace-nowrap">{appt.date_reserver}</td>
                <td className="px-6 py-4">{appt.nomprestataire}</td>
                <td className="px-6 py-4">{appt.prixservice} Ar</td>
                <td className="px-6 py-4">{appt.prixpromo ? `${appt.prixpromo} Ar` : '-'}</td>
                <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-600'}
                `}>
                    {appt.status}
                </span>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default AppointmentsTable;
