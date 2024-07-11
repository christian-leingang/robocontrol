'use client';

import { useEffect, useState } from 'react';
import Login from './login/page';
import Dashboard from './dashboard/page';

// function Home() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const isAuth = localStorage.getItem('isAuthenticated');
//     setIsAuthenticated(isAuth === 'for_amr_secret');
//   }, []);

//   return (
//     <> {!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Dashboard />}</>
//   );
// }

export default function Home() {
  return <Dashboard />;
}
