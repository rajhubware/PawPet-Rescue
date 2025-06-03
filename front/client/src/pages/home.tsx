import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PawPrint, User, Shield } from "lucide-react";
import { Link } from "wouter";
import RescueReportForm from "@/components/rescue-report-form";
import InteractiveMap from "@/components/interactive-map";
import VolunteerCard from "@/components/volunteer-card";
import ShelterCard from "@/components/shelter-card";
import StatisticsSection from "@/components/statistics-section";

export default function Home() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PawPrint className="text-pink-600 w-8 h-8" />
            <h1 className="text-3xl font-bold text-pink-700">PawPet Rescue</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user?.firstName || user?.email || 'User'}
                </p>
                <p className="text-gray-500 capitalize">{user?.role || 'user'}</p>
              </div>
            </div>
            
            {(user?.role === 'volunteer' || user?.role === 'admin') && (
              <Link href="/volunteer-dashboard">
                <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link href="/admin-panel">
                <Button variant="destructive">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back, {user?.firstName || 'Friend'}!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for being part of our rescue community. Together, we're making a difference in the lives of animals in need.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Report Form */}
          <div className="lg:col-span-2">
            <RescueReportForm />
            <div className="mt-6">
              <InteractiveMap />
            </div>
          </div>

          {/* Volunteer Dashboard Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <VolunteerCard />
          </div>
        </div>

        {/* Shelter Information */}
        <ShelterCard />

        {/* Statistics */}
        <StatisticsSection />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Made with ❤️ to protect our furry friends.
          </p>
        </div>
      </footer>
    </div>
  );
}
