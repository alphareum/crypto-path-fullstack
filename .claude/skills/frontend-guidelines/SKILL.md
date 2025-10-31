---
name: frontend-guidelines
description: Frontend development guidelines for React/Vite/TailwindCSS/shadcn applications. Modern patterns including component composition, data fetching, file organization, Tailwind styling, and TypeScript best practices. Use when creating components, pages, features, fetching data, styling, or working with frontend code.
---

# Frontend Development Guidelines

## Purpose

Comprehensive guide for modern React development with Vite, emphasizing component patterns, proper file organization, TailwindCSS styling, and performance optimization.

## When to Use This Skill

- Creating new components or pages
- Building new features
- Fetching data from Laravel API
- Styling components with TailwindCSS + shadcn/ui
- Performance optimization
- Organizing frontend code
- TypeScript best practices

---

## Quick Start

### New Component Checklist

Creating a component? Follow this checklist:

- [ ] Use TypeScript with proper prop types
- [ ] Use `function` or `const` pattern
- [ ] Lazy load if heavy component: `React.lazy(() => import())`
- [ ] Use TailwindCSS for styling (utility classes)
- [ ] Use shadcn/ui components when available
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Use `useMemo` for expensive computations
- [ ] Export as default at bottom
- [ ] Handle loading and error states gracefully
- [ ] Use React Query (TanStack Query) for data fetching

### New Feature Checklist

Creating a feature? Set up this structure:

- [ ] Create `src/features/{feature-name}/` directory
- [ ] Create subdirectories: `api/`, `components/`, `hooks/`, `types/`
- [ ] Create API service file: `api/{feature}Api.ts`
- [ ] Set up TypeScript types in `types/`
- [ ] Create related components in `components/`
- [ ] Use lazy loading for route components
- [ ] Export public API from feature `index.ts`

---

## Common Imports Cheatsheet

```typescript
// React & Hooks
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Lazy Loading
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// React Query (TanStack Query)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

// Form Handling
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Types
import type { User } from '@/types/user';

// API
import { apiClient } from '@/lib/api-client';
```

---

## Topic Guides

### 🎨 Component Patterns

**Modern React components use:**
- Function components with TypeScript
- `React.lazy()` for code splitting
- Proper prop typing with interfaces
- Composition over inheritance

**Key Concepts:**
- Lazy load heavy components (data tables, charts, editors)
- Always wrap lazy components in Suspense
- Component structure: Props → Hooks → Handlers → Render → Export
- Keep components focused (Single Responsibility)

**Common Pattern:**
```typescript
interface MyComponentProps {
  title: string;
  onSave?: (data: FormData) => void;
}

export default function MyComponent({ title, onSave }: MyComponentProps) {
  const [state, setState] = useState<string>('');

  const handleSave = useCallback(() => {
    if (onSave) onSave(data);
  }, [onSave, data]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 📊 Data Fetching

**PRIMARY PATTERN: React Query (TanStack Query)**
- Use `useQuery` for GET requests
- Use `useMutation` for POST/PUT/DELETE
- Cache management built-in
- Automatic background refetching
- Type-safe with generics

**API Service Layer:**
- Create `features/{feature}/api/{feature}Api.ts`
- Use centralized `apiClient` (axios or fetch wrapper)
- Handle Laravel API responses
- Centralized error handling

**Example:**
```typescript
// features/posts/api/postsApi.ts
import { apiClient } from '@/lib/api-client';
import type { Post } from '../types';

export const postsApi = {
  getPosts: async (): Promise<Post[]> => {
    const { data } = await apiClient.get('/api/posts');
    return data;
  },

  getPost: async (id: number): Promise<Post> => {
    const { data } = await apiClient.get(`/api/posts/${id}`);
    return data;
  },

  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const { data } = await apiClient.post('/api/posts', post);
    return data;
  },
};

// In component:
const { data: posts, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: postsApi.getPosts,
});

const createMutation = useMutation({
  mutationFn: postsApi.createPost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({ title: 'Post created successfully' });
  },
});
```

---

### 📁 File Organization

**features/ vs components/:**
- `src/features/`: Domain-specific (posts, auth, trading)
- `src/components/`: Truly reusable (ui components, layouts)

**Feature Structure:**
```
src/
  features/
    trading/
      api/
        tradingApi.ts       # API service layer
      components/
        TradingDashboard.tsx
        TradeForm.tsx
      hooks/
        useTradingData.ts   # Custom hooks
      types/
        index.ts            # TypeScript types
      index.ts              # Public exports

  components/
    ui/                     # shadcn/ui components
      button.tsx
      card.tsx
    layout/
      Header.tsx
      Footer.tsx

  lib/
    api-client.ts           # Axios/fetch setup
    utils.ts                # Helper functions
