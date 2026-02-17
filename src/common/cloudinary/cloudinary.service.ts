import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  /**
   * Upload a file to Cloudinary
   * @param file - The file to upload (from multer)
   * @param folder - Optional folder name in Cloudinary
   * @returns Upload response with secure_url
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'portfolio',
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file provided for upload');
    }

    // Validate file type (only images)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed',
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new InternalServerErrorException(`Failed to upload file: ${error.message}`));
          } else if (result) {
            resolve(result);
          } else {
            reject(new InternalServerErrorException('Upload failed with no response'));
          }
        },
      );

      // Convert buffer to stream and upload
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  /**
   * Upload a document file to Cloudinary (PDF, DOC, DOCX, ZIP, etc.)
   * @param file - The file to upload (from multer)
   * @param folder - Optional folder name in Cloudinary
   * @returns Upload response with secure_url
   */
  async uploadDocument(
    file: Express.Multer.File,
    folder: string = 'portfolio/documents',
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file provided for upload');
    }

    // Validate file type (documents and images)
    const allowedMimeTypes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      // Documents
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/zip',
      'application/x-zip-compressed',
      'text/plain', // .txt
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: PDF, DOC, DOCX, ZIP, TXT, JPEG, PNG, GIF, WebP',
      );
    }

    // Validate file size (max 10MB for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto', // Auto-detect resource type (image, video, raw)
          format: file.originalname.split('.').pop(), // Preserve original format
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new InternalServerErrorException(`Failed to upload document: ${error.message}`));
          } else if (result) {
            resolve(result);
          } else {
            reject(new InternalServerErrorException('Upload failed with no response'));
          }
        },
      );

      // Convert buffer to stream and upload
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId - The public ID of the file to delete
   * @param resourceType - The resource type (image, video, raw) - defaults to auto-detect
   * @returns Deletion result
   */
  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any> {
    if (!publicId) {
      throw new BadRequestException('No public ID provided for deletion');
    }

    try {
      // Try deleting with specified resource type
      let result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

      // If not found, try with other resource types
      if (result.result === 'not found') {
        const types: Array<'image' | 'video' | 'raw'> = ['image', 'raw', 'video'];
        for (const type of types) {
          if (type !== resourceType) {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: type });
            if (result.result === 'ok') {
              break;
            }
          }
        }
      }

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new InternalServerErrorException(`Failed to delete file: ${result.result}`);
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Cloudinary URL
   * @returns Public ID
   */
  extractPublicId(url: string): string {
    if (!url) {
      return '';
    }

    try {
      // Extract public ID from Cloudinary URL
      // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
      // Public ID: folder/image
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');

      if (uploadIndex === -1) {
        throw new BadRequestException('Invalid Cloudinary URL');
      }

      // Get everything after 'upload' and version (if exists)
      let startIndex = uploadIndex + 1;
      if (urlParts[startIndex].startsWith('v')) {
        startIndex += 1;
      }

      const publicIdWithExtension = urlParts.slice(startIndex).join('/');
      // Remove file extension
      const publicId =
        publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.')) ||
        publicIdWithExtension;

      return publicId;
    } catch (error) {
      throw new BadRequestException('Failed to extract public ID from URL');
    }
  }
}
