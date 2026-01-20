import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// UI Components
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { useToast } from '../../components/ui/use-toast.js';

// Supabase Queries
import {
  getCourses,
  getModulesByCourse,
  getLessonsByModule,
  getMaterialsByLesson,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '../../lib/supabase/queries.js';

// Icons
import { Plus, Pencil, Trash2, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';

// Router
import { useNavigate } from 'react-router-dom';

export function ModuleManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);

  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    order: 1,
  });

  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    order: 1,
    youtube_url: '',
    description: '',
  });

  const [materialFormData, setMaterialFormData] = useState({
    title: '',
    dropbox_url: '',
    type: 'PDF',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules();
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar cursos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const data = await getModulesByCourse(selectedCourseId);

      const modulesWithLessons = await Promise.all(
        data.map(async (module) => {
          const lessons = await getLessonsByModule(module.id);

          const lessonsWithMaterials = await Promise.all(
            lessons.map(async (lesson) => {
              const materials = await getMaterialsByLesson(lesson.id);
              return { ...lesson, materials };
            })
          );

          return { ...module, lessons: lessonsWithMaterials };
        })
      );

      setModules(modulesWithLessons);
    } catch (error) {
      toast({
        title: 'Erro ao carregar módulos',
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Gerenciar Módulos e Aulas</h1>
          </div>
        </div>

        {/* Course Selector */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <label className="block text-sm font-medium mb-2">Selecione um Curso</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="">Selecione um curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Module + Lesson + Material Management */}
        {selectedCourseId && (
          <>
            {/* Add Module */}
            <div className="mb-4">
              <Button onClick={() => setShowModuleForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Módulo
              </Button>
            </div>

            {/* Module Form */}
            {showModuleForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{editingModule ? 'Editar Módulo' : 'Novo Módulo'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleModuleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Título</label>
                        <input
                          type="text"
                          value={moduleFormData.title}
                          onChange={(e) =>
                            setModuleFormData({ ...moduleFormData, title: e.target.value })
                          }
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Ordem</label>
                        <input
                          type="number"
                          value={moduleFormData.order}
                          onChange={(e) =>
                            setModuleFormData({ ...moduleFormData, order: parseInt(e.target.value) })
                          }
                          required
                          min="1"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit">Salvar</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowModuleForm(false);
                            setEditingModule(null);
                            setModuleFormData({ title: '', order: 1 });
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
                        {/* Lesson Form */}
            {showLessonForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{editingLesson ? 'Editar Aula' : 'Nova Aula'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLessonSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Título</label>
                        <input
                          type="text"
                          value={lessonFormData.title}
                          onChange={(e) =>
                            setLessonFormData({ ...lessonFormData, title: e.target.value })
                          }
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">URL do YouTube</label>
                        <input
                          type="url"
                          value={lessonFormData.youtube_url}
                          onChange={(e) =>
                            setLessonFormData({ ...lessonFormData, youtube_url: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Descrição</label>
                        <textarea
                          value={lessonFormData.description}
                          onChange={(e) =>
                            setLessonFormData({ ...lessonFormData, description: e.target.value })
                          }
                          rows={3}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Ordem</label>
                        <input
                          type="number"
                          value={lessonFormData.order}
                          onChange={(e) =>
                            setLessonFormData({ ...lessonFormData, order: parseInt(e.target.value) })
                          }
                          required
                          min="1"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit">Salvar</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowLessonForm(false);
                            setEditingLesson(null);
                            setLessonFormData({
                              title: '',
                              order: 1,
                              youtube_url: '',
                              description: '',
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

            {/* Material Form */}
            {showMaterialForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{editingMaterial ? 'Editar Material' : 'Novo Material'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMaterialSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Título</label>
                        <input
                          type="text"
                          value={materialFormData.title}
                          onChange={(e) =>
                            setMaterialFormData({ ...materialFormData, title: e.target.value })
                          }
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">URL do Dropbox</label>
                        <input
                          type="url"
                          value={materialFormData.dropbox_url}
                          onChange={(e) =>
                            setMaterialFormData({ ...materialFormData, dropbox_url: e.target.value })
                          }
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo</label>
                        <select
                          value={materialFormData.type}
                          onChange={(e) =>
                            setMaterialFormData({ ...materialFormData, type: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        >
                          <option value="PDF">PDF</option>
                          <option value="Vídeo">Vídeo</option>
                          <option value="Documento">Documento</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit">Salvar</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowMaterialForm(false);
                            setEditingMaterial(null);
                            setMaterialFormData({ title: '', dropbox_url: '', type: 'PDF' });
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
                        {/* Modules + Lessons + Materials */}
            <div className="space-y-4">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="hover:bg-accent/10 p-1 rounded"
                        >
                          {expandedModules.has(module.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>

                        <div>
                          <h3 className="text-lg font-semibold">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">Ordem: {module.order}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingModule(module);
                            setModuleFormData({
                              title: module.title,
                              order: module.order,
                            });
                            setShowModuleForm(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (confirm('Tem certeza que deseja excluir este módulo?')) {
                              try {
                                await deleteModule(module.id);
                                toast({ title: 'Módulo excluído com sucesso!' });
                                fetchModules();
                              } catch (error) {
                                toast({
                                  title: 'Erro ao excluir módulo',
                                  description: error.message,
                                  variant: 'destructive',
                                });
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedModules.has(module.id) && (
                      <div className="ml-8 mt-4 space-y-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedModuleId(module.id);
                            setShowLessonForm(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar Aula
                        </Button>

                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson) => (
                            <Card key={lesson.id} className="bg-card/50">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{lesson.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Ordem: {lesson.order}
                                    </p>

                                    {/* Materials */}
                                    {lesson.materials && lesson.materials.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        <p className="text-xs font-medium">Materiais:</p>

                                        {lesson.materials.map((material) => (
                                          <div
                                            key={material.id}
                                            className="flex items-center justify-between text-xs bg-background/50 p-2 rounded"
                                          >
                                            <span>
                                              {material.title} ({material.type})
                                            </span>

                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={async () => {
                                                if (confirm('Excluir este material?')) {
                                                  try {
                                                    await deleteMaterial(material.id);
                                                    toast({ title: 'Material excluído!' });
                                                    fetchModules();
                                                  } catch (error) {
                                                    toast({
                                                      title: 'Erro ao excluir material',
                                                      variant: 'destructive',
                                                    });
                                                  }
                                                }
                                              }}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Add Material */}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="mt-2"
                                      onClick={() => {
                                        setSelectedLessonId(lesson.id);
                                        setShowMaterialForm(true);
                                      }}
                                    >
                                      <Plus className="mr-1 h-3 w-3" />
                                      Material
                                    </Button>
                                  </div>

                                  {/* Edit/Delete Lesson */}
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingLesson(lesson);
                                        setSelectedModuleId(module.id);
                                        setLessonFormData({
                                          title: lesson.title,
                                          order: lesson.order,
                                          youtube_url: lesson.youtube_url || '',
                                          description: lesson.description || '',
                                        });
                                        setShowLessonForm(true);
                                      }}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>

                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={async () => {
                                        if (confirm('Excluir esta aula?')) {
                                          try {
                                            await deleteLesson(lesson.id);
                                            toast({ title: 'Aula excluída!' });
                                            fetchModules();
                                          } catch (error) {
                                            toast({
                                              title: 'Erro ao excluir aula',
                                              variant: 'destructive',
                                            });
                                          }
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Nenhuma aula neste módulo
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}