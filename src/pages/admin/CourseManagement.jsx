import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// UI Components
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { useToast } from '../../components/ui/use-toast.js';

// Supabase Queries
import {
  getCourses,
  getCategories,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../../lib/supabase/queries.js';

// Utils
import { slugify, formatDate } from '../../lib/utils.js';

// Icons
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';

// Router
import { useNavigate } from 'react-router-dom';

export function CourseManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    instructor_name: '',
    instructor_bio: '',
    thumbnail_url: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, categoriesData] = await Promise.all([
        getCourses(),
        getCategories(),
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const courseData = {
        ...formData,
        slug: slugify(formData.title),
      };

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
        toast({ title: 'Curso atualizado com sucesso!' });
      } else {
        await createCourse(courseData);
        toast({ title: 'Curso criado com sucesso!' });
      }

      setShowForm(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category_id: '',
        instructor_name: '',
        instructor_bio: '',
        thumbnail_url: '',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Erro ao salvar curso',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category_id: course.category_id,
      instructor_name: course.instructor_name || '',
      instructor_bio: course.instructor_bio || '',
      thumbnail_url: course.thumbnail_url || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      await deleteCourse(id);
      toast({ title: 'Curso excluído com sucesso!' });
      fetchData();
    } catch (error) {
      toast({
        title: 'Erro ao excluir curso',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
          </div>

          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Curso
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingCourse ? 'Editar Curso' : 'Novo Curso'}</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                      rows={4}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({ ...formData, category_id: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do Instrutor</label>
                    <input
                      type="text"
                      value={formData.instructor_name}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor_name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio do Instrutor</label>
                    <textarea
                      value={formData.instructor_bio}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor_bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">URL da Thumbnail</label>
                    <input
                      type="url"
                      value={formData.thumbnail_url}
                      onChange={(e) =>
                        setFormData({ ...formData, thumbnail_url: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">Salvar</Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingCourse(null);
                        setFormData({
                          title: '',
                          description: '',
                          category_id: '',
                          instructor_name: '',
                          instructor_bio: '',
                          thumbnail_url: '',
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-muted-foreground mb-2">{course.description}</p>

                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Categoria: {course.categories?.name || 'N/A'}</span>
                      <span>Instrutor: {course.instructor_name || 'N/A'}</span>
                      <span>Criado em: {formatDate(course.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}