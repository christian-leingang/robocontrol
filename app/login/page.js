'use client';

import { Label } from '@/components/ui/label';
import Header from '../_components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function Login() {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === 'amr_top_Secret_P@ssword_1234_') {
      document.cookie = 'isAuthenticated=for_amr_secret; path=/; max-age=360000';
      localStorage.setItem('isAuthenticated', 'for_amr_secret');
      window.location.href = '/';
    } else {
      setErrorMessage('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-grow items-center justify-center overflow-hidden bg-gray-100 dark:bg-slate-950'>
        <div className='w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-slate-700'>
          <form onSubmit={handleSubmit} className=''>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={handlePasswordChange}
              />
              {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
            </div>
            <Button type='submit' className='mt-4 w-full font-bold'>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
