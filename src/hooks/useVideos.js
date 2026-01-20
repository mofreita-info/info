import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'

export function useVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setVideos(data)
      setLoading(false)
    }

    fetchVideos()
  }, [])

  return { videos, loading }
}