# Mini Kanban Board
Sriram H S
Assignment for PixelMind - MiniKanban board

## Quick Start

### Install dependencies
npm install
### Start development server
npm run dev


##  Features
### Core Functionality
- **Three-column layout**: Todo, In Progress, Done
- **Drag & Drop**: Reorder tasks within columns or move between columns
- **Task Management**: Create, edit, and delete tasks with rich metadata
- **Real-time Progress**: Visual progress bar showing completion status
### Advanced Features
- **Smart Filtering**: Filter by priority, due date, or search by text
- **Flexible Sorting**: Sort tasks by due date, priority, or manual order
- **Theme Support**: Light, dark, and system theme modes
- **Data Persistence**: Automatic localStorage backup with export/import
- **Responsive Design**: Works seamlessly on desktop and mobile

## Challenges I faced & How I resolved Them

### Challenges
 1. **Drag & drop got messy with sorting**
Drag-and-drop worked fine until I added “sort by due date” and “sort by priority.” now the were tasks moving in unexpected ways . My fix was to always persist a manual order separately, and only derive sorted lists in selectors.

2. **LocalStorage persistence slowed things down**
At first I was saving the entire state to localStorage on every action, which made typing in a form feel laggy. I fixed this by writing a tiny middleware that debounced the saves and only wrote the parts of the state that actually changed.





### Key Dependencies
- **@hello-pangea/dnd**: Drag and drop functionality
- **@reduxjs/toolkit**: State management
- **react-redux**: React Redux bindings
- **date-fns**: Date utilities
- **lucide-react**: Icon library
- **ShadCn** : UI library
- **tailwindcss**: Styling framework
- **vite**: Build tool and dev server
### Development Tools
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and HMR

