import _ from 'lodash';
import inputSearcher from './input';
import numberSearcher from './number';
import selectSearcher from './select';
import ylSelectSearcher from './ylSelect';
import datePickerSearcher from './datePicker';
import rangePickerSearcher from './rangePicker';
import rangerNumberSearcher from './rangeNumber';
import customSearcher from './custom';

export default function (type) {
  type = type || 'input';

  if (_.isObject(type)) {
    // type = 'custom';
    return customSearcher;
  }

  var factory = {
    input: inputSearcher,
    number: numberSearcher,
    select: selectSearcher,
    ylSelect: ylSelectSearcher,
    // treeSelect: treeSelectSearcher, //暂时不支持
    datePicker: datePickerSearcher,
    rangePicker: rangePickerSearcher,
    rangeNumber: rangerNumberSearcher,
    custom: customSearcher
  };

  return factory[type];
}

export {
  inputSearcher,
  numberSearcher,
  selectSearcher,
  ylSelectSearcher,
  datePickerSearcher,
  rangePickerSearcher,
  customSearcher
};
