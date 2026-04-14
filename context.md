# Project Context: Meet_Portfolio

This document provides a comprehensive overview of the **Meet_Portfolio** project, a modern, developer-focused portfolio and blog platform built with Next.js.

## Project Overview

**Meet_Portfolio** is a customizable portfolio template designed for developers to showcase their work, education, projects, and hackathon experiences. It features a built-in blog system powered by MDX and a sleek, animated user interface.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router, Version 16.x)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**:
    -   [Tailwind CSS](https://tailwindcss.com/) (Version 4.x)
    -   [Shadcn/UI](https://ui.shadcn.com/) (UI components)
    -   [Magic UI](https://magicui.design/) (Animated UI components)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Motion)
-   **Content Management**: [Content Collections](https://www.content-collections.dev/) (Type-safe MDX management)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Fonts**: Geist & Geist Mono

## Core Architecture

The project follows a standard Next.js App Router structure:

-   `src/app/`: Contains the pages and layouts.
    -   `layout.tsx`: Root layout with `ThemeProvider`, `TooltipProvider`, and global UI elements like the `Navbar` and `FlickeringGrid` background.
    -   `page.tsx`: The main landing page, dynamically rendering sections from `DATA`.
    -   `blog/`: Pages for the blog listing and individual post rendering.
-   `src/components/`: Reusable UI components.
    -   `magicui/`: Complex, animated components.
    -   `ui/`: Base Shadcn/UI components.
    -   `section/`: Specific page sections (Work, Education, Skills, etc.).
-   `src/data/`: Centralized data management.
    -   `resume.tsx`: **Single Source of Truth**. Almost all portfolio content (Name, Skills, Work History, Projects, Hackathons) is defined here.
-   `src/lib/`: Utility functions and MDX plugins.
-   `content/`: MDX files for blog posts.
-   `content-collections.ts`: Schema definitions and transformations for MDX content.

## Key Features

1.  **Single-File Configuration**: The entire portfolio can be customized by editing `src/data/resume.tsx`.
2.  **Type-Safe Blog**: Blog posts are written in MDX and validated using Zod schemas via Content Collections.
3.  **Dynamic Animations**: Uses Magic UI and Framer Motion for premium-feeling transitions and interactive elements (e.g., `FlickeringGrid`, `ProjectCard` hover effects).
4.  **Responsive Design**: Optimized for mobile, tablet, and desktop devices.
5.  **Dark Mode Support**: Built-in theme switching via `next-themes`.

## Development Workflow

### Prerequisites
-   Node.js (>= 18.0.0)
-   pnpm (recommended)

### Installation
```bash
pnpm install
```

### Local Development
```bash
pnpm dev
```

### Making Changes
-   **Profile Information**: Edit `src/data/resume.tsx`.
-   **Adding Blog Posts**: Create a new `.mdx` file in the `content/` directory.
-   **Customizing UI**: Modify components in `src/components/` or update global styles in `src/app/globals.css`.

## Deployment
The project is optimized for deployment on **Vercel**, leveraging Next.js optimizations.
