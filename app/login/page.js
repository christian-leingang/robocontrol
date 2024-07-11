'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className='w-96 overflow-hidden'>
      <div className='w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800'>
        <form onSubmit={handleSubmit} className=''>
          <div>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' value={password} onChange={handlePasswordChange} />
            {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          </div>
          <Button type='submit' className='mt-4 w-full font-bold'>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
