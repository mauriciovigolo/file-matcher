/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import { FilterPredicate } from './filterpredicate';

/**
 * @whatItDoes Finds file(s) by name / contents, according to the {@link FindOptions} criteria.
 *
 * @howToUse
 * ```
 * let finder: FileFinder = new FileFinder();
 *
 * const criteria: FindOptions = {
 *      path: 'pathToSearch',
 *      filters: {
 *
 *      },
 *      fileContent: 'RegExp to match the contents of a file'
 * };
 *
 * finder.find(criteria);
 * ```
 *
 * @description
 * Finds file(s) according to the criteria - by filename (using globs), size, creation, access and change time. Finally it's possible to refine
 * the search by using a regex to match file contents. The search can be done recursively or not.
 *
 * This class extends the Node's EventEmitter. The following events are triggered:
 * - preSearchDirectory: emitted when the search starts to look for matching files in new directory.
 * - initSearchSubDirectory:
 * - endSearchSubDirectory:
 * - endSearchSubDirectory:
 * - endSearchDirectory:
 * - contentMatch:
 */
export interface FileFilter {
    pattern?: string | Array<string>;
    size?: FilterPredicate;
    accessTime?: FilterPredicate;
    changeTime?: FilterPredicate;
    birthTime?: FilterPredicate;
}