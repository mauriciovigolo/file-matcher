/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import { AttributeFilter } from './attribute-filter';

/**
 * Filter options to configure the file search, including file attributes,
 * file name and file content.
 *
 * The conjunction operator in the FileFilter is AND.
 */
export interface FileFilter {
  /**
   * Glob pattern for looking for files - filenames.
   * Examples:
   * '*.js'
   * ['**','!*.ts']
   */
  fileNamePattern?: string | string[];
  /**
   * List of file attribute filters as file size,
   * modified and birth dates. It's possible to send the same attribute more
   * than one time, to check, for example, if a file size is GreaterThan and
   * LessThan a specific value.
   */
  attributeFilters?: AttributeFilter[];
  /**
   * RegExp to match the contents os a file.
   * This field is optional and if informed will apply to the file contents.
   * So watch your regex to avoid performance issues if you have a big amount
   * of files.
   */
  content?: RegExp;
}
