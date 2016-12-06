/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import { FileFilter } from './filefilter';

export interface FindOptions {
    path: string;
    filters: FileFilter;
    fileContent?: RegExp;
    recursiveSearch?: boolean;
}