import { useState, useEffect } from 'react';
import { Campus, CampusSchema } from '@/models/Campus';

export function useCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampuses() {
      try {
        setLoading(true);
        const response = await fetch('/api/campuses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch campuses');
        }
        
        const data = await response.json();
        
        // Convert API response to Campus model
        const convertedCampuses = data.map((campus: any) => {
          return {
            ID: campus.id,
            Name: campus.name,
            ShortName: campus.shortName,
            Description: campus.description,
            IconURL: campus.iconURL,
            VideoURL: campus.videoURL,
            Domain: campus.domain
          };
        });
        
        // Validate with Zod schema
        const validatedCampuses = convertedCampuses.map((campus: Campus) => 
          CampusSchema.parse(campus)
        );
        
        setCampuses(validatedCampuses);
        setError(null);
      } catch (err) {
        console.error('Error fetching campuses:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchCampuses();
  }, []);

  return { campuses, loading, error };
}

export function useCampus(shortName: string) {
  const [campus, setCampus] = useState<Campus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampus() {
      try {
        setLoading(true);
        const response = await fetch(`/api/campuses/${shortName}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch campus');
        }
        
        const data = await response.json();
        
        // Convert API response to Campus model
        const convertedCampus: Campus = {
          ID: data.id,
          Name: data.name,
          ShortName: data.shortName,
          Description: data.description,
          IconURL: data.iconURL,
          VideoURL: data.videoURL,
          Domain: data.domain
        };
        
        // Validate with Zod schema
        const validatedCampus = CampusSchema.parse(convertedCampus);
        
        setCampus(validatedCampus);
        setError(null);
      } catch (err) {
        console.error('Error fetching campus:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (shortName) {
      fetchCampus();
    }
  }, [shortName]);

  return { campus, loading, error };
}