```

---

### 🎨 Styling with TailwindCSS

**Primary Method:**
- Use Tailwind utility classes
- Use shadcn/ui components for complex UI
- Use `cn()` utility for conditional classes
- Avoid inline styles unless dynamic

**Patterns:**
```typescript
import { cn } from '@/lib/utils';

// Basic styling
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// Conditional classes
<Button className={cn(
  "w-full",
  isLoading && "opacity-50 cursor-not-allowed"
)}>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Custom component variants (shadcn pattern)
<Button variant="outline" size="lg">Click Me</Button>
```

**shadcn/ui Components:**
- Prefer shadcn components over custom implementations
- Customize via `tailwind.config.js` and CSS variables
- Copy components to `src/components/ui/` for modifications

---

### ⏳ Loading & Error States

**Best Practices:**
- Use React Query's built-in `isLoading`, `error` states
- Provide meaningful loading skeletons
- Show user-friendly error messages
- Use toast notifications for feedback

**Example:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['user', id],
  queryFn: () => userApi.getUser(id),
});

if (isLoading) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

if (error) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <p className="text-red-800">Error loading user: {error.message}</p>
    </div>
  );
}

return <div>{/* Render data */}</div>;
```

---

### ⚡ Performance

**Optimization Patterns:**
- `useMemo`: Expensive computations (filter, sort, map)
- `useCallback`: Event handlers passed to children
- `React.memo`: Expensive components
- Lazy loading: Routes and heavy components
- Debounced inputs: Search and filters (300-500ms)

**Example:**
```typescript
// Memoize expensive computation
const filteredData = useMemo(() => {
  return data.filter(item => item.active).sort((a, b) => a.name.localeCompare(b.name));
}, [data]);

// Memoize callback passed to child
const handleClick = useCallback((id: number) => {
  onItemClick(id);
}, [onItemClick]);

// Memoize expensive component
const ExpensiveList = React.memo(({ items }) => {
  return <div>{items.map(item => <Item key={item.id} {...item} />)}</div>;
});
```

---

### 📘 TypeScript

**Standards:**
- Strict mode enabled
- No `any` type (use `unknown` if needed)
- Explicit return types on functions
- Proper prop interfaces
- Type API responses

**Example:**
```typescript
// API response types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Component props
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

// Function with explicit return
function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// Generic function
function mapResponse<T, R>(data: T[], mapper: (item: T) => R): R[] {
  return data.map(mapper);
}
```

---

### 🔧 Forms with React Hook Form + Zod

**Pattern:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    await authApi.login(data);
    toast({ title: 'Login successful' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

---

## Core Principles

1. **Lazy Load Heavy Components**: Routes, tables, charts, editors
2. **React Query for Data**: Primary data fetching pattern
3. **Features are Organized**: api/, components/, hooks/, types/ subdirs
4. **TailwindCSS for Styling**: Utility-first approach
5. **shadcn/ui for UI**: Reusable, accessible components
6. **TypeScript Strict Mode**: Type safety everywhere
7. **Handle States Gracefully**: Loading, error, empty states
8. **Performance Matters**: useMemo, useCallback, React.memo when needed

---

## Quick Reference: Modern Component Template

```typescript
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { featureApi } from '../api/featureApi';
import type { Feature } from '../types';

interface FeatureComponentProps {
  id: number;
  onUpdate?: () => void;
}

export default function FeatureComponent({ id, onUpdate }: FeatureComponentProps) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['feature', id],
    queryFn: () => featureApi.getFeature(id),
  });

  // Mutation
  const updateMutation = useMutation({
    mutationFn: featureApi.updateFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature', id] });
      toast({ title: 'Updated successfully' });
      onUpdate?.();
    },
  });

  // Event handler
  const handleUpdate = useCallback((newData: Partial<Feature>) => {
    updateMutation.mutate({ id, ...newData });
  }, [id, updateMutation]);

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Content */}
          <Button onClick={() => handleUpdate({ status: 'active' })}>
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Related Skills

- **backend-laravel-guidelines**: Backend API patterns that frontend consumes
- **testing**: Testing patterns for frontend components

---

**Skill Status**: Adapted for React 18 + Vite + TailwindCSS + shadcn/ui stack
