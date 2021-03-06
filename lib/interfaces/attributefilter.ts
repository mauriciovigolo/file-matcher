/**
 * @license
 * Copyright Mauricio Gemelli Vigolo. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mauriciovigolo/file-matcher/LICENSE
 */
import { AttributeType } from '../enums/attributetype';
import { PredicateOperator } from '../enums/predicateoperator';

/**
 * @description
 * Declares a generic interface for filtering files by attributes.
 */
export interface AttributeFilter {
    /**
     * Attribute type, which will determine the execution flow. Examples:
     * Size, Modified Date and Birth Date.
     * @see {@link AttributeType}
     */
    type: AttributeType;
    /**
     * Value to be searched, can be a number, Date or string.
     */
    value: number | Date | string;
    /**
     * Operator to be applied to the value, ie.:
     * Equal, LessThan,.. as defined in @see {@link PredicateOperator}.
     */
    operator: PredicateOperator;
}