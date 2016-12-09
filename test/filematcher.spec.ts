import 'jasmine';
import * as path from 'path';
import { FileMatcher } from '../lib/filematcher';
import { PredicateOperator } from '../lib/enums/predicateoperator';

describe('FileMatcher Tests', function () {

    let appPath: string = path.resolve(__dirname);
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
     * Search by filename and file content
     */
    it('Should filter .txt files and content choosealicense.com', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: ['**/*.txt']
            },
            fileContent: /choosealicense\.com/i,
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
     * Search file by birth and modified time
     */
    it('Should filter files by modified time', (done) => {
        finder.find({
            path: appPath,
            filters: {
                modifiedTime: {
                    value: new Date(),
                    operator: PredicateOperator.LessThan
                },
                birthTime: {
                    value: new Date(),
                    operator: PredicateOperator.LessThan
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
            fileContent: /(lic)/i,
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
            fileContent: /(lic)/i,
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