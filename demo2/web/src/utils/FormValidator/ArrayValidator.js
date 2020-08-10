import { isEmpty } from '@/utils';
import BaseValidator from './BaseValidator';

export default class ArrayValidator extends BaseValidator {
  generateValidator() {
    return function (value = []) {
      return value.length === 0;
    };
  }
}
