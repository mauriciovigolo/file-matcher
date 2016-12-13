/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */

import * as async from 'async';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as mm from 'micromatch';
import * as path from 'path';

import { AttributeType } from './enums/attributetype';
import { PredicateOperator } from './enums/predicateoperator';
import { FindOptions } from './interfaces/findoptions';
import { FileFilter } from './interfaces/filefilter';
import { FilterPredicate } from './interfaces/filterpredicate';
import { ProcessingDir } from './interfaces/processingdir';
import { ReadFileOptions } from './interfaces/readfileoptions';

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
 *          pattern: ['*.js'], // glob
 *          size: {
 *                  value: 1000,
 *                  operator: PredicateOperator.GreaterThan;
 *          },
 *          modifiedTime:  {
 *                  value: new Date(),
 *                  operator: PredicateOperator.LessThan;
 *          },
 *          birthTime: {
 *                  value: new Date(),
 *                  operator: PredicateOperator.LessThan;
 *          }
 *      }
 *      fileContent: 'RegExp to match the contents of a file'
 * };
 *
 * finder.find(criteria);
 * ```
 *
 * @description
 * Finds file(s) according to the criteria - by filename (using globs), size, creation and modified time. Finally it's possible to refine
 * the search by using a regex to match file contents. The search can be done recursively or not.
 *
 * This class extends the Node's EventEmitter. The following events are triggered:
 * - preSearchDirectory: emitted when the search starts to look for matching files in new directory.
 * - initSearchSubDirectory: emitted in the beginning of the search in a subdirectory.
 * - endSearchSubDirectory: emitted when the search in the subdirectory ends.
 * - endSearchDirectory: emitted when the search ends. This event is emitted only once.
 * - contentMatch: emitted when the content regex is matched.
 */
export class FileMatcher extends EventEmitter {

    private path: string;
    private fileFilter: FileFilter;
    private recursiveSearch: boolean;
    private negationFilter: string[];
    private files: string[];
    private processing: ProcessingDir[];

    constructor() {
        super();

        this.files = [];
        this.processing = [];
        this.setMaxListeners(0);

        this.registerEventListeners();
    }

    /**
     * Starts the search according to the {@link FindOptions} criteria. The search
     * supports glob searching for the filenames, including aditional criteria by
     * modified and birth time. It can be executed recursively or not. The
     * default search is not recursive.
     *
     * The content of the matched files can be also checked using a RegExp.
     *
     * First of all, the files are filtered by the {@link FileFilter} and after that,
     * the found files are matched by the RegExp, but only if the contentMatch attribute
     * is informed.
     *
     * This class extends the Node's EventEmitter. List of events:
     * - preSearchDirectory: emitted when the search starts to look for matching files in new directory. Returns the corresponding DIR.
     * - initSearchSubDirectory: emitted in the beginning of the search in a subdirectory. Returns the SUBDIR.
     * - endSearchSubDirectory: emitted when the search in the subdirectory ends. Returns the SUBDIR.
     * - endSearchDirectory: emitted when the search ends. This event is emitted only once. Returns the DIR.
     * - contentMatch: emitted when the content regex is matched. Returns the filename.
     *
     * @param {@link FindOptions} - criteria
     *
     * @return {Promise} returns a promise to send the results of the find execution.
     */
    find(criteria: FindOptions): Promise<string[]> {
        let files: Array<string> = [];

        this.init(criteria);

        return new Promise((resolve, reject) => {
            if (!this.path) {
                reject('The path must be informed to execute the file search!');
                return;
            }

            if (!this.fileFilter.fileNamePattern && !this.fileFilter.attributeFilters
                && !this.fileFilter.content) {
                reject('At least a filename pattern, fileattribute or file content regex should be declared!');
                return;
            }

            async.waterfall([
                callback => this.filterFiles(callback),
                callback => this.filterFileContent(callback)
            ], (err, files) => {
                if (err) {
                    reject(err);
                }

                resolve(files);
            });
        });
    }

    /**
     * Loads and prepares the FileMatcher attributes, applying the filters
     * and registering the callback functions events.
     *
     * @param {FindOptions} - criteria.
     */
    private init(criteria: FindOptions) {
        this.path = criteria.path;

        if (this.path === '') {
            this.path = undefined;
        }

        this.fileFilter = criteria.fileFilter;

        if (this.fileFilter.content) {
            this.fileFilter.fileReadOptions = this.fileFilter.fileReadOptions || { encoding: 'utf8', flag: 'r' };
        }

        if (this.fileFilter.attributeFilters && this.fileFilter.attributeFilters.length === 0) {
            this.fileFilter.attributeFilters = undefined;
        }

        this.recursiveSearch = criteria.recursiveSearch || false;

        this.files = [];
        this.processing = [];
        this.negationFilter = ['**/**'];

        if (this.fileFilter.fileNamePattern) {
            let fileGlob = this.fileFilter.fileNamePattern;

            if (fileGlob) {
                if (typeof fileGlob !== 'string') {
                    fileGlob = fileGlob as Array<string>;

                    fileGlob.forEach((item) => {
                        if (item.indexOf('!') === 0) {
                            this.negationFilter.push(item);
                        }
                    });
                } else {
                    if (fileGlob.indexOf('!') === 0) {
                        fileGlob = fileGlob as string;
                        this.negationFilter.push(fileGlob);
                    }
                }
            }
        }
    }

    /**
     * Filter the files, reading the directory and applying the filename pattern and
     * file attribute filters.
     *
     * @param {any} callback - async's callback.
     */
    private filterFiles(callback: any) {
        this.readDirectory(this.path)
            .then(() => {
                callback();
            })
            .catch((err) => {
                callback(err);
            });
    }

    /**
     * List all files and directories of a directory, applying the
     * glob filter and other filters.
     *
     * @param {string} dir - directory to be searched.
     */
    private readDirectory(dir: string): Promise<any> {
        let self = this;

        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, list) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Emit directory pre processing
                self.emit('preSearchDirectory', dir);

                list = mm(list, this.negationFilter);

                if (list.length === 0) {
                    self.endFileSearch(dir, resolve);
                }

                let totalItensList: number = list.length - 1;

                list.forEach(function (item, index) {
                    item = path.resolve(dir, item);
                    self.checkAndApplyFilters(dir, item, resolve, reject, totalItensList, index);
                });
            });
        });
    }

    /**
     * Checks if the current item is a directory - in this case it should be evaluated - if recursive attribute is true, and if it's a file
     * it checks if the filters are matched.
     *
     * @param {string} dir - parent's directory.
     * @param {string} item - directory item that will checked, if it's a subdirectory or a file.
     * @param {Function} resolve - promise's resolve function.
     * @param {Function} reject -  promise's reject function.
     * @param {number} totalItensDir - total of files/directories inside of dir (parent's directory).
     * @param {number} indexItem - Index of the present directory item, helping to check if it's time to end the file search.
     */
    private checkAndApplyFilters(dir: string, item: string, resolve: Function, reject: Function, totalItensDir: number, indexItem: number) {
        fs.stat(item, (err, stats) => {
            if (stats.isDirectory()) {
                // Should search recursively?
                if (this.recursiveSearch) {
                    this.emit('initSearchSubDirectory', dir);

                    this.processing.push({
                        dir: item,
                        parentDir: dir,
                        parentResolve: resolve
                    });

                    this.readDirectory(item);
                }
            } else {
                if (this.matchFilters(item, stats)) {
                    this.files.push(item);
                }
            }

            if (totalItensDir === indexItem) {
                let stillProcessingSubdir = this.processing.findIndex(processingItem => processingItem.parentDir === dir) > -1;

                if (!stillProcessingSubdir) {
                    this.endFileSearch(dir, resolve);
                }
            }
        });
    }

    /**
     * Applies the filters in the file, checking:
     * - filename pattern;
     * - file size;
     * - file creation time;
     * - file modified time;
     *
     * @param {string} file - filename.
     * @param {fs.Stats} stats - Node's Fs Stats to extract the file infos.
     *
     * @return {boolean} returns if the file matches the informed filters.
     */
    private matchFilters(file: string, stats: fs.Stats): boolean {
        let matchFilter: boolean = true;

        let fileNamePattern = this.fileFilter.fileNamePattern;
        let attributeFilters = this.fileFilter.attributeFilters;

        if (!fileNamePattern && !attributeFilters) {
            return matchFilter;
        }

        // Check filename pattern
        if (fileNamePattern) {
            matchFilter = mm(file, fileNamePattern).length > 0;
        }

        // Check file attributes as size, birth and modified date.
        if (matchFilter && attributeFilters) {
            attributeFilters.some(attributeFilter => {
                let predicate: FilterPredicate;
                let valueToCompared: number | string;

                predicate = attributeFilter.predicate;

                switch (attributeFilter.type) {
                    case AttributeType.Size:
                        valueToCompared = stats.size;
                        break;
                    case AttributeType.BirthDate:
                        valueToCompared = stats.birthtime.getTime();
                        predicate.value = (predicate.value as Date).getTime();                   
                        break;
                    case AttributeType.ModifiedDate:
                        valueToCompared = stats.mtime.getTime();
                        predicate.value = (predicate.value as Date).getTime();
                        break;
                    default:
                        break;
                }

                matchFilter = this.checkFilterPredicates(valueToCompared, predicate);

                return !matchFilter;
            });
        }

        return matchFilter;
    }

    /**
     * Makes the conversion of the FilterPredicates Enum to the corresponding operation and
     * checks if the file is ok.
     *
     * @param {number | string} value - value to be verified
     * @param {@link FilterPredicate} - predicate.
     *
     * @return {boolean} indicates if the file matches or not the Filters.
     */
    private checkFilterPredicates(value: number | string, predicate: FilterPredicate): boolean {
        let matchFilter: boolean = false;

        switch (predicate.operator) {
            case PredicateOperator.GreaterThan:
                matchFilter = value > predicate.value;
                break;
            case PredicateOperator.LessThan:
                matchFilter = value < predicate.value;
                break;
            case PredicateOperator.Equal:
                matchFilter = value === predicate.value;
                break;
            case PredicateOperator.NotEqual:
                matchFilter = value !== predicate.value;
                break;
        }

        return matchFilter;
    }

    /**
     * Deals with the end of file search, can be a subdirectory or directory.
     *
     * @param {string} dir - directory path.
     * @param {any} resolve - promise's resolve.
     */
    private endFileSearch(dir: string, resolve: any) {
        let subDir = this.processing.find(processingItem => processingItem.dir === dir);

        if (subDir) {
            let parentDir: string = subDir.parentDir;

            this.processing.splice(this.processing.indexOf(subDir), 1);

            this.emit('endSearchSubDirectory', parentDir, subDir.parentResolve);
        } else {
            this.emit('endSearchDirectory', dir);
        }

        resolve();
    }

    /**
     * Filter files by content.
     *
     * @param {any} callback - async's callback.
     */
    private filterFileContent(callback: any) {
        let self = this;
        let matchingFiles: Array<string> = [];

        if (this.fileFilter.content && this.files && this.files.length > 0) {
            this.files.some((file, index) => {
                this.readFileContent(file)
                    .then((result) => {
                        if (result) {
                            matchingFiles.push(result);
                        }

                        if ((self.files.length - 1) === index) {
                            callback(null, matchingFiles);
                            return true;
                        }
                    }).catch(err => {
                        callback(err);
                        return true;
                    });
                return false;
            });
        } else {
            matchingFiles = this.files;
            callback(null, matchingFiles);
        }
    }

    /**
     * It does the file read and applies the content RegExp.
     *
     * @param {string} file - file name to be loaded and it's content verified.
     *
     * @return {Promise} - promise's callback.
     */
    private readFileContent(file: string): Promise<any> {
        let self = this;

        return new Promise((resolve, reject) => {
            fs.readFile(file, this.fileFilter.fileReadOptions, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (this.fileFilter.content.test(data)) {
                    self.emit('contentMatch', file);
                    resolve(file);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * 
     */
    private registerEventListeners(): void {
        this.on('endSearchSubDirectory', (parentDir, resolve) => {
            let stillProcessingSubdir = this.processing.findIndex(processingItem => processingItem.parentDir === parentDir) > -1;

            if (!stillProcessingSubdir) {
                this.endFileSearch(parentDir, resolve);
            }
        });
    }

}