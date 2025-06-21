import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotebookUpdate } from '@/hooks/useNotebookUpdate';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/services/authService';
import { useProfile } from '@/hooks/useProfile';
import Logo from '@/components/ui/Logo';

interface NotebookHeaderProps {
  title: string;
  notebookId?: string;
}

const NotebookHeader = ({ title, notebookId }: NotebookHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { profile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const { updateNotebook, isUpdating } = useNotebookUpdate();

  const getInitials = (name: string | null, email: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  const handleTitleClick = () => {
    if (notebookId) {
      setIsEditing(true);
      setEditedTitle(title);
    }
  };

  const handleTitleSubmit = () => {
    if (notebookId && editedTitle.trim() && editedTitle !== title) {
      updateNotebook({
        id: notebookId,
        updates: { title: editedTitle.trim() }
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleTitleSubmit();
  };

  const handleIconClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleIconClick}
              className="hover:bg-accent rounded transition-colors p-1"
            >
              <Logo />
            </button>
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="text-lg font-medium text-foreground border-none shadow-none p-0 h-auto focus-visible:ring-0 min-w-[300px] w-auto"
                autoFocus
                disabled={isUpdating}
              />
            ) : (
              <span 
                className="text-lg font-medium text-foreground cursor-pointer hover:bg-accent rounded px-2 py-1 transition-colors"
                onClick={handleTitleClick}
              >
                {title}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0">
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-2 transition-all">
                    <AvatarImage 
                      src={profile?.avatar_url || undefined} 
                      alt="Profile picture" 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(profile?.full_name, profile?.email)}
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
                      {getInitials(profile?.full_name, profile?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.email}
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
      </div>
    </header>
  );
};

export default NotebookHeader;