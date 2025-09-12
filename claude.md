# Trilio Project Guidelines

## Component Organization Best Practice

For proper code organization and maintainability, follow this structure:

### Directory Structure
```
src/
├── components/
│   └── [page-name]/           # Page-specific components
│       ├── ComponentOne.tsx
│       ├── ComponentTwo.tsx
│       └── ...
└── pages/
    └── [page-name]/           # Main page component
        └── PageName.tsx
```

### Example
For a landing page:
```
src/
├── components/
│   └── landing/               # Landing page specific components
│       ├── Hero.tsx
│       ├── Features.tsx
│       └── Testimonials.tsx
└── pages/
    └── landing/               # Main landing page
        └── Landing.tsx
```

### Rationale
- **Separation of concerns**: Page components handle routing and layout, while component pieces are reusable
- **Scalability**: Easy to add new components specific to a page
- **Maintainability**: Clear organization makes it easy to find and modify code
- **Reusability**: Components can be easily moved or shared between pages if needed

## Redux State Management

- Use Redux Toolkit for all state management
- No useState or useEffect for form/application state
- Redux is the single source of truth
- Use typed hooks (useAppSelector, useAppDispatch)
- Implement proper validation in Redux slices

## Error Handling

- Use toast notifications (Sonner) for validation errors
- Position: top-right
- No inline error messages or red boxes
- Keep error messages concise and actionable

## Form Validation

- Validate in Redux slice
- Make buttons always clickable but visually disabled (opacity-50)
- Show validation errors via toast when user attempts invalid action
- Store form drafts in localStorage for persistence

## Testing Commands

When making changes, run these commands to ensure code quality:
- `npm run lint` - Check for linting errors
- `npm run typecheck` - Verify TypeScript types
- `npm run build` - Ensure production build works