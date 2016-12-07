/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import { FilterPredicate } from './filterpredicate';

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
    pattern?: string | Array<string>;
    /**
     * File size in bytes as {@link FilterPredicate}
     */
    size?: FilterPredicate;
    /**
     * File change time as {@link FilterPredicate}
     */
    modifiedTime?: FilterPredicate;
    /**
     * File birth time as {@link FilterPredicate}
     */
    birthTime?: FilterPredicate;
}