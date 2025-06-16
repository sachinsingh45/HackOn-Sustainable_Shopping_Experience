// components/layout/MainLayout.tsx
import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import GreenPartnerChat from '../chat/GreenPartnerChat';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Header />
      <Navigation />
      <main className="min-h-screen">
        <Outlet /> {/* renders child route components */}
      </main>
      <Footer />
      <GreenPartnerChat />
    </>
  );
};

export default MainLayout;
