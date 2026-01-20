import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ChevronRight } from 'lucide-react';
import { MaterialLink } from './MaterialLink.jsx';
import { getYouTubeEmbedUrl } from '../lib/utils.js';

export function LessonItem({ lesson }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/10 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <PlayCircle className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-left">{lesson.title}</span>
        </div>
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-90' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 bg-card/30 space-y-4">
              {lesson.description && (
                <p className="text-sm text-muted-foreground">{lesson.description}</p>
              )}

              {lesson.youtube_url && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(lesson.youtube_url)}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}

              {lesson.materials && lesson.materials.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Materiais:</h4>
                  <div className="space-y-2">
                    {lesson.materials.map((material) => (
                      <MaterialLink key={material.id} material={material} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}