import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, User, Shield, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { RescueReport } from "@shared/schema";

export default function VolunteerCard() {
  const { user } = useAuth();

  const { data: reports } = useQuery<RescueReport[]>({
    queryKey: ["/api/rescue-reports"],
    enabled: user?.role === 'volunteer' || user?.role === 'admin',
  });

  // Mock volunteer data for display
  const mockVolunteers = [
    {
      name: "Sarah M.",
      role: "Rescue Coordinator",
      avatar: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    },
    {
      name: "Dr. James K.",
      role: "Veterinarian",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    },
    {
      name: "Martha L.",
      role: "Foster Care",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    },
    {
      name: "Mike R.",
      role: "Dog Walker",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    }
  ];

  return (
    <>
      <div className="flex items-center mb-6">
        <Heart className="text-pink-600 w-6 h-6 mr-3" />
        <h2 className="text-2xl font-semibold text-pink-700">Volunteer Hub</h2>
      </div>
      <p className="text-gray-600 mb-6">
        {user?.role === 'volunteer' || user?.role === 'admin' 
          ? "Access your volunteer dashboard to manage rescue operations."
          : "Join our dedicated team of volunteers or access admin tools to manage rescue operations."
        }
      </p>
      
      <div className="space-y-4 mb-6">
        {user?.role === 'volunteer' || user?.role === 'admin' ? (
          <>
            <Link href="/volunteer-dashboard">
              <Button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white hover:bg-blue-700">
                <User className="w-4 h-4" />
                Volunteer Dashboard
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin-panel">
                <Button variant="destructive" className="w-full flex items-center justify-center gap-3">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </>
        ) : (
          <>
            <Button variant="secondary" className="w-full flex items-center justify-center gap-3">
              <User className="w-4 h-4" />
              Volunteer Access
            </Button>
            <Button variant="destructive" className="w-full flex items-center justify-center gap-3">
              <Shield className="w-4 h-4" />
              Admin Panel
            </Button>
          </>
        )}
      </div>

      {/* Active Reports Summary */}
      {(user?.role === 'volunteer' || user?.role === 'admin') && reports && (
        <div className="mb-6 p-4 bg-pink-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-pink-600">
                {reports.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {reports.filter(r => r.status === 'in_progress').length}
              </div>
              <div className="text-xs text-gray-600">In Progress</div>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Profiles */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Our Amazing Volunteers</h3>
        {mockVolunteers.map((volunteer, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
              <AvatarFallback>{volunteer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{volunteer.name}</p>
              <p className="text-xs text-gray-500">{volunteer.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center p-4 bg-pink-50 rounded-lg">
        <MapPin className="text-pink-500 w-6 h-6 mx-auto mb-2" />
        <p className="text-xs text-gray-600">Location services enabled for faster emergency response</p>
      </div>
    </>
  );
}
