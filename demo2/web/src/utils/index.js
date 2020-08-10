import moment from 'moment';
import axios from 'axios';

export const getDefaultValue = (source, defaultValue) => {
  if (source === null || source === undefined || source === '') {
    return defaultValue;
  }
  return source;
};

export const convertTreeData = (source = []) => {
  source.map((item) => {
    if (item.isLeaf === undefined && item.leaf !== undefined) {
      item.isLeaf = item.leaf;
    }
    if (item.children && item.children.length > 0) {
      item.isLeaf = true;
      return convertTreeData(item.children);
    }
    return item;
  });
  return source;
};

export const isEmpty = (str) => {
  return str === null || str === '' || str === undefined;
};

/**
 * 格式化时间戳为标准时间
 * @param {Number} timestamp 时间戳
 * @param {String} format 格式化方式
 */
export const timestampFormat = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (isEmpty(timestamp)) {
    return '';
  }
  if (isNaN(Number(timestamp))) {
    return timestamp;
  }
  return moment(Number(timestamp)).format(format);
};

/**
 * 格式化一天内时间，分钟数转化为具体时间
 * @param {*} time
 */
export const min2Date = (time) => {
  if (isNaN(Number(time))) {
    return 'invalid time';
  }
  time = Number(time);
  if (time !== Math.floor(time)) {
    return 'time must be Integer';
  }
  if (time > 60 * 24) {
    return 'time must be less than one day(60 * 24)';
  }
  let hour = Math.floor(time / 60);
  let min = time % 60;
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  return `${hour}:${min}`;
};

export const debounce = (fn, wait) => {
  var timeout = null;
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, wait);
  };
};

export const getFileName = (url) => {
  let path = url.split('?')[0];
  return path.split(/[\\/]/gi).slice(-1)[0];
};

export const downloadFile = (url, name, params) => {
  let fileNname = name;
  if (!name) {
    fileNname = getFileName(url);
  }

  let headers = {};
  if (window.authToken) {
    headers.Authorization = `Bearer ${window.authToken}`;
  }
  axios
    .get(url, {
      responseType: 'blob', //重要
      params: { _cache: Date.now(), ...params },
      headers
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileNname);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
};
