
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = ({ className }: { className?: string }) => {
  const { user } = useAuth();

  return (
    <header className={cn("bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-lg font-semibold text-primary">
          UserVerse
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-4">
        {user ? (
          <Link to={`/users/${user.id}`} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <User size={16} className="mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
              {user.isAdmin && (
                <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
          </Link>
        ) : (
          <>
            <Link to="/">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="default">Register</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
