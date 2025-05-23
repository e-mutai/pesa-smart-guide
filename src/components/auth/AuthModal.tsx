
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialView = 'signin'
}) => {
  const [view, setView] = useState<'signin' | 'signup'>(initialView);

  const switchToSignIn = () => setView('signin');
  const switchToSignUp = () => setView('signup');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0">
        {/* We've removed the hideClose prop and will let the X button be handled by the child components */}
        {view === 'signin' ? (
          <SignInForm 
            onClose={onClose} 
            switchToSignUp={switchToSignUp} 
          />
        ) : (
          <SignUpForm 
            onClose={onClose} 
            switchToSignIn={switchToSignIn} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
