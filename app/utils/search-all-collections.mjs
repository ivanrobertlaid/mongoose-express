import mongoose from 'mongoose';
import convertItemOfSearch from './convert-items';


const models = [
  mongoose.models.electronics,
  mongoose.models.myThings
];

/**
 * 
 */
function searchFromAllCollections(searchOptions = {}) {
  return Promise.all(
    models.map(model => {
      return model.find(
        {},
        searchOptions
      )
    })
  )
  .then(resultArray => convertItemOfSearch(resultArray))
  .catch(error => console.log(error))
};

export default searchFromAllCollections;
