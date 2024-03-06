import { FileValidator } from '@nestjs/common';
import { fromBuffer } from 'file-type';

export class FileSizeValidator extends FileValidator {

    protected readonly validationOptions: Record<'fileSize', number>;
    protected fileSize: string;

    constructor(validationOptions: Record<'fileSize', number>) {
        super(validationOptions);
        if (this.validationOptions.fileSize / 1024 / 1024 >= 1) {
            this.fileSize = (this.validationOptions.fileSize / 1024 / 1024).toFixed(2) + 'mb';
        }
        else if (this.validationOptions.fileSize / 1024 >= 1) {
            this.fileSize = (this.validationOptions.fileSize / 1024).toFixed(2) + 'kb';
        }
        else {
            this.fileSize = this.validationOptions.fileSize + 'bytes';
        }
    }

    async isValid(file: Express.Multer.File): Promise<boolean> {
        try {
            const uploadMultipleFields = Array.isArray(Object.values(file)[0]);
            if (uploadMultipleFields) {
                const files = Object.values(file).flat();
                for (const file of files) {
                    if (file.size > this.validationOptions.fileSize) return false;
                }
                return true;
            }
            else {
                return file.size <= this.validationOptions.fileSize;
            }
        }
        catch (err) {
            return false;
        }
    }

    buildErrorMessage(file: Express.Multer.File): string {
        return `File too big, file size limit is ${this.fileSize}`;
    }
}

export class FileTypeValidator extends FileValidator {

    protected readonly validationOptions: Record<'fileType', RegExp>;

    constructor(validationOptions: Record<'fileType', RegExp>) {
        super(validationOptions);
    }

    async isValid(file: Express.Multer.File): Promise<boolean> {
        try {
            const uploadMultipleFields = Array.isArray(Object.values(file)[0]);
            if (uploadMultipleFields) {
                const files = Object.values(file).flat();
                for (const file of files) {
                    const { ext } = await fromBuffer(file.buffer);
                    const validFileType = this.validationOptions.fileType.test(ext);
                    if (!validFileType) return false;
                }
                return true;
            }
            else {
                const { ext } = await fromBuffer(file.buffer);
                return this.validationOptions.fileType.test(ext);
            }
        }
        catch (err) {
            return false;
        }
    }

    buildErrorMessage(file: Express.Multer.File): string {
        return 'Invalid file type';
    }
}