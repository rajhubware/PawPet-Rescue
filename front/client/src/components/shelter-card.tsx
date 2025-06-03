import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Shelter } from "@shared/schema";

export default function ShelterCard() {
  const { data: shelters, isLoading } = useQuery<Shelter[]>({
    queryKey: ["/api/shelters"],
  });

  // Default shelters if none exist in database
  const defaultShelters = [
    {
      id: 1,
      name: "Central Animal Shelter",
      description: "Main facility with medical care and adoption services",
      address: "123 Rescue Avenue",
      imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
    {
      id: 2,
      name: "Paws & Hearts Rescue",
      description: "Specialized in rehabilitation and foster care programs",
      address: "456 Hope Street",
      imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
    {
      id: 3,
      name: "24/7 Emergency Center",
      description: "Round-the-clock emergency veterinary care",
      address: "789 Compassion Blvd",
      imageUrl: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    }
  ];

  const displayShelters = shelters && shelters.length > 0 ? shelters : defaultShelters;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Partner Shelters</h2>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shelters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayShelters.map((shelter) => (
            <Card key={shelter.id} className="bg-white shadow-lg overflow-hidden">
              <img 
                src={shelter.imageUrl || defaultShelters[0].imageUrl}
                alt={shelter.name}
                className="w-full h-48 object-cover" 
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{shelter.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{shelter.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{shelter.address}</span>
                </div>
                {shelter.phone && (
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Phone: {shelter.phone}</span>
                  </div>
                )}
                {shelter.email && (
                  <div className="mt-1 text-sm text-gray-500">
                    <span>Email: {shelter.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
