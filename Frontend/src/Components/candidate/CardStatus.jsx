import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function CardStatus({total, shortlisted, rejected}) {
    return (
        <div className="px-8 py-6">
            <div className="grid grid-cols-3 gap-6">
                {/* Total Candidates */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-2">Total Candidates</p>
                            <p className="text-4xl font-bold text-gray-900">{total}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Shortlisted */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-2">Shortlisted</p>
                            <p className="text-4xl font-bold text-gray-900">{shortlisted}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Rejected */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-2">Rejected</p>
                            <p className="text-4xl font-bold text-gray-900">{rejected}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}