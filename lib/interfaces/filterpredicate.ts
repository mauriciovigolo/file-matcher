import { PredicateOperator } from '../enums/predicateoperator';

export interface FilterPredicate {
    value: any;
    operator: PredicateOperator;
}