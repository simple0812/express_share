// 基准生成策略
export const BENCHMARK_STRATEGY = [
  {
    label: '近7日平均值',
    value: 1
  },
  {
    label: '近一月平均值',
    value: 3
  },
  {
    label: '自定义阀值',
    value: 4
  },
  {
    label: '指定时间段阀值',
    value: 5
  }
];
// 时间粒度
export const TIME_GRANULARITY = [
  // {
  //     label: "每10分钟",
  //     value: 10
  // },
  // {
  //     label: "每半小时",
  //     value: 30
  // },
  {
    label: '每小时',
    value: 60
  }
];
// 上限报警
export const CAP_DEFAULT_VALUE = [
  {
    label: '10%',
    value: 0.1
  },
  {
    label: '20%',
    value: 0.2
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '100%',
    value: 1
  }
];

// 下限报警
export const LOWER_DEFAULT_VALUE = [
  {
    label: '-10%',
    value: 0.1
  },
  {
    label: '-20%',
    value: 0.2
  },
  {
    label: '-50%',
    value: 0.5
  },
  {
    label: '-100%',
    value: 1
  }
];

export const getSystemParamLabel = (systemParam = [], value) => {
  const result = systemParam.find((item) => item.value === value);
  if (result) {
    return result.label;
  }
  return '--';
};
