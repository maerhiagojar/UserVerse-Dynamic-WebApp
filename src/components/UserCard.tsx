
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserCardProps {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string;
    website?: string;
    company?: {
      name: string;
    };
  };
  showDetailLink?: boolean;
}

const UserCard = ({ user, showDetailLink = true }: UserCardProps) => {
  const { id, name, username, email, phone, website, company } = user;

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary font-medium">
                {name.charAt(0)}
              </div>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
          </div>
          {company && (
            <Badge variant="secondary" className="text-xs">
              {company.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-muted-foreground" /> 
            <span>{email}</span>
          </div>
          
          {phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-muted-foreground" /> 
              <span>{phone}</span>
            </div>
          )}
          
          {website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe size={14} className="text-muted-foreground" /> 
              <span>{website}</span>
            </div>
          )}
          
          {showDetailLink && (
            <div className="mt-4">
              <Link to={`/users/${id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
