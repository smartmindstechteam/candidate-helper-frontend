import { FormSubmissionHandler, FormSubmissionError } from '../form-submission';

// Mock fetch
global.fetch = jest.fn();

describe('FormSubmissionHandler', () => {
  let handler: FormSubmissionHandler;

  beforeEach(() => {
    handler = new FormSubmissionHandler('/api');
    (fetch as jest.Mock).mockClear();
  });

  describe('submitForm', () => {
    it('should successfully submit form data', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { id: 1, title: 'Test Event' },
          success: true,
          message: 'Event created successfully'
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await handler.submitForm('/events', {
        title: 'Test Event',
        description: 'Test Description'
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 1, title: 'Test Event' });
      expect(fetch).toHaveBeenCalledWith(
        '/api/events',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Test Event',
            description: 'Test Description'
          })
        })
      );
    });

    it('should handle validation errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: 'Validation failed',
          errors: {
            title: ['Title is required'],
            email: ['Invalid email format']
          }
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await handler.submitForm('/events', {
        title: '',
        email: 'invalid-email'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
      expect(result.errors).toEqual({
        title: ['Title is required'],
        email: ['Invalid email format']
      });
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await handler.submitForm('/events', {
        title: 'Test Event'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error. Please check your connection and try again.');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('The operation was aborted');
      timeoutError.name = 'AbortError';
      (fetch as jest.Mock).mockRejectedValueOnce(timeoutError);

      const result = await handler.submitForm('/events', {
        title: 'Test Event'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Request timeout. Please check your connection and try again.');
    });

    it('should retry on network errors', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { id: 1, title: 'Test Event' },
          success: true
        })
      };

      // First call fails, second succeeds
      (fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockResponse);

      const result = await handler.submitForm('/events', {
        title: 'Test Event'
      }, {
        retries: 2,
        retryDelay: 10 // Fast retry for testing
      });

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry validation errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: 'Validation failed',
          errors: { title: ['Title is required'] }
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await handler.submitForm('/events', {
        title: ''
      }, {
        retries: 3
      });

      expect(result.success).toBe(false);
      expect(fetch).toHaveBeenCalledTimes(1); // No retries for validation errors
    });
  });
});

describe('FormSubmissionError', () => {
  it('should create error with proper properties', () => {
    const error = new FormSubmissionError(
      'Test error',
      400,
      { title: ['Title is required'] },
      false
    );

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(400);
    expect(error.errors).toEqual({ title: ['Title is required'] });
    expect(error.isNetworkError).toBe(false);
    expect(error.isValidationError).toBe(true);
  });

  it('should identify network errors correctly', () => {
    const networkError = new FormSubmissionError('Network error', 0, undefined, true);
    expect(networkError.isNetworkError).toBe(true);
    expect(networkError.isValidationError).toBe(false);
  });

  it('should identify validation errors correctly', () => {
    const validationError = new FormSubmissionError('Validation error', 400, undefined, false);
    expect(validationError.isValidationError).toBe(true);
    expect(validationError.isNetworkError).toBe(false);
  });
});
