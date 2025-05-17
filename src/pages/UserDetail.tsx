
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserById, fetchPostsByUserId } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
import PostCard from "@/components/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building2, 
  Briefcase, 
  ArrowLeft
} from "lucide-react";

interface SavedLocation {
  address: string;
  latitude: number;
  longitude: number;
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // Renamed to authUser to avoid conflict
  const { toast } = useToast();
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);

  const isViewingOwnAdminProfile = !!authUser && authUser.isAdmin && authUser.id === Number(id);

  // Load saved location from localStorage on component mount
  useEffect(() => {
    if (id && !isViewingOwnAdminProfile) { // Don't load for admin's own profile if not needed
      const storedLocation = localStorage.getItem(`user_location_${id}`);
      if (storedLocation) {
        setSavedLocation(JSON.parse(storedLocation));
      }
    }
  }, [id, isViewingOwnAdminProfile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Fetch user details - disabled if viewing own admin profile
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(Number(id)),
    enabled: !!authUser && !!id && !isViewingOwnAdminProfile,
  });

  // Fetch user posts - disabled if viewing own admin profile
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => fetchPostsByUserId(Number(id)),
    enabled: !!authUser && !!id && !isViewingOwnAdminProfile,
  });

  if (!authUser) return null; // Wait for auth check
  
  const displayUser = isViewingOwnAdminProfile ? {
    id: authUser.id,
    name: authUser.name,
    username: authUser.username,
    email: authUser.email,
    // Admin doesn't have these details from the API
    phone: undefined, 
    website: undefined,
    address: undefined,
    company: { name: "System Administrator", catchPhrase: "", bs: "" }, // Mock company for admin
  } : userData;

  // Determine which geo data to use - saved location or from user data
  const hasCustomLocation = !!savedLocation;
  const hasGeoData = !isViewingOwnAdminProfile && (hasCustomLocation || (displayUser?.address?.geo?.lat && displayUser?.address?.geo?.lng));
  
  // Function to handle location updates from Map component
  const handleAddressUpdate = (address: string, lat: number, lng: number) => {
    if (isViewingOwnAdminProfile) return; // No location saving for admin's own profile

    const newLocation = { address, latitude: lat, longitude: lng };
    setSavedLocation(newLocation);
    
    if (id) {
      localStorage.setItem(`user_location_${id}`, JSON.stringify(newLocation));
      toast({
        title: "Location saved",
        description: `The location has been saved for this user profile.`,
      });
    }
  };

  const effectiveIsLoadingUser = isViewingOwnAdminProfile ? false : isLoadingUser;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {effectiveIsLoadingUser ? (
              <div className="flex justify-center p-12">
                <div className="loader"></div>
              </div>
            ) : !displayUser && !isViewingOwnAdminProfile ? (
              <div className="p-8 text-center text-destructive">
                <p>User not found.</p>
              </div>
            ) : displayUser ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="w-20 h-20 border-4 border-white mb-2">
                        <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-2xl font-semibold">
                          {displayUser.name.charAt(0)}
                        </div>
                      </Avatar>
                      <CardTitle className="mt-2 text-center">{displayUser.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">@{displayUser.username}</p>
                      
                      {isViewingOwnAdminProfile && (
                        <Badge variant="default" className="mt-2 bg-primary text-primary-foreground">
                          Administrator
                        </Badge>
                      )}
                      {!isViewingOwnAdminProfile && displayUser.company && (
                        <Badge variant="outline" className="mt-2">
                          {displayUser.company.name}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="py-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{displayUser.email}</span>
                      </div>
                      
                      {!isViewingOwnAdminProfile && displayUser.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{displayUser.phone}</span>
                        </div>
                      )}
                      
                      {!isViewingOwnAdminProfile && displayUser.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`https://${displayUser.website}`} 
                            className="text-primary hover:underline"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {displayUser.website}
                          </a>
                        </div>
                      )}
                      
                      {!isViewingOwnAdminProfile && (displayUser.phone || displayUser.website || displayUser.company) && <Separator />}
                      
                      {!isViewingOwnAdminProfile && displayUser.company && (
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> 
                            Company Details
                          </h3>
                          <p className="text-sm">{displayUser.company.name}</p>
                          <p className="text-sm italic text-muted-foreground">
                            "{displayUser.company.catchPhrase}"
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {displayUser.company.bs}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Address & Map - Hidden for admin's own profile */}
                {!isViewingOwnAdminProfile && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" /> Address Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {displayUser.address && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">Location</h3>
                              {savedLocation ? (
                                <>
                                  <p className="text-primary font-medium">Custom saved location:</p>
                                  <p>{savedLocation.address}</p>
                                </>
                              ) : (
                                <>
                                  <p>{displayUser.address.street}</p>
                                  <p>{displayUser.address.suite}</p>
                                  <p>{displayUser.address.city}, {displayUser.address.zipcode}</p>
                                </>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-2">Coordinates</h3>
                              {savedLocation ? (
                                <>
                                  <p>Latitude: {savedLocation.latitude}</p>
                                  <p>Longitude: {savedLocation.longitude}</p>
                                </>
                              ) : (
                                <>
                                  <p>Latitude: {displayUser.address.geo?.lat}</p>
                                  <p>Longitude: {displayUser.address.geo?.lng}</p>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="font-semibold mb-2">Map View</h3>
                            {hasGeoData ? (
                              <Map 
                                latitude={savedLocation ? savedLocation.latitude : parseFloat(displayUser.address.geo.lat)} 
                                longitude={savedLocation ? savedLocation.longitude : parseFloat(displayUser.address.geo.lng)}
                                zoom={5}
                                markerTitle={displayUser.name}
                                height="300px"
                                onAddressUpdate={handleAddressUpdate}
                              />
                            ) : (
                              <div className="p-8 text-center bg-gray-100 rounded-lg">
                                <p>No map coordinates available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* User Posts - Hidden for admin's own profile */}
                {!isViewingOwnAdminProfile && (
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" /> Posts by {displayUser?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingPosts ? (
                        <div className="flex justify-center p-8">
                          <div className="loader"></div>
                        </div>
                      ) : !userPosts || userPosts.length === 0 ? (
                        <div className="p-8 text-center bg-gray-100 rounded-lg">
                          <p>No posts available</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userPosts.map((post: any) => (
                            <PostCard key={post.id} post={post} userName={displayUser.name} />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null /* Render nothing if displayUser is null and it's admin's own profile (should not happen with current logic) */ }
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

