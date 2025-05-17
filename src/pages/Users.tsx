
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchUsers } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import UserCard from "@/components/UserCard";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";

const Users = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  // Filter users when search term or data changes
  useEffect(() => {
    if (users) {
      if (!searchTerm) {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter((user: any) => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    }
  }, [users, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!user) return null; // Wait for auth check

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>
            <p className="text-gray-600 mt-1">Browse and explore user profiles</p>
          </header>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search users by name, email, or username..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              <p>Error loading users. Please try again.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center bg-gray-100 rounded-lg">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((userData: any) => (
                <UserCard key={userData.id} user={userData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
