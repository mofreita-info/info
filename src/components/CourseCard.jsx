import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { BookOpen } from 'lucide-react';

export function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {course.categories?.name || 'Curso'}
          </div>
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2">{course.title}</CardTitle>
          <CardDescription className="text-sm">{course.instructor_name}</CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">{course.description}</p>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => navigate(`/cursos/${course.slug}`)}
            className="w-full"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Ver Curso
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}