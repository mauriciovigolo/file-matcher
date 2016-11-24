import 'jasmine';
import * as path from 'path';
import { FileFinder } from '../lib/filefinder';

describe('Testing FileFinder', function () {

    let appPath: string = path.resolve(__dirname);
    let finder: FileFinder;

    beforeAll((done) => {
        finder = new FileFinder();
        done();
    });

    it('Should return the .js files and not the .txt files', (done) => {
        finder.find({
            path: appPath,
            filters: {
                pattern: ['**/*.js', '!**/*.spec.js']
            },
            fileContent: /lorem/i
        }).then(files => {
            expect(files.length).toBeGreaterThan(0);
            done();
        }).catch(err => {
            console.log('Error: ', err);
            done();
        });
    });

});