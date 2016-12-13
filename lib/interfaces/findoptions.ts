/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import { FileFilter } from './filefilter';


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
     * 
     */
    fileFilter: FileFilter; 
    /**
     * Recursive search or not? The default is not false.
     */
    recursiveSearch?: boolean;
}