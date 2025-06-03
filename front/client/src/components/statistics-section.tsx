import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

interface Statistics {
  totalRescued: number;
  totalAdopted: number;
  activeVolunteers: number;
  totalShelters: number;
}

export default function StatisticsSection() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  // Default stats for display
  const defaultStats = {
    totalRescued: 247,
    totalAdopted: 189,
    activeVolunteers: 52,
    totalShelters: 8,
  };

  const displayStats = stats || defaultStats;

  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Impact This Year</h2>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-pink-600 mb-2">
              {displayStats.totalRescued.toLocaleString()}
            </div>
            <p className="text-gray-600">Animals Rescued</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-500 mb-2">
              {displayStats.totalAdopted.toLocaleString()}
            </div>
            <p className="text-gray-600">Successful Adoptions</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {displayStats.activeVolunteers.toLocaleString()}
            </div>
            <p className="text-gray-600">Active Volunteers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {displayStats.totalShelters.toLocaleString()}
            </div>
            <p className="text-gray-600">Partner Shelters</p>
          </div>
        </div>
      )}
    </section>
  );
}
