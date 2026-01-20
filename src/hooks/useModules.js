import { useState, useEffect } from 'react';
import { getCourseStructure } from '../lib/supabase/queries.js';

export function useModules(courseId) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCourseStructure(courseId);
      setModules(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  return { modules, loading, error, refetch: fetchModules };
}