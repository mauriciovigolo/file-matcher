import { AttributeType } from '../enums/attributetype';
import { FilterPredicate } from './filterpredicate';

export interface AttributeFilter {

    predicate: FilterPredicate;
    type: AttributeType;

}