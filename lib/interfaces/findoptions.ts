import { FileFilter } from './filefilter';

export interface FindOptions {
    path: string;
    filters: FileFilter;
    fileContent?: RegExp;
}