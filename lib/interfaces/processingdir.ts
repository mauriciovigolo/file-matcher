/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

/**
 * @description
 * Used to indicate the current processing dir, its parent and promise resolve.
 * Used in recursive searches.
 */
export interface ProcessingDir {
    /**
     * Current processing dir.
     */
    dir: string;
    /**
     * Parent's directory.
     */
    parentDir: string;
    /**
     * Parent's promise resolve.
     */
    parentResolve: Function;
}