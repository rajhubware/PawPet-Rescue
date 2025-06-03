import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertTriangle, Send, CheckCircle, MapPin, Loader2 } from "lucide-react";
import { insertRescueReportSchema } from "@shared/schema";
import { z } from "zod";

const formSchema = insertRescueReportSchema.extend({
  urgent: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export default function RescueReportForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      description: "",
      urgent: false,
      latitude: "",
      longitude: "",
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/rescue-reports", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rescue-reports"] });
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Report Submitted Successfully!",
        description: "Our volunteers will respond as soon as possible.",
      });
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
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
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("latitude", latitude.toString());
        form.setValue("longitude", longitude.toString());
        
        // Reverse geocode to get address (if Google Maps API is available)
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (apiKey && window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };
          
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              form.setValue("location", results[0].formatted_address);
            }
          });
        }
        
        toast({
          title: "Location captured",
          description: "GPS coordinates have been added to your report.",
        });
        setIsGettingLocation(false);
      },
      (error) => {
        let message = "Unable to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const onSubmit = (data: FormData) => {
    createReportMutation.mutate(data);
  };

  return (
    <Card className="bg-white shadow-xl rounded-2xl">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <AlertTriangle className="text-pink-600 w-6 h-6 mr-3" />
          <h2 className="text-2xl font-semibold text-pink-700">Report an Animal in Need</h2>
        </div>
        <p className="text-gray-600 mb-6">
          If you've spotted an injured or abandoned animal, report it here so our volunteers can respond quickly and provide the necessary care.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Animal Location
                  </FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        placeholder="Enter street address, landmark, or description..."
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="px-3 py-3 border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    Click the location button to automatically capture your GPS coordinates
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Situation Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the animal's condition and situation..."
                      rows={3}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      This is an urgent emergency
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createReportMutation.isPending || isSubmitted}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${
                isSubmitted
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white'
              }`}
            >
              {createReportMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Report Submitted!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
