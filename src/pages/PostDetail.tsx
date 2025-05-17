
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchPostById, fetchCommentsByPostId, fetchUserById } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MessageCircle } from "lucide-react";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch post details
  const { 
    data: post, 
    isLoading: isLoadingPost,
    error: postError 
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(Number(id)),
    enabled: !!user && !!id,
  });

  // Fetch post comments
  const { 
    data: comments, 
    isLoading: isLoadingComments,
    error: commentsError 
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchCommentsByPostId(Number(id)),
    enabled: !!user && !!id,
  });

  // Fetch post author
  const { 
    data: author, 
    isLoading: isLoadingAuthor 
  } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => fetchUserById(post?.userId || 0),
    enabled: !!post?.userId,
  });

  // Check if non-admin user is trying to access a post that isn't theirs
  useEffect(() => {
    if (post && !user?.isAdmin && post.userId !== user?.id) {
      navigate("/posts");
    }
  }, [post, user, navigate]);

  if (!user) return null; // Wait for auth check

  const isLoading = isLoadingPost || isLoadingComments;
  const hasError = postError || commentsError;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="loader"></div>
            </div>
          ) : hasError ? (
            <div className="p-8 text-center text-destructive">
              <p>Error loading post. The post may not exist or you may not have permission to view it.</p>
            </div>
          ) : !post ? (
            <div className="p-8 text-center text-destructive">
              <p>Post not found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="outline" className="mb-2">Post #{post.id}</Badge>
                      <CardTitle className="text-2xl">{post.title}</CardTitle>
                    </div>
                  </div>
                  
                  {isLoadingAuthor ? (
                    <div className="flex items-center gap-2">
                      <div className="loader"></div>
                      <span>Loading author...</span>
                    </div>
                  ) : author && (
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary font-medium text-xs">
                          {author.name.charAt(0)}
                        </div>
                      </Avatar>
                      <Link to={`/users/${author.id}`} className="text-sm text-primary hover:underline">
                        {author.name}
                      </Link>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line text-lg">{post.body}</p>
                </CardContent>
              </Card>
              
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments?.length || 0})
                </h2>
                
                {isLoadingComments ? (
                  <div className="flex justify-center p-8">
                    <div className="loader"></div>
                  </div>
                ) : !comments || comments.length === 0 ? (
                  <Card className="bg-gray-50 border border-dashed">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No comments yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <Card key={comment.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary font-medium text-xs">
                                  {comment.name.charAt(0)}
                                </div>
                              </Avatar>
                              <div>
                                <p className="font-medium">{comment.name}</p>
                                <a href={`mailto:${comment.email}`} className="text-xs text-primary hover:underline">
                                  {comment.email}
                                </a>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">Comment #{comment.id}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <p className="text-sm">{comment.body}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
