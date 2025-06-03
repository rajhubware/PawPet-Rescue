import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Shield, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleSignUp = () => {
    window.location.href = "/api/login";
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
            <Button variant="outline" onClick={handleLogin} className="border-pink-600 text-pink-600 hover:bg-pink-50">
              Login
            </Button>
            <Button onClick={handleSignUp} className="bg-pink-600 hover:bg-pink-700 text-white">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Saving Lives, One Paw at a Time</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of compassionate volunteers dedicated to rescuing and rehabilitating animals in need across our city.
          </p>
        </div>
        
        {/* Rescued Animals Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 max-w-6xl mx-auto">
          {[
            "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
            "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
            "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
          ].map((src, index) => (
            <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img 
                src={src}
                alt={`Rescued Animal ${index + 1}`}
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Report Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Shield className="text-pink-600 w-6 h-6 mr-3" />
              <h2 className="text-2xl font-semibold text-pink-700">Report an Animal in Need</h2>
            </div>
            <p className="text-gray-600 mb-6">
              If you've spotted an injured or abandoned animal, please sign up or log in to report it so our volunteers can respond quickly and provide the necessary care.
            </p>
            
            <Button 
              onClick={handleSignUp} 
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all transform hover:scale-[1.02] font-semibold mb-6"
            >
              Sign Up to Report
            </Button>
            
            {/* Interactive Map Placeholder */}
            <div className="w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 relative">
              <div className="absolute inset-4 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-pink-600 w-12 h-12 mx-auto mb-2" />
                  <p className="text-gray-700 font-medium">Interactive Rescue Map</p>
                  <p className="text-sm text-gray-500">Login to view rescue locations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Volunteer Dashboard Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Heart className="text-pink-600 w-6 h-6 mr-3" />
              <h2 className="text-2xl font-semibold text-pink-700">Volunteer Hub</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Join our dedicated team of volunteers or access admin tools to manage rescue operations.
            </p>
            
            <div className="space-y-4 mb-6">
              <Button 
                onClick={handleLogin}
                variant="secondary" 
                className="w-full flex items-center justify-center gap-3"
              >
                Volunteer Access
              </Button>
              <Button 
                onClick={handleLogin}
                variant="destructive" 
                className="w-full flex items-center justify-center gap-3"
              >
                Admin Panel
              </Button>
            </div>

            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <MapPin className="text-pink-500 w-6 h-6 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Location services enabled for faster emergency response</p>
            </div>
          </div>
        </div>

        {/* Shelter Information Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Partner Shelters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Central Animal Shelter",
                description: "Main facility with medical care and adoption services",
                address: "123 Rescue Avenue",
                image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
              },
              {
                name: "Paws & Hearts Rescue",
                description: "Specialized in rehabilitation and foster care programs",
                address: "456 Hope Street",
                image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
              },
              {
                name: "24/7 Emergency Center",
                description: "Round-the-clock emergency veterinary care",
                address: "789 Compassion Blvd",
                image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
              }
            ].map((shelter, index) => (
              <Card key={index} className="bg-white shadow-lg overflow-hidden">
                <img 
                  src={shelter.image}
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
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Impact This Year</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">247</div>
              <p className="text-gray-600">Animals Rescued</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">189</div>
              <p className="text-gray-600">Successful Adoptions</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">52</div>
              <p className="text-gray-600">Active Volunteers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
              <p className="text-gray-600">Partner Shelters</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PawPrint className="text-pink-600 w-6 h-6" />
                <h3 className="text-xl font-bold text-pink-700">PawPet Rescue</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Dedicated to saving and improving the lives of animals in need through rescue, rehabilitation, and adoption services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-pink-600 transition-colors">Report Emergency</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Adopt a Pet</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Donate</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  (555) 123-PAWS
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  rescue@pawpet.org
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  123 Rescue Ave, City
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              Made with ❤️ to protect our furry friends. © 2024 PawPet Rescue. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
