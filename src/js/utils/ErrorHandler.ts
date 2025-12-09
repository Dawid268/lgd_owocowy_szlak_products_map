export class ErrorHandler {
  public static handleNetworkError(error: Error, context: string): void {
    console.error(`Network error in ${context}:`, error);
    this.showUserMessage(
      'Wystąpił problem z połączeniem. Sprawdź połączenie internetowe i odśwież stronę.'
    );
  }

  public static handleDataError(error: Error, context: string): void {
    console.error(`Data error in ${context}:`, error);
    this.showUserMessage('Wystąpił problem z danymi. Spróbuj odświeżyć stronę.');
  }

  public static handleMapError(error: Error): void {
    console.error('Map initialization error:', error);
    this.showUserMessage('Nie udało się załadować mapy. Sprawdź połączenie internetowe.');
  }

  public static handleImageError(imageSrc: string): void {
    console.warn(`Failed to load image: ${imageSrc}`);
  }

  private static showUserMessage(message: string): void {
    const existingMessage = document.querySelector('.error-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;

    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  public static wrapAsyncFunction<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    context: string,
    fallback?: () => void
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleNetworkError(error as Error, context);
        if (fallback) {
          fallback();
        }
        throw error;
      }
    }) as T;
  }
}
