# @exhuma/router

Production-ready layout frameworks, responsive navigation bars, and route protection guards for React and Next.js. Part of the **Exhuma** developer suite.

---

## Installation

```bash
pnpm add @exhuma/router
# or
npm install @exhuma/router
```

---

## Features

- **`LandingLayout`**: Full-page marketing layout with sticky header, main content slot, and responsive footer.
- **`AuthLayout`**: Focused login/signup framing with support for single-card and split-screen hero layouts.
- **`DashboardLayout`**: Admin/app layout with collapsible sidebar slot, header, breadcrumbs, and scrollable canvas.
- **`ProtectedRoute`**: Lightweight guard component with client redirect or fallback support.

---

## Quick Usage

### Landing Layout

```tsx
import { LandingLayout, Header, Footer } from '@exhuma/router';

export default function MarketingPage() {
  return (
    <LandingLayout
      header={
        <Header
          brand='Exhuma'
          navItems={[
            { label: 'Cards', href: '/cards' },
            { label: 'Layouts', href: '/layouts' },
            { label: 'Studio', href: '/dashboard' },
          ]}
        />
      }
      footer={<Footer brand='Exhuma Studio' />}
    >
      <div className='py-24 text-center'>Hello from Exhuma!</div>
    </LandingLayout>
  );
}
```
