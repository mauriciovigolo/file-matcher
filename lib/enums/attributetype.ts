/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

/**
 * @description
 * List of available file attribute types, that will be used to determine the
 * filtering execution flow.
 */
export enum AttributeType {
    /**
     * File size in bytes.
     */
    Size,
    /**
     * File birth time.
     */
    BirthDate,
    /**
     * File change time
     */
    ModifiedDate
}