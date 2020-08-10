import ValidatorBean from './ValidatorMap';

class FormValidateFactory {
  getValidator = (type) => {
    return ValidatorBean[type];
  };
}

export default new FormValidateFactory();
