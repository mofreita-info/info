import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import { useAuth } from '../../hooks/useAuth.js';

// UI Components
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { useToast } from '../../components/ui/use-toast.js';

// Supabase Queries
import { getCourses, getCategories } from '../../lib/supabase/queries.js';

// Icons
import { LogOut, BookOpen, Folder, LayoutDashboard, GraduationCap } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    courses: 0,
    categories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [courses, categories] = await Promise.all([
          getCourses(),
          getCategories(),
        ]);

        setStats({
          courses: courses.length,
          categories: categories.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logout realizado com sucesso',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
          </div>

          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/admin')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/admin/cursos')}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Cursos
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/admin/modulos')}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Módulos
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/admin/categorias')}
            >
              <Folder className="mr-2 h-4 w-4" />
              Categorias
            </Button>
          </nav>

          <div className="mt-auto pt-8">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Cursos
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.courses}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categorias
                  </CardTitle>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.categories}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Módulos
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => navigate('/admin/cursos')} className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Gerenciar Cursos
                </Button>

                <Button onClick={() => navigate('/admin/categorias')} className="w-full justify-start">
                  <Folder className="mr-2 h-4 w-4" />
                  Gerenciar Categorias
                </Button>

                <Button onClick={() => navigate('/admin/modulos')} className="w-full justify-start">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Gerenciar Módulos
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}