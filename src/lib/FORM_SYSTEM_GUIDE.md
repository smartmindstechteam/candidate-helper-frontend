# Form System Guide

This guide explains how to use the new form submission system with proper routing, error handling, and fallback mechanisms.

## Overview

The form system provides:
- ✅ **Proper API Routing**: All forms submit to correct API endpoints
- ✅ **Error Handling**: Client-side and server-side validation with user-friendly messages
- ✅ **Fallback Systems**: Retry mechanisms, timeout handling, and graceful degradation
- ✅ **Loading States**: Visual feedback during form submission
- ✅ **Success States**: Confirmation messages and next steps
- ✅ **Type Safety**: Full TypeScript support with proper typing

## Quick Start

### 1. Using the Form Submission Hook

```tsx
import { useFormSubmission } from '@/lib/form-submission';

function MyForm() {
  const { isSubmitting, error, errors, submitForm, clearErrors } = useFormSubmission();

  const onSubmit = async (data: any) => {
    const result = await submitForm(async () => {
      return formUtils.submitEvent(data, false);
    });

    if (result.success) {
      // Handle success
      console.log('Form submitted successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Your form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### 2. Using the Form Wrapper Component

```tsx
import { FormWrapper } from '@/components/forms/form-wrapper';

function MyFormPage() {
  const handleSubmit = async (data: any) => {
    return formUtils.submitEvent(data, false);
  };

  return (
    <FormWrapper
      title="Create Event"
      description="Fill out the form to create a new event"
      onSubmit={handleSubmit}
      onSuccess={(data) => console.log('Success!', data)}
      submitLabel="Create Event"
      icon={<Calendar className="h-6 w-6" />}
    >
      {/* Your form fields go here */}
      <input name="title" placeholder="Event Title" required />
      <input name="description" placeholder="Description" />
    </FormWrapper>
  );
}
```

## Available Form Utilities

### Event Management
```tsx
// Create event
const result = await formUtils.submitEvent(data, false);

// Update event
const result = await formUtils.submitEvent(data, true, eventId);
```

### Authentication
```tsx
// Login
const result = await formUtils.submitAuth(data, 'login');

// Register
const result = await formUtils.submitAuth(data, 'register');
```

### Bus Management
```tsx
// Register bus
const result = await formUtils.submitBusRegistration(data);

// Create route
const result = await formUtils.submitBusRouting(data, false);

// Update route
const result = await formUtils.submitBusRouting(data, true, routeId);
```

### User Management
```tsx
// Register supporter
const result = await formUtils.submitSupporterRegistration(data);

// Register operator
const result = await formUtils.submitOperatorRegistration(data);
```

### Fund Management
```tsx
// Create fund entry
const result = await formUtils.submitFundManagement(data, false);

// Update fund entry
const result = await formUtils.submitFundManagement(data, true, fundId);
```

### Communication
```tsx
// Send message
const result = await formUtils.submitCommunicationMessage(data);

// Assign task
const result = await formUtils.submitTaskAssignment(data);

// Register voter
const result = await formUtils.submitVoterRegistration(data);
```

## Error Handling

### Client-Side Validation
The system automatically handles client-side validation using Zod schemas:

```tsx
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Server-Side Error Handling
Server errors are automatically caught and displayed:

```tsx
// Server returns validation errors
{
  "error": "Validation failed",
  "errors": {
    "email": ["Email already exists"],
    "password": ["Password too weak"]
  }
}

// Server returns general error
{
  "error": "Internal server error",
  "status": 500
}
```

### Network Error Handling
The system automatically handles:
- **Timeout errors**: Request takes too long
- **Network errors**: No internet connection
- **Server errors**: 5xx status codes
- **Client errors**: 4xx status codes

## Fallback Systems

### Retry Mechanism
Failed requests are automatically retried with exponential backoff:

```tsx
const config = {
  retries: 3,        // Retry up to 3 times
  retryDelay: 1000,  // Start with 1 second delay
  timeout: 30000,    // 30 second timeout
};
```

### Graceful Degradation
When the server is unavailable, the system provides:
- Clear error messages
- Retry buttons
- Offline indicators
- Fallback content

### Loading States
Visual feedback during form submission:
- Disabled form fields
- Loading spinners
- Progress indicators
- Success animations

## API Routes

All forms are connected to proper API routes:

### Events
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `GET /api/events` - List events

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Bus Management
- `POST /api/bus` - Register bus
- `GET /api/bus` - List buses
- `PUT /api/bus/[id]` - Update bus
- `DELETE /api/bus/[id]` - Delete bus

### User Management
- `POST /api/supporters` - Register supporter
- `POST /api/operators` - Register operator
- `GET /api/supporters` - List supporters
- `GET /api/operators` - List operators

### Fund Management
- `POST /api/funds` - Create fund entry
- `GET /api/funds` - List fund entries
- `PUT /api/funds/[id]` - Update fund entry
- `DELETE /api/funds/[id]` - Delete fund entry

## Best Practices

### 1. Always Use the Form Submission Hook
```tsx
// ✅ Good
const { isSubmitting, error, submitForm } = useFormSubmission();

// ❌ Avoid
const [isSubmitting, setIsSubmitting] = useState(false);
```

### 2. Handle Success and Error States
```tsx
const onSubmit = async (data: any) => {
  const result = await submitForm(async () => {
    return formUtils.submitEvent(data, false);
  });

  if (result.success) {
    // Show success message
    toast.success('Event created successfully!');
    // Redirect or reset form
    router.push('/events');
  } else {
    // Error is automatically displayed
    console.error('Submission failed:', result.error);
  }
};
```

### 3. Use Proper Validation
```tsx
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
});

const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange', // Real-time validation
});
```

### 4. Provide User Feedback
```tsx
return (
  <form onSubmit={handleSubmit(onSubmit)}>
    {error && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </button>
  </form>
);
```

## Troubleshooting

### Common Issues

1. **Form not submitting**
   - Check if API route exists
   - Verify form data structure
   - Check browser console for errors

2. **Validation errors not showing**
   - Ensure Zod schema is properly configured
   - Check if form is in `onChange` mode
   - Verify error handling in form component

3. **Network errors**
   - Check internet connection
   - Verify API server is running
   - Check CORS settings

4. **Timeout errors**
   - Increase timeout value
   - Check server response time
   - Consider breaking large forms into steps

### Debug Mode

Enable debug mode to see detailed logs:

```tsx
const { submitForm } = useFormSubmission();

const onSubmit = async (data: any) => {
  console.log('Form data:', data);
  
  const result = await submitForm(async () => {
    console.log('Submitting to API...');
    return formUtils.submitEvent(data, false);
  });
  
  console.log('Submission result:', result);
};
```

## Migration Guide

### From Old Forms to New System

1. **Replace manual state management**:
```tsx
// Old
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState(null);

// New
const { isSubmitting, error, submitForm } = useFormSubmission();
```

2. **Replace manual API calls**:
```tsx
// Old
const response = await fetch('/api/events', {
  method: 'POST',
  body: JSON.stringify(data),
});

// New
const result = await formUtils.submitEvent(data, false);
```

3. **Replace manual error handling**:
```tsx
// Old
try {
  const response = await fetch('/api/events', { ... });
  if (!response.ok) {
    throw new Error('Submission failed');
  }
} catch (error) {
  setError(error.message);
}

// New
const result = await submitForm(async () => {
  return formUtils.submitEvent(data, false);
});
// Error is automatically handled
```

This system provides a robust, user-friendly form submission experience with proper error handling and fallback mechanisms.
