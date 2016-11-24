import * as fs from 'fs';
import * as path from 'path';
import * as mm from 'micromatch';
import * as async from 'async';
import { EventEmitter } from 'events';

import { FindOptions } from './interfaces/findoptions';
import { FileFilter } from './interfaces/filefilter';
import { ProcessingDir } from './interfaces/processingdir';
import { FilterPredicate } from './interfaces/filterpredicate';
import { PredicateOperator } from './enums/predicateoperator';


export class FileFinder extends EventEmitter {

    private filters: FileFilter;
    private contentFilter: RegExp;
    private negationFilter: string[];
    private files: string[];
    private processing: ProcessingDir[];


    constructor() {
        super();
        this.setMaxListeners(10000);
    }

    /**
     *
     *
     *
     * @param criteria -
     */
    find(criteria: FindOptions): Promise<string[]> {
        let files: Array<string> = [];

        this.init(criteria);

        return new Promise((resolve, reject) => {
            async.waterfall([
                callback => this.filterFiles(criteria.path, callback),
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
     *
     *
     * @param filter -
     * @param contentFilter -
     */
    private init(criteria: FindOptions) {
        this.filters = criteria.filters;
        this.contentFilter = criteria.fileContent;
        this.files = [];
        this.processing = [];

        this.negationFilter = ['**/**'];

        let fileGlob = this.filters.pattern;

        if (fileGlob.length && fileGlob.length > 0) {
            fileGlob = fileGlob as Array<string>;

            fileGlob.forEach((item, index) => {
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

        // Events
        this.on('endSearchSubDirectory', (parentDir, resolve) => {
            let stillProcessingSubdir = this.processing.findIndex(processingItem => processingItem.parentDir === parentDir) > -1;

            if (!stillProcessingSubdir) {
                this.endFileSearch(parentDir, resolve);
            }
        });
    }

    private filterFiles(dir: string, callback: any) {
        this.readDirectory(dir)
            .then(() => {
                callback();
            })
            .catch((err) => {
                callback(err);
            });
    }

    private filterFileContent(callback: any) {
        let self = this;
        let matchingFiles: Array<string> = [];

        if (this.contentFilter && this.files && this.files.length) {
            this.files.forEach((file, index) => {
                this.readFileContent(file)
                    .then((result) => {
                        if (result) {
                            matchingFiles.push(result);
                        }

                        if ((self.files.length - 1) === index) {
                            callback(null, matchingFiles);
                        }
                    }).catch(err => {
                        callback(err);
                    });
            });
        } else {
            matchingFiles = this.files;
            callback(null, matchingFiles);
        }
    }

    private readDirectory(dir: string): Promise<void> {
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

                let totalItensLista: number = list.length - 1;

                list.forEach(function (item, index) {
                    item = path.resolve(dir, item);

                    self.checkAndApplyFilters(dir, item, resolve, reject, totalItensLista, index);
                });
            });
        });
    }

    private checkAndApplyFilters(dir: string, item: string, resolve: Function, reject: Function, totalItensDir: number, indexItemAtual: number) {
        fs.stat(item, (err, stats) => {
            if (err) {
                reject(err);
            }

            if (stats.isDirectory()) {
                this.emit('initSearchSubDirectory', dir);

                this.processing.push({
                    dir: item,
                    parentDir: dir,
                    parentResolve: resolve
                });

                this.readDirectory(item);
            } else {
                if (this.matchFilters(item, stats)) {
                    this.files.push(item);
                }
            }

            if (totalItensDir === indexItemAtual) {
                let stillProcessingSubdir = this.processing.findIndex(processingItem => processingItem.parentDir === dir) > -1;

                if (!stillProcessingSubdir) {
                    this.endFileSearch(dir, resolve);
                }
            }
        });
    }

    private matchFilters(file: string, stats: fs.Stats): boolean {
        let matchFilter: boolean = true;

        // Check filename pattern
        if (this.filters.pattern) {
            matchFilter = mm(file, this.filters.pattern).length > 0;
            if (!matchFilter) {
                return false;
            }
        }

        // Check file size
        if (this.filters.size) {
            matchFilter = this.checkFilterPredicates(stats.atime, this.filters.size);
            if (!matchFilter) {
                return false;
            }
        }

        // Check last file access time
        if (this.filters.accessTime) {
            matchFilter = this.checkFilterPredicates(stats.atime, this.filters.accessTime);
            if (!matchFilter) {
                return false;
            }
        }

        // Filter by file creation time
        if (this.filters.birthTime) {
            matchFilter = this.checkFilterPredicates(stats.birthtime, this.filters.birthTime);
            if (!matchFilter) {
                return false;
            }
        }

        // Filter by file change time
        if (this.filters.changeTime) {
            matchFilter = this.checkFilterPredicates(stats.ctime, this.filters.changeTime);
            if (!matchFilter) {
                return false;
            }
        }

        return true;
    }

    private checkFilterPredicates(value: any, predicate: FilterPredicate): boolean {
        let matchFilter: boolean = false;

        switch (predicate.operator) {
            case PredicateOperator.GreaterThan:
                matchFilter = value > predicate.value || value === predicate.value;
                break;
            case PredicateOperator.LessThan:
                matchFilter = value < predicate.value || value === predicate.value;
                break;
            case PredicateOperator.Equal:
                matchFilter = value !== predicate.value;
                break;
            case PredicateOperator.NotEqual:
                matchFilter = value === predicate.value;
                break;
        }

        return matchFilter;
    }

    private endFileSearch(dir: string, resolve: any) {
        let subDir = this.processing.find(processingItem => processingItem.dir === dir);

        if (subDir) {
            let parentDir: string = subDir.parentDir;

            this.processing.splice(this.processing.indexOf(subDir), 1);

            this.emit('endSearchSubDirectory', parentDir, subDir.parentResolve);
        } else {
            let idxDir = this.processing.findIndex(processingItem => processingItem.dir === dir);

            if (idxDir > -1) {
                this.processing.splice(idxDir, 1);
            }

            this.emit('endSearchDirectory', dir);
        }

        resolve();
    }

    private readFileContent(file: string): Promise<any> {
        let self = this;

        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (this.contentFilter.test(data)) {
                    self.emit('contentMatch', file);
                    resolve(file);
                } else {
                    resolve();
                }
            });
        });
    }
}