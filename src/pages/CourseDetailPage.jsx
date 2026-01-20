import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Supabase
import { getCourseBySlug } from '../lib/supabase/queries.js';

// Hooks
import { useModules } from '../hooks/useModules.js';

// Components
import { ModuleAccordion } from '../components/ModuleAccordion.jsx';
import { Button } from '../components/ui/button.jsx';

// Utils
import { updateMetaTags } from '../lib/seo.js';
import { getYouTubeEmbedUrl } from '../lib/utils.js';

// Icons
import { ChevronRight, User } from 'lucide-react';

export function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const { modules, loading: modulesLoading } = useModules(course?.id);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseBySlug(slug);
        setCourse(data);

        updateMetaTags({
          title: data.title,
          description: data.description,
          keywords: `curso, ${data.title}, ${data.categories?.name || ''}`,
        });
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Curso não encontrado</h2>
          <Button onClick={() => navigate('/cursos')}>Voltar aos Cursos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">
            Início
          </button>
          <ChevronRight className="h-4 w-4" />
          <button onClick={() => navigate('/cursos')} className="hover:text-foreground transition-colors">
            Cursos
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{course.title}</span>
        </div>

        {/* Course Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="mb-4">
            <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              {course.categories?.name || 'Curso'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{course.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{course.description}</p>

          {course.instructor_name && (
            <div className="flex items-center gap-3 p-6 bg-card rounded-xl border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Instrutor</p>
                <p className="font-semibold">{course.instructor_name}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Course Thumbnail */}
        {course.thumbnail_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}

        {/* Instructor Bio */}
        {course.instructor_bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 p-6 bg-card rounded-xl border border-border"
          >
            <h2 className="text-2xl font-bold mb-4">Sobre o Instrutor</h2>
            <p className="text-muted-foreground">{course.instructor_bio}</p>
          </motion.div>
        )}

        {/* Course Modules */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-3xl font-bold mb-6">Conteúdo do Curso</h2>

          {modulesLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : modules && modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module) => (
                <ModuleAccordion key={module.id} module={module} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl">
              <p className="text-muted-foreground">
                O conteúdo do curso será disponibilizado em breve.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}