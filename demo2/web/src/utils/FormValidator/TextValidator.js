import { isEmpty } from '@/utils';
import BaseValidator from './BaseValidator';

export default class TextValidator extends BaseValidator {
  generateValidator() {
    return function (value) {
      return isEmpty(value);
    };
  }
}
