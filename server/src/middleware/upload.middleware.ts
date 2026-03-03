import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config/index.js';

// Allowed file types with their MIME types
const ALLOWED_MIME_TYPES = {
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  documents: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// Maximum file sizes by type (in bytes)
const MAX_FILE_SIZES = {
  images: 5 * 1024 * 1024, // 5MB
  documents: 10 * 1024 * 1024, // 10MB
} as const;

// Dangerous file extensions to block
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.app', '.deb', '.pkg', '.dmg', '.rpm', '.msi', '.sh', '.ps1',
  '.php', '.asp', '.aspx', '.jsp', '.py', '.rb', '.pl', '.cgi',
];

// Storage configuration with secure filename generation
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  // Check for dangerous extensions
  if (DANGEROUS_EXTENSIONS.includes(fileExtension)) {
    cb(new Error(`File type ${fileExtension} is not allowed for security reasons`));
    return;
  }

  // Check MIME type
  const allAllowedMimeTypes = [...ALLOWED_MIME_TYPES.images, ...ALLOWED_MIME_TYPES.documents];
  if (!allAllowedMimeTypes.includes(file.mimetype as any)) {
    cb(new Error(`MIME type ${file.mimetype} is not allowed`));
    return;
  }

  // Check filename for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /[<>:"|?*]/,  // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i,  // Reserved Windows names
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.originalname))) {
    cb(new Error('Filename contains suspicious characters or patterns'));
    return;
  }

  cb(null, true);
};

// Multer configuration
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.storage.maxFileSize,
    files: 1, // Only one file at a time
  },
});

// Enhanced file validation middleware
export const validateFileUpload = (allowedTypes: ('images' | 'documents')[] = ['images']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' }
      });
    }

    const file = req.file;
    const maxSize = Math.max(...allowedTypes.map(type => MAX_FILE_SIZES[type]));

    // Validate file size
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: { 
          message: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB` 
        }
      });
    }

    // Validate MIME type against allowed types
    const allowedMimeTypes = allowedTypes.flatMap(type => ALLOWED_MIME_TYPES[type]);
    if (!allowedMimeTypes.includes(file.mimetype as any)) {
      return res.status(400).json({
        success: false,
        error: { message: `File type ${file.mimetype} is not allowed` }
      });
    }

    // Additional security checks for image files
    if (file.mimetype.startsWith('image/')) {
      // Verify file signature (magic numbers)
      const buffer = file.buffer;
      let isValidImage = false;

      // JPEG: FF D8 FF
      if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        isValidImage = true;
      }
      // PNG: 89 50 4E 47
      else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        isValidImage = true;
      }
      // GIF: 47 49 46 38
      else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
        isValidImage = true;
      }
      // WebP: 52 49 46 46 ... 57 45 42 50
      else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
               buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        isValidImage = true;
      }

      if (!isValidImage) {
        return res.status(400).json({
          success: false,
          error: { message: 'File does not match its declared image format' }
        });
      }
    }

    next();
  };
};

// Sanitize filename utility
export const sanitizeFilename = (originalname: string): string => {
  const ext = path.extname(originalname).toLowerCase();
  const name = path.basename(originalname, ext);
  
  // Remove dangerous characters and replace with underscores
  const sanitizedName = name
    .replace(/[<>:"|?*]/g, '_')
    .replace(/\.\./g, '_')
    .substring(0, 50); // Limit length
  
  return `${sanitizedName}_${Date.now()}${ext}`;
};
