import _ from 'lodash';

/**
 * merge list items from another collerctions in one list of search
 * @param {Array} arr array
 */
function convertItemOfSearch(arr = []) {
  const newArray = [];

  arr.map(res => {
    if (res.list[0]) {
      newArray.push(res.list[0]);
    }
  });

  const n = _.map(arr, 'list');
  console.log(n);

  return newArray;
};

export default convertItemOfSearch;