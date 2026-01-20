import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// Context & Hooks
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './hooks/useAuth.js';

// Components
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Toaster } from './components/ui/toaster.jsx';
import { Button } from './components/ui/button.jsx';

// Pages
import { HomePage } from './pages/HomePage.jsx';
import { CoursesPage } from './pages/CoursesPage.jsx';
import { CourseDetailPage } from './pages/CourseDetailPage.jsx';
import { LoginPage } from './pages/admin/LoginPage.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { CourseManagement } from './pages/admin/CourseManagement.jsx';
import { CategoryManagement } from './pages/admin/CategoryManagement.jsx';
import { ModuleManagement } from './pages/admin/ModuleManagement.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

import { BookOpen, User } from 'lucide-react';

function Navigation() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm fixed top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Academia Online
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/cursos">
              <Button variant="ghost">
                <BookOpen className="h-4 w-4 mr-2" />
                Cursos
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/admin">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <footer className="bg-card py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Academia Online</h3>
            <p className="text-muted-foreground text-sm">
              Plataforma de ensino online com cursos de alta qualidade
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Links Rápidos</h3>
            <div className="space-y-2 text-sm">
              <div>
                <Link to="/cursos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cursos
                </Link>
              </div>
              <div>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Início
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Contato</h3>
            <p className="text-muted-foreground text-sm">
              Entre em contato para mais informações
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 Academia Online. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cursos" element={<CoursesPage />} />
          <Route path="/cursos/:slug" element={<CourseDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cursos"
            element={
              <ProtectedRoute>
                <CourseManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categorias"
            element={
              <ProtectedRoute>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/modulos"
            element={
              <ProtectedRoute>
                <ModuleManagement />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}