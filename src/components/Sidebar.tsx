
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, User, List, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "bg-sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h2 className="text-lg font-bold text-sidebar-foreground">UserVerse</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <List size={18} />
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-grow">
        <NavItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" />
        <NavItem to="/users" icon={<User size={18} />} label="Users" />
        <NavItem to="/posts" icon={<List size={18} />} label="Posts" />
        {user?.isAdmin && (
          <NavItem to="/statistics" icon={<Calendar size={18} />} label="Analytics" />
        )}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex flex-col gap-2">
            <div className="text-sm text-sidebar-foreground">
              Logged in as <span className="font-medium">{user?.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logout}
              className="w-full justify-start bg-white/10 text-white border-sidebar-border hover:bg-sidebar-primary hover:text-sidebar-primary-foreground font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            className="w-full bg-white/10 text-white hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          >
            <LogOut size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
