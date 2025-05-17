import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Map from "@/components/Map";
import { Mail, User, Phone, MapPin, Lock } from "lucide-react";

// Schema for form validation using Zod
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

const Register = () => {
  const { toast } = useToast();
  const [coordinates, setCoordinates] = useState({ lat: 40.7128, lng: -74.006 });
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  function onSubmit(data: FormValues) {
    // Create a mock user ID for demo purposes
    const mockUserId = Date.now().toString();
    
    // Save location data if available
    if (locationData) {
      localStorage.setItem(`user_location_${mockUserId}`, JSON.stringify(locationData));
    }
    
    toast({
      title: "Registration submitted",
      description: "Your registration has been received. This is a demo, so no actual account has been created.",
    });
    
    console.log("Registration data:", data, "With coordinates:", coordinates, "Location data:", locationData);
  }
  
  const handleMapClick = (lng: number, lat: number) => {
    setCoordinates({ lat, lng });
  };
  
  const handleAddressUpdate = (address: string, lat: number, lng: number) => {
    // Update form value
    form.setValue("address", address);
    
    // Save location data
    setLocationData({
      address,
      latitude: lat,
      longitude: lng
    });
    
    // Update coordinates for the map
    setCoordinates({ lat, lng });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Join UserVerse to manage your profile and posts</p>
        </div>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              Fill out the form below to create your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="John" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Doe" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="john.doe@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Click on the map or search for a location" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="mt-2">
                        <Map 
                          latitude={coordinates.lat} 
                          longitude={coordinates.lng}
                          zoom={12}
                          onMapClick={handleMapClick}
                          onAddressUpdate={handleAddressUpdate}
                        />
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" asChild>
                    <Link to="/">Cancel</Link>
                  </Button>
                  <Button type="submit">Register</Button>
                </div>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="border-t flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?
            </p>
            <Link to="/" className="text-primary hover:underline text-sm">
              Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
