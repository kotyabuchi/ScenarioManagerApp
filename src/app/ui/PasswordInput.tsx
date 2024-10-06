'use client';

import { Input, InputProps } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface PasswordInputProps extends InputProps {
  passwordRules?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  passwordRules,
  ...props
}) => {
  const [isPasswordVisible, setPasswordIsVisible] = useState(false);
  const togglePasswordVisibility = () =>
    setPasswordIsVisible(!isPasswordVisible);

  return (
    <Input
      {...props}
      ref={(input) => {
        if (input && passwordRules) {
          input.setAttribute('passwordrules', passwordRules);
        }
      }}
      type={isPasswordVisible ? 'text' : 'password'}
      endContent={
        <button
          className='rounded-full p-[2px] outline-primary-400'
          type='button'
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <EyeOff className='pointer-events-none text-2xl text-default-400' />
          ) : (
            <Eye className='pointer-events-none text-2xl text-default-400' />
          )}
        </button>
      }
    />
  );
};
