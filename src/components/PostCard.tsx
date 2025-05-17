
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    body: string;
    userId: number;
  };
  userName?: string;
  commentsCount?: number;
}

const PostCard = ({ post, userName, commentsCount }: PostCardProps) => {
  const { id, title, body, userId } = post;
  
  // Truncate the body if it's too long
  const truncatedBody = body.length > 120 ? `${body.substring(0, 120)}...` : body;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <Badge variant="outline" className="ml-2 whitespace-nowrap">
            Post #{id}
          </Badge>
        </div>
        
        {userName && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User size={12} />
            <span>{userName}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm">{truncatedBody}</p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-2 border-t">
        {commentsCount !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageCircle size={14} />
            <span>{commentsCount} comments</span>
          </div>
        )}
        
        <Link to={`/posts/${id}`}>
          <Button variant="outline" size="sm">Read More</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
