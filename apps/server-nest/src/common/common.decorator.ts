/* eslint-disable @typescript-eslint/ban-types */
import { SchemaOf } from 'yup';

export function UseYupSchema(schema: SchemaOf<{}>) {
  return function (constructor: Function) {
    constructor.prototype.schema = schema;
  };
}
