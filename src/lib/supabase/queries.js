import { supabase } from './client';

// --- CATEGORIES ---

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createCategory = async (category) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateCategory = async (id, updates) => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// --- COURSES ---

export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getCourseBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
};

export const createCourse = async (course) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([course])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateCourse = async (id, updates) => {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteCourse = async (id) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// --- MODULES ---

export const getModulesByCourse = async (courseId) => {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createModule = async (module) => {
  const { data, error } = await supabase
    .from('modules')
    .insert([module])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateModule = async (id, updates) => {
  const { data, error } = await supabase
    .from('modules')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteModule = async (id) => {
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// --- LESSONS ---

export const getLessonsByModule = async (moduleId) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createLesson = async (lesson) => {
  const { data, error } = await supabase
    .from('lessons')
    .insert([lesson])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateLesson = async (id, updates) => {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteLesson = async (id) => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// --- MATERIALS ---

export const getMaterialsByLesson = async (lessonId) => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createMaterial = async (material) => {
  const { data, error } = await supabase
    .from('materials')
    .insert([material])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateMaterial = async (id, updates) => {
  const { data, error } = await supabase
    .from('materials')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteMaterial = async (id) => {
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// --- HELPER: FULL COURSE STRUCTURE ---

export const getCourseStructure = async (courseId) => {
  // Fetch modules
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index');

  if (modulesError) throw modulesError;
  if (!modules || modules.length === 0) return [];

  // Fetch lessons for all modules
  const moduleIds = modules.map(m => m.id);
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .in('module_id', moduleIds)
    .order('order_index');

  if (lessonsError) throw lessonsError;

  // Fetch materials for all lessons
  const lessonIds = lessons.map(l => l.id);
  let materials = [];
  if (lessonIds.length > 0) {
    const { data: mats, error: matsError } = await supabase
      .from('materials')
      .select('*')
      .in('lesson_id', lessonIds);
    
    if (matsError) throw matsError;
    materials = mats;
  }

  // Assemble structure
  const structure = modules.map(module => {
    const moduleLessons = lessons
      .filter(l => l.module_id === module.id)
      .map(lesson => ({
        ...lesson,
        materials: materials.filter(m => m.lesson_id === lesson.id)
      }));
    
    return {
      ...module,
      lessons: moduleLessons
    };
  });

  return structure;
};