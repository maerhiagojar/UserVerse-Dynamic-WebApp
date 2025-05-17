
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchAllPosts, fetchPostsByUserId, fetchUserById, fetchUsers } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MessageSquare, FileText } from "lucide-react";
import UserCard from "@/components/UserCard";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch data based on user role
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", user?.id, user?.isAdmin],
    queryFn: () => user?.isAdmin ? fetchAllPosts() : fetchPostsByUserId(user?.id || 0),
    enabled: !!user,
  });

  // Fetch users
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  // State for filtered content
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  // Process data when it arrives
  useEffect(() => {
    if (postsData) {
      setRecentPosts(postsData.slice(0, 3));
    }
    if (usersData) {
      setRecentUsers(usersData.slice(0, 3));
    }
  }, [postsData, usersData]);

  if (!user) return null; // Wait for auth check

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
          </header>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingUsers ? <div className="loader"></div> : usersData?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Registered users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingPosts ? (
                    <div className="loader"></div>
                  ) : user.isAdmin ? (
                    `${postsData?.length || 0} (all users)`
                  ) : (
                    postsData?.length || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Published posts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Type</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.isAdmin ? "Administrator" : "Standard User"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.isAdmin 
                    ? "Full access to all features" 
                    : "Access to your own content"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Posts</h2>
                <Link to="/posts">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              
              {isLoadingPosts ? (
                <div className="flex justify-center p-8"><div className="loader"></div></div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      userName={usersData?.find((u: any) => u.id === post.userId)?.name}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-50 border border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <MessageSquare className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-muted-foreground text-center">No posts available</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Users</h2>
                <Link to="/users">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              
              {isLoadingUsers ? (
                <div className="flex justify-center p-8"><div className="loader"></div></div>
              ) : recentUsers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {recentUsers.map((userData) => (
                    <UserCard key={userData.id} user={userData} />
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-50 border border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <User className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-muted-foreground text-center">No users available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
