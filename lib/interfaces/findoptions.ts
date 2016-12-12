/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import { FileFilter } from './filefilter';
import { ReadFileOptions } from './readfileoptions';

/**
 * @description
 * Declares the interface for the search options, used in the
 * find method.
 */
export interface FindOptions {
    /**
     * Path to be searched
     */
    path: string;
    /**
     * Filters as described in {@link FileFilter}
     */
    filters?: FileFilter;
    /**
     * RegExp to match the contents os a file.
     * This field is optional and if informed will apply to the file contents.
     * So watch your regex to avoid performance issues if you have a big amount
     * of files.
     */
    content?: RegExp;
    /**
     *
     */
    fileReadOptions?: ReadFileOptions;
    /**
     * Recursive search or not? The default is not false.
     */
    recursiveSearch?: boolean;
}