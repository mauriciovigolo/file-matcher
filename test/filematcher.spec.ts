import 'jasmine';
import * as path from 'path';
import { FileMatcher } from '../lib/filematcher';
import { PredicateOperator } from '../lib/enums/predicateoperator';

describe('FileMatcher Tests', function () {

    let appPath: string = path.resolve(__dirname, '../../../test/sandbox');
    let finder: FileMatcher;

    beforeAll((done) => {
        finder = new FileMatcher();
        done();
    });

    /*
     * Simple search by filename using globs.
     */
    it('Should return the .js files but not the .txt files', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: ['**/*.js', '!**/*.spec.js']
            },
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBeGreaterThan(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search without glob array
     */
    it('Should return the .txt file only', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: '**/*.txt'
            },
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBeGreaterThan(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Filter by content matching only
     */
    it('Should filter by content only', (done) => {
        finder.find({
            path: appPath,
            content: /right/i,
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBeGreaterThan(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search by filename and file content
     */
    it('Should filter .txt files and content choosealicense.com', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: ['**/*.txt']
            },
            content: /choosealicense\.com/i,
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBeGreaterThan(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search file by modified time
     */
    it('Should filter files by birth time', (done) => {
        finder.find({
            path: appPath,
            filters: {
                birthTime: {
                    value: new Date(1900, 0, 1),
                    operator: PredicateOperator.LessThan
                }
            },
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBe(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search file by modified time
     */
    it('Should filter files by modified time', (done) => {
        finder.find({
            path: appPath,
            filters: {
                modifiedTime: {
                    value: new Date(1900, 0, 1),
                    operator: PredicateOperator.LessThan
                }
            },
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBe(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search file by size, equal 0, meaning that the file
     * is empty.
     */
    it('Should find files with 0 bytes', (done) => {
        finder.find({
            path: appPath,
            filters: {
                size: {
                    value: 0,
                    operator: PredicateOperator.Equal
                }
            },
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBeGreaterThan(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search file by size, equal 0, meaning that the file
     * is empty.
     */
    it('Should find files with more than 0 bytes', (done) => {
        finder.find({
            path: appPath,
            filters: {
                size: {
                    value: 0,
                    operator: PredicateOperator.NotEqual
                }
            },
            recursiveSearch: true
        }).then(files => {
            done();
        }).catch(err => {
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Should result in error, if no filters declared.
     */
    it('Should result in error, if no filters declared.', (done) => {
        finder.find({
            path: appPath
        }).then(files => {
            expect(files.length).toBe(0);
            done();
        }).catch(err => {
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Should result in error, for reading an image file.
     */
    it('Should result in error as the directory not exists', (done) => {
        finder.find({
            path: 'directory/should/not/exists',
            filters: {
                pattern: ['**/.txt']
            }
        }).then(files => {
            expect(files.length).toBe(0);
            done();
        }).catch(err => {
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Should result in error, for reading an image file.
     */
    it('Should result in error as the encoding is not right', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: ['**/*.xml']
            },
            content: /may/i,
            recursiveSearch: true,
            fileReadOptions: { encoding: 'utf8', flag: 'w' }
        }).then(files => {
            console.log(files);
            expect(files.length).toBe(0);
            done();
        }).catch(err => {
            console.log('aqui');
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Search file by size, equal 0, meaning that the file
     * is empty.
     */
    it('Should not bring files with .txt extension', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: '!**/*.txt'
            },
            recursiveSearch: true
        }).then(files => {
            let matched: boolean = false;

            files.some(file => {
                return matched = file.indexOf('.txt') > -1;
            });

            expect(matched).toBeFalsy();
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search file by size (bytes)
     */
    it('Should filter files by size', (done) => {
        finder.find({
            path: appPath,
            filters: {
                size: {
                    operator: PredicateOperator.GreaterThan,
                    value: 10
                }
            },
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBeGreaterThan(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search file by filters and content
     */
    it('Should filter files by filters (pattern and size) and content', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: ['**/*.txt'],
                size: {
                    operator: PredicateOperator.GreaterThan,
                    value: 10
                }
            },
            content: /(lic)/i,
            recursiveSearch: true
        }).then(files => {
            expect(files.length).toBe(1);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

    /*
     * Search file not recursively
     */
    it('Should filter files not recursively', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: ['**/**', '!*.spec.js']
            },
            content: /(lic)/i,
            recursiveSearch: false
        }).then(files => {
            expect(files.length).toBe(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

});