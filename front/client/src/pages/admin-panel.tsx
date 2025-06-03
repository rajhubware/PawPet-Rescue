import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PawPrint, ArrowLeft, Users, Building, Heart, Settings } from "lucide-react";
import { Link } from "wouter";
import type { RescueReport, Shelter, Animal } from "@shared/schema";

export default function AdminPanel() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('reports');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: reports } = useQuery<RescueReport[]>({
    queryKey: ["/api/rescue-reports"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: shelters } = useQuery<Shelter[]>({
    queryKey: ["/api/shelters"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'reports', label: 'Reports', icon: Heart },
    { id: 'shelters', label: 'Shelters', icon: Building },
    { id: 'animals', label: 'Animals', icon: PawPrint },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      {/* Header */}
      <div className="container mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Settings className="text-pink-600 w-8 h-8" />
              <h1 className="text-3xl font-bold text-pink-700">Admin Panel</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Administrator</p>
            <p className="font-semibold text-gray-900">{user?.firstName || user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto mb-8">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto">
        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle>All Rescue Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {!reports || reports.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No reports found.</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={report.urgent ? "destructive" : "secondary"}>
                              {report.status}
                            </Badge>
                            <span className="text-sm text-gray-500">#{report.id}</span>
                          </div>
                          <h3 className="font-semibold">{report.location}</h3>
                          <p className="text-gray-600 text-sm">{report.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(report.createdAt!).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'shelters' && (
          <Card>
            <CardHeader>
              <CardTitle>Partner Shelters</CardTitle>
            </CardHeader>
            <CardContent>
              {!shelters || shelters.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No shelters found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shelters.map((shelter) => (
                    <div key={shelter.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{shelter.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{shelter.description}</p>
                      <p className="text-gray-500 text-xs">{shelter.address}</p>
                      {shelter.phone && (
                        <p className="text-gray-500 text-xs">{shelter.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'animals' && (
          <Card>
            <CardHeader>
              <CardTitle>Rescued Animals</CardTitle>
            </CardHeader>
            <CardContent>
              {!animals || animals.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No animals found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {animals.map((animal) => (
                    <div key={animal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{animal.name || 'Unnamed'}</h3>
                        <Badge variant="outline">{animal.status}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {animal.species} {animal.breed && `• ${animal.breed}`}
                      </p>
                      {animal.age && (
                        <p className="text-gray-500 text-xs">Age: {animal.age}</p>
                      )}
                      {animal.description && (
                        <p className="text-gray-600 text-sm mt-2">{animal.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">
                User management features coming soon...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
