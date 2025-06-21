import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLogout } from '@/services/authService';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

interface DashboardHeaderProps {
  userEmail?: string;
}

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const { logout } = useLogout();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const getInitials = (name: string | null, email: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo />
          <h1 className="text-xl font-medium text-foreground">InsightsLM</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-2 transition-all">
                  <AvatarImage 
                    src={profile?.avatar_url || undefined} 
                    alt="Profile picture" 
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name, userEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center space-x-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={profile?.avatar_url || undefined} 
                    alt="Profile picture" 
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name, userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;