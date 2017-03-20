import 'jasmine';
import * as path from 'path';
import { FileMatcher } from '../lib/filematcher';
import { PredicateOperator } from '../lib/enums/predicateoperator';
import { AttributeType } from '../lib/enums/attributetype';

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
            fileFilter: {
                fileNamePattern: ['**/*.js', '!**/*.spec.js']
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
            fileFilter: {
                fileNamePattern: '**/*.txt'
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
            fileFilter: {
                content: /right/i
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
     * Search by filename and file content
     */
    it('Should filter .txt files and content choosealicense.com', (done) => {
        finder.find({
            path: appPath,
            fileFilter: {
                fileNamePattern: ['**/*.txt'],
                content: /choosealicense\.com/i,
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
     * Search file by modified time
     */
    it('Should filter files by birth time', (done) => {
        finder.find({
            path: appPath,
            fileFilter: {
                attributeFilters: [
                    {
                        type: AttributeType.BirthDate,
                        value: new Date(1900, 0, 1),
                        operator: PredicateOperator.LessThan
                    }
                ]
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
            fileFilter: {
                attributeFilters: [
                    {
                        type: AttributeType.ModifiedDate,
                        value: new Date(1900, 0, 1),
                        operator: PredicateOperator.LessThan
                    }
                ]
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
            fileFilter: {
                attributeFilters: [
                    {
                        type: AttributeType.Size,
                        value: 0,
                        operator: PredicateOperator.Equal
                    }
                ]
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
            fileFilter: {
                attributeFilters: [
                    {
                        type: AttributeType.Size,
                        value: 0,
                        operator: PredicateOperator.NotEqual
                    }
                ]
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
     * Should result in error, if filter is undefined
     */
    it('Should result in error, if filter is undefined', (done) => {
        finder.find({
            path: appPath,
            fileFilter: undefined
        }).then(files => {
            expect('It shouldnt be here!').toBeUndefined();
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
            path: appPath,
            fileFilter: {}
        }).then(files => {
            expect('It shouldnt be here!').toBeUndefined();
            done();
        }).catch(err => {
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Should result in error, if the path is a clear string
     */
    it('Should result in error, if the path is a clear string', (done) => {
        finder.find({
            path: '',
            fileFilter: {}
        }).then(files => {
            expect('It shouldnt be here!').toBeUndefined();
            done();
        }).catch(err => {
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Should result in error, if the path is a string with spaces.
     */
    it('Should result in error, if the path is a string with spaces.', (done) => {
        finder.find({
            path: ' ',
            fileFilter: {
                fileNamePattern: ['**/*.js']
            }
        }).then(files => {
            expect('It shouldnt be here!').toBeUndefined();
            done();
        }).catch(err => {
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Should result in error, if there is no attribute filters and content regex.
     */
    it('Should result in error, if there is no attribute filters and content regex.', (done) => {
        finder.find({
            path: appPath,
            fileFilter: {
                attributeFilters: []
            }
        }).then(files => {
            expect('It shouldnt be here!').toBeUndefined();
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
            fileFilter: {
                fileNamePattern: ['**/.txt']
            },
        }).then(files => {
            expect('It shouldnt be here!').toBeUndefined();
            done();
        }).catch(err => {
            expect(err).toBeDefined();
            done();
        });
    });

    /*
     * Should result in error, for reading an xml file without write permission.
     */
    it('Should result in error for the lack of write permission.', (done) => {
        finder.find({
            path: appPath,
            fileFilter: {
                fileNamePattern: ['**/*.xml'],
                content: /may/i,
                fileReadOptions: { encoding: 'utf8', flag: 'w' }
            },
            recursiveSearch: true,
        }).then(files => {
            console.log(files);
            expect(files.length).toBe(0);
            done();
        }).catch(err => {
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
            fileFilter: {
                fileNamePattern: '!**/*.txt'
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
     * Search file by size (bytes), testing the GreaterThan operator.
     */
    it('Should filter files by size, testing the GreaterThan operator.', (done) => {
        finder.find({
            path: appPath,
            fileFilter: {
                attributeFilters: [
                    {
                        type: AttributeType.Size,
                        value: 10,
                        operator: PredicateOperator.GreaterThan
                    }
                ]
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
            fileFilter: {
                fileNamePattern: ['**/*.txt'],
                content: /(lic)/i,
                attributeFilters: [
                    {
                        type: AttributeType.Size,
                        value: 10,
                        operator: PredicateOperator.GreaterThan
                    }
                ]
            },
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
            fileFilter: {
                fileNamePattern: ['**/**', '!*.spec.js'],
                content: /(lic)/i
            },
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