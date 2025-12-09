/**
 * ImageLoader utility for runtime image loading and validation
 * Enables client to add new businesses by editing data.json without rebuild
 * Supports multiple image formats: WebP (default), JPG, JPEG, PNG
 */
export class ImageLoader {
  private static imageCache = new Map<string, boolean>();
  private static readonly SUPPORTED_FORMATS = ['webp', 'jpg', 'jpeg', 'png'];
  private static readonly DEFAULT_FORMAT = 'webp';

  /**
   * Checks if an image exists by attempting to load it
   * @param url - Image URL to check
   * @returns Promise resolving to true if image exists, false otherwise
   */
  static async checkImageExists(url: string): Promise<boolean> {
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    return new Promise(resolve => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        this.imageCache.set(url, false);
        resolve(false);
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        this.imageCache.set(url, true);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        this.imageCache.set(url, false);
        resolve(false);
      };

      img.src = url;
    });
  }

  /**
   * Extracts folder name from image path
   * @param imagePath - Path like "./img/1/folder_name/images/file.webp" or "./img/1/folder_name/images/file.jpg"
   * @returns Folder name or null if pattern doesn't match
   */
  static extractFolderName(imagePath: string): string | null {
    const match = imagePath.match(/\.\/img\/1\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  /**
   * Resolves the main image path with priority for logo files
   * Tries multiple formats: webp (default), jpg, jpeg, png
   * @param folderName - Name of the business folder
   * @param currentImage - Current image path from data.json
   * @returns Resolved image path or null if no valid image found
   */
  static async resolveImagePath(
    folderName: string,
    currentImage: string | null
  ): Promise<string | null> {
    for (const format of this.SUPPORTED_FORMATS) {
      const logoPath = `./img/1/${folderName}/logo.${format}`;
      const logoExists = await this.checkImageExists(logoPath);
      if (logoExists) {
        return logoPath;
      }
    }

    if (currentImage) {
      const exists = await this.checkImageExists(currentImage);
      return exists ? currentImage : null;
    }

    return null;
  }

  /**
   * Filters out non-existent images from array
   * @param images - Array of image paths
   * @returns Array containing only existing images
   */
  static async filterExistingImages(images: string[]): Promise<string[]> {
    if (!images || images.length === 0) {
      return [];
    }

    const checks = await Promise.all(images.map(img => this.checkImageExists(img)));
    return images.filter((_, index) => checks[index]);
  }

  /**
   * Processes image data for a business point
   * @param folderName - Name of the business folder
   * @param currentImage - Current image path from data.json
   * @param currentImages - Current images array from data.json
   * @returns Object with resolved image and filtered images array
   */
  static async processImages(
    folderName: string,
    currentImage: string | null,
    currentImages: string[]
  ): Promise<{ image: string | null; images: string[] }> {
    const image = await this.resolveImagePath(folderName, currentImage);
    const images = await this.filterExistingImages(currentImages || []);

    return { image, images };
  }
}
