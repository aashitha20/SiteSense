# SiteSense Routing Guide

## Available Routes

### 1. **Home Page** - `/`
- **File**: `apps/web/src/app/page.tsx`
- **Description**: Landing page with hero section and feature overview
- **Navigation**: 
  - "Start Scanning" button → `/scanpage`
  - "View Dashboard" button → `/dashboard`

### 2. **Scan Page** - `/scanpage`
- **File**: `apps/web/src/app/scanpage/page.tsx`
- **Description**: Main scanning interface
- **Features**:
  - URL input with autocomplete suggestions
  - Scan type selector
  - Recently scanned URLs list
  - Inline scan results display
  - "View Details" button for each scan → `/scans/:id`

### 3. **Dashboard** - `/dashboard`
- **File**: `apps/web/src/app/dashboard/page.tsx`
- **Description**: Dashboard overview (currently empty - ready for implementation)
- **Usage**: Display aggregate statistics, charts, and scan history

### 4. **Individual Scan Report** - `/scans/:id`
- **File**: `apps/web/src/app/scans/[id]/page.tsx`
- **Description**: Detailed view of a specific scan report
- **Dynamic Route**: Uses Next.js dynamic routing with `[id]` parameter
- **Features**:
  - Full scan results display
  - Performance, SEO, UX, Security metrics
  - Back navigation
  - Action buttons to scan another site or view dashboard

## Navigation Component

**File**: `apps/web/src/components/navigation.tsx`

The navigation bar is automatically included in all pages through the root layout (`apps/web/src/app/layout.tsx`).

**Nav Items**:
- Home (`/`)
- Dashboard (`/dashboard`)
- Scan (`/scanpage`)

## How Navigation Works

### Using Next.js Link Component
```tsx
import Link from 'next/link';

<Link href="/dashboard">Go to Dashboard</Link>
```

### Using Next.js Router (Programmatic Navigation)
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/scanpage');
router.back(); // Go back to previous page
```

### Dynamic Routes
```tsx
// Navigate to specific scan report
router.push(`/scans/${scanId}`);

// In the dynamic route component
function Page({ params }: { params: { id: string } }) {
  const scanId = params.id;
  // Use scanId to fetch data
}
```

## Data Flow

1. **Scan Creation** (`/scanpage`):
   - User enters URL and starts scan
   - Scan results saved to localStorage
   - Results displayed inline on scan page

2. **Viewing Details** (`/scans/:id`):
   - User clicks "View Details" on a recent scan
   - Navigates to `/scans/:id` where id is the index in recentScans array
   - Page loads scan data from localStorage
   - Displays full report in dedicated page

3. **Persistence**:
   - All scans stored in localStorage under `'recentScans'` key
   - Data persists across page reloads and sessions
   - Each scan includes: URL, timestamp, scanType, status, and results

## Adding New Routes

### Example: Creating a Settings Page

1. **Create the directory and file**:
   ```
   apps/web/src/app/settings/page.tsx
   ```

2. **Create the page component**:
   ```tsx
   export default function SettingsPage() {
     return (
       <div>
         <h1>Settings</h1>
         {/* Your content */}
       </div>
     );
   }
   ```

3. **Add to navigation** (optional):
   Edit `apps/web/src/components/navigation.tsx`:
   ```tsx
   const navItems = [
     { href: '/', label: 'Home' },
     { href: '/dashboard', label: 'Dashboard' },
     { href: '/scanpage', label: 'Scan' },
     { href: '/settings', label: 'Settings' }, // Add this
   ];
   ```

4. **Link to it from other pages**:
   ```tsx
   <Link href="/settings">Settings</Link>
   ```

## Best Practices

1. **Use `Link` for navigation** when possible (better performance with prefetching)
2. **Use `router.push()`** for programmatic navigation (after form submissions, etc.)
3. **Use `router.back()`** for back button functionality
4. **Store shared state** in localStorage, Context API, or state management library
5. **Dynamic routes** are great for detail pages (e.g., `/scans/:id`, `/users/:userId`)

## File Structure

```
apps/web/src/app/
├── page.tsx              # Home page (/)
├── layout.tsx            # Root layout with navigation
├── globals.css           # Global styles
├── dashboard/
│   └── page.tsx          # Dashboard (/dashboard)
├── scanpage/
│   └── page.tsx          # Scan page (/scanpage)
└── scans/
    └── [id]/
        └── page.tsx      # Dynamic scan report (/scans/:id)
```

## Testing Navigation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Test navigation:
   - Click navigation links in header
   - Click "Start Scanning" or "View Dashboard" buttons
   - Perform a scan and click "View Details"
   - Use browser back/forward buttons

## Next Steps

- Implement actual API calls for scanning
- Build out the Dashboard page
- Add authentication/authorization routes
- Create user profile pages
- Add API routes in `app/api/` directory
