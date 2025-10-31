# Migration Guide - From Hardcoded to Dynamic Data

## Overview
This guide explains how to replace the hardcoded module data with a dynamic backend/CMS system.

## Current Hardcoded Files

### 1. `/src/pages/Modules.tsx`
**Line 27-118**: `modulesData` array
- Contains 8 sample modules
- Each module has: id, title, description, category, type, duration, lessons, completed, students, rating, thumbnail, locked, tags

### 2. `/src/pages/ModuleView.tsx`
**Line 26-116**: `moduleData` object
- Contains module details and 8 lessons
- Each lesson has: id, title, type, duration, completed, videoUrl/pdfUrl

## Data Structure Requirements

### Module Object
```typescript
interface Module {
  id: number | string;
  title: string;
  description: string;
  category: "Beginner" | "Intermediate" | "Advanced";
  type: "video" | "pdf" | "interactive";
  duration: string; // e.g., "2h 30m"
  lessons: number;
  completed: number; // Number of completed lessons
  students: number;
  rating: number;
  thumbnail?: string;
  locked: boolean;
  tags: string[];
}
```

### Lesson Object
```typescript
interface Lesson {
  id: number | string;
  title: string;
  type: "video" | "pdf" | "interactive";
  duration: string; // e.g., "12:30"
  completed: boolean;
  videoUrl?: string; // YouTube embed URL or video file path
  pdfUrl?: string; // PDF file path
}
```

### Module Detail Object
```typescript
interface ModuleDetail extends Module {
  overview: string; // Long description
  learningOutcomes: string[]; // Array of learning objectives
  instructor: {
    name: string;
    avatar?: string;
    title: string;
  };
  lessons: Lesson[];
}
```

## Migration Steps

### Option 1: Backend API

1. **Create API Endpoints:**
   ```
   GET /api/modules - List all modules
   GET /api/modules/:id - Get module details with lessons
   GET /api/modules/:id/progress - Get user progress
   POST /api/modules/:id/lessons/:lessonId/complete - Mark lesson complete
   ```

2. **Update Modules.tsx:**
   ```typescript
   import { useQuery } from '@tanstack/react-query';

   const Modules = () => {
     const { data: modules, isLoading } = useQuery({
       queryKey: ['modules'],
       queryFn: async () => {
         const res = await fetch('/api/modules');
         return res.json();
       }
     });

     // Rest of component...
   }
   ```

3. **Update ModuleView.tsx:**
   ```typescript
   const ModuleView = () => {
     const { id } = useParams();
     const { data: moduleData, isLoading } = useQuery({
       queryKey: ['module', id],
       queryFn: async () => {
         const res = await fetch(`/api/modules/${id}`);
         return res.json();
       }
     });

     // Rest of component...
   }
   ```

### Option 2: Headless CMS (Strapi, Sanity, Contentful)

1. **Create Content Types in CMS:**
   - Module (with all fields)
   - Lesson (with relationships to Module)
   - Instructor

2. **Install CMS SDK:**
   ```bash
   npm install @sanity/client
   # or
   npm install @strapi/strapi
   ```

3. **Create Client:**
   ```typescript
   // src/lib/cms.ts
   import { createClient } from '@sanity/client';

   export const client = createClient({
     projectId: 'your-project-id',
     dataset: 'production',
     apiVersion: '2024-01-01',
     useCdn: true,
   });
   ```

4. **Fetch Data:**
   ```typescript
   // src/lib/queries.ts
   export const getModules = async () => {
     return client.fetch(`*[_type == "module"]`);
   };

   export const getModule = async (id: string) => {
     return client.fetch(`*[_type == "module" && _id == $id][0]`, { id });
   };
   ```

### Option 3: Local JSON Files (Simple CMS)

1. **Create JSON files:**
   ```
   /public/data/modules.json
   /public/data/modules/1.json
   /public/data/modules/2.json
   ```

2. **Fetch in components:**
   ```typescript
   const { data: modules } = useQuery({
     queryKey: ['modules'],
     queryFn: async () => {
       const res = await fetch('/data/modules.json');
       return res.json();
     }
   });
   ```

## User Progress Tracking

### Frontend State Management
Use Zustand or Context for user progress:

```typescript
// src/store/progressStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: Record<string, string[]>; // moduleId -> lessonIds
  markComplete: (moduleId: string, lessonId: string) => void;
  isLessonComplete: (moduleId: string, lessonId: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      markComplete: (moduleId, lessonId) => {
        set((state) => ({
          completedLessons: {
            ...state.completedLessons,
            [moduleId]: [
              ...(state.completedLessons[moduleId] || []),
              lessonId,
            ],
          },
        }));
      },
      isLessonComplete: (moduleId, lessonId) => {
        return (get().completedLessons[moduleId] || []).includes(lessonId);
      },
    }),
    { name: 'module-progress' }
  )
);
```

### Backend Sync
If using backend, sync progress on lesson completion:

```typescript
const handleCompleteLesson = async (lessonId: string) => {
  await fetch(`/api/modules/${moduleId}/lessons/${lessonId}/complete`, {
    method: 'POST',
  });

  queryClient.invalidateQueries(['module', moduleId]);
};
```

## File Upload for Videos/PDFs

### Option 1: Cloud Storage (S3, Cloudinary, Uploadcare)
```typescript
// Upload video/PDF and get URL
const uploadedUrl = await uploadToS3(file);

// Store URL in database
const module = await createModule({
  ...data,
  videoUrl: uploadedUrl,
});
```

### Option 2: Self-hosted
```typescript
// Upload to /public/videos or /public/pdfs
// Reference as /videos/module-1-lesson-1.mp4
```

## Recommended Tech Stack

**Backend:**
- Node.js + Express/Fastify
- PostgreSQL/MongoDB
- File storage: S3 or Cloudinary

**CMS:**
- Strapi (open-source, easy to set up)
- Sanity.io (powerful, real-time)
- Payload CMS (fully typed, modern)

**Auth:**
- Clerk
- NextAuth.js
- Supabase Auth

## Search & Filtering

When implementing dynamic data, you can:
1. Use backend search (better for large datasets)
2. Use Algolia/MeiliSearch for advanced search
3. Client-side filtering (current implementation works fine for small datasets)

## Next Steps

1. Choose backend/CMS approach
2. Set up database schema
3. Create API endpoints or CMS content types
4. Replace hardcoded data with API calls
5. Add user authentication
6. Implement progress tracking
7. Add admin panel for content management

## Notes

- Current hardcoded data is a good reference for structure
- Keep the UI components as-is, just replace data source
- React Query is already set up for async data fetching
- Consider adding loading states and error handling
