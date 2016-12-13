/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */
import { PredicateOperator } from '../enums/predicateoperator';

/**
 * @description
 * Declares the interface to define the predicate for the file search.
 */
export interface FilterPredicate {
    /**
     * Value to be searched, can be a number, Date, string or Array<string>.
     */
    value: number | Date | string | Array<string>;
    /**
     * Operator to be applied to the value, ie.:
     * Equal, LessThan,.. as defined in {@link PredicateOperator}.
     */
    operator: PredicateOperator;
}