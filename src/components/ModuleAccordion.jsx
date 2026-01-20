import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PlayCircle } from 'lucide-react';
import { LessonItem } from './LessonItem.jsx';

export function ModuleAccordion({ module }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-accent/10 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <PlayCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-left">{module.title}</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-card/50 space-y-2">
              {module.lessons && module.lessons.length > 0 ? (
                module.lessons.map((lesson) => (
                  <LessonItem key={lesson.id} lesson={lesson} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma aula disponível neste módulo.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}