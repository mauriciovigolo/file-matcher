/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

/**
 * Generic interface used for filtering files by attributes.
 */
export interface AttributeFilter {
  /**
   * Value to be searched, can be a number, Date or string.
   */
  value: number | Date | string;
  /**
   * Attribute type,. Examples: Size, Modified Date and Birth Date.
   */
  type: 'Size' | 'BirthDate' | 'ModifiedDate';
  /**
   * Operator to be applied to the value:
   * - eq: Equal
   * - ne: Not Equal
   * - lt: Less Than
   * - gt: Greater Than
   */
  operator: 'eq' | 'ne' | 'lt' | 'gt';
}
