import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// UI Components
import { Button } from '../components/ui/button.jsx';
import { CourseCard } from '../components/CourseCard.jsx';

// Hooks
import { useCourses } from '../hooks/useCourses.js';

// SEO
import { updateMetaTags } from '../lib/seo.js';

// Icons
import { BookOpen, Award, Users, ArrowRight } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();

  useEffect(() => {
    updateMetaTags({
      title: 'Início',
      description:
        'Aprenda com os melhores cursos online. Plataforma de ensino premium com instrutores qualificados.',
      keywords:
        'cursos online, educação, aprendizado, ensino à distância',
    });
  }, []);

  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1695173583133-c19731e2df44?w=1920"
            alt="Learning background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Aprenda com os Melhores
            <br />
            Cursos Online
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Transforme sua carreira com educação de qualidade, instrutores experientes e conteúdo atualizado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/cursos')}
              className="text-lg px-8 py-6"
            >
              Explorar Cursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8 rounded-xl bg-background hover:shadow-2xl transition-shadow duration-300"
            >
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Conteúdo Rico</h3>
              <p className="text-muted-foreground">
                Cursos completos com vídeos, materiais de apoio e exercícios práticos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-8 rounded-xl bg-background hover:shadow-2xl transition-shadow duration-300"
            >
              <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Certificado</h3>
              <p className="text-muted-foreground">
                Receba certificado de conclusão reconhecido no mercado.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-8 rounded-xl bg-background hover:shadow-2xl transition-shadow duration-300"
            >
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Instrutores Experientes</h3>
              <p className="text-muted-foreground">
                Aprenda com profissionais renomados e especialistas da área.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1624388611710-bdf95023d1c2?w=800"
                alt="Instructor"
                className="rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Aprenda com Especialistas da Indústria
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Nossos instrutores são profissionais com vasta experiência prática e paixão por ensinar.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Com metodologia focada em resultados e aprendizado prático, você estará preparado para os desafios reais.
              </p>
              <Button size="lg" onClick={() => navigate('/cursos')}>
                Conhecer os Cursos
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {!loading && featuredCourses.length > 0 && (
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Cursos em Destaque</h2>
              <p className="text-lg text-muted-foreground">
                Confira alguns dos nossos cursos mais populares
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" onClick={() => navigate('/cursos')}>
                Ver Todos os Cursos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}