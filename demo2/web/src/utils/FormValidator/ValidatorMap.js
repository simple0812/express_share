import TextValidator from './TextValidator';
import ArrayValidator from './ArrayValidator';

export default {
  TextValidator: new TextValidator().generateValidator(),
  ArrayValidator: new ArrayValidator().generateValidator()
};
