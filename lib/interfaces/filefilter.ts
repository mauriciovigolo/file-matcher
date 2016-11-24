import { FilterPredicate } from './filterpredicate';

export interface FileFilter {
    pattern?: string | Array<string>;
    size?: FilterPredicate;
    accessTime?: FilterPredicate;
    changeTime?: FilterPredicate;
    birthTime?: FilterPredicate;
}