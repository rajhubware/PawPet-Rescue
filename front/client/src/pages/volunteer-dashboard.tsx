import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PawPrint, ArrowLeft, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import type { RescueReport } from "@shared/schema";

export default function VolunteerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: reports, isLoading: reportsLoading } = useQuery<RescueReport[]>({
    queryKey: ["/api/rescue-reports"],
    enabled: isAuthenticated && (user?.role === 'volunteer' || user?.role === 'admin'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/rescue-reports/${reportId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rescue-reports"] });
      toast({
        title: "Success",
        description: "Report status updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    },
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

  if (!isAuthenticated || (user?.role !== 'volunteer' && user?.role !== 'admin')) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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
              <PawPrint className="text-pink-600 w-8 h-8" />
              <h1 className="text-3xl font-bold text-pink-700">Volunteer Dashboard</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="font-semibold text-gray-900">{user?.firstName || user?.email}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {reports?.filter(r => r.status === 'pending').length || 0}
                </div>
                <p className="text-sm text-gray-600">Pending Reports</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reports?.filter(r => r.status === 'in_progress').length || 0}
                </div>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reports?.filter(r => r.status === 'completed').length || 0}
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {reports?.filter(r => r.urgent).length || 0}
                </div>
                <p className="text-sm text-gray-600">Urgent Cases</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Rescue Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reports...</p>
              </div>
            ) : !reports || reports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No rescue reports found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1 capitalize">{report.status.replace('_', ' ')}</span>
                          </Badge>
                          {report.urgent && (
                            <Badge variant="destructive">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            #{report.id}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {report.location}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {report.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Reported: {new Date(report.createdAt!).toLocaleDateString()} at {new Date(report.createdAt!).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {report.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ reportId: report.id, status: 'assigned' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Assign to Me
                          </Button>
                        )}
                        {report.status === 'assigned' && report.assignedVolunteerId === user?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({ reportId: report.id, status: 'in_progress' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Start Work
                          </Button>
                        )}
                        {report.status === 'in_progress' && report.assignedVolunteerId === user?.id && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateStatusMutation.mutate({ reportId: report.id, status: 'completed' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
