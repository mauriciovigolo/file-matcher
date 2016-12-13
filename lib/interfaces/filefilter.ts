/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import { AttributeFilter } from './attributefilter';
import { ReadFileOptions } from './readfileoptions';

/**
 * @description
 * Declares the interface to configure the available
 * filters for the file search.
 */
export interface FileFilter {
    /**
     * Glob pattern for looking for files - filenames.
     * Examples:
     * '*.js'
     * ['**','!*.ts']
     */
    fileNamePattern?: string | Array<string>;
    /**
     * 
     */
    attributeFilters?: Array<AttributeFilter>;
    /**
     * RegExp to match the contents os a file.
     * This field is optional and if informed will apply to the file contents.
     * So watch your regex to avoid performance issues if you have a big amount
     * of files.
     */
    content?: RegExp;
    /**
     * These options will be used in the Node.JS `fs.ReadFile` function. So it has the same options as the original.
     */
    fileReadOptions?: ReadFileOptions; 
}