import Items from '../models/items';
import Categories from '../models/categories';
import User from '../models/user';
import { response } from '../utils/response-enum';
import _ from 'lodash';

export async function removeItem(_id, next) {
  try {
    const removedItem = await Items.remove({_id});

    return removedItem;
  } catch (error) {
    next(error);
  }
};

export async function detailItem(_id, next) {
  try {
    const item = await Items.findOne({_id});

    if (!item) {
      return response.notFound;
    }

    const authorId = item.authorId;
    const infoAuthor = await User.findOne({_id: authorId});

    item.infoAuthor = infoAuthor;

    return item;
  } catch (error) {
    next(error);
  }
};

export async function searchItems(data, next) {
  try {
    const items = await Items.find({title: data.search});

    if (!items.length) {
      return response.notFound;
    }

    return response.success(items);
  } catch (error) {
    next(error);
  }
};

export async function loadItems(data, next) {
  const category = _.get(data, 'navigation.category', null);
  const subcategory = _.get(data, 'navigation.subcategory', null);
  const findCategory = subcategory ? subcategory : category;
  let filterParams = {
    isModerated: true,
    isActive: true
  };

  try {
    const category = await Categories.findOne({codeName: findCategory});

    if (!category) {
      return response.notFound;
    }

    const categoryId = category.categoryId;

    // set price in filter
    if ( _.get(data, 'filter.priceFrom', false) ) {
      _.set(filterParams, 'price.$gte', Number(data.filter.priceFrom));
    }
    if ( _.get(data, 'filter.priceTo', false) ) {
      _.set(filterParams, 'price.$lte', Number(data.filter.priceTo));
    }

    if (category.parentId) {
      filterParams.categoryId = categoryId;
    } else {
      filterParams.parentId = categoryId;
    }
    
    const items = await Items.find(filterParams);

    if (!items.length) {
      return response.notFound;
    }

    return response.success(items);
  } catch (error) {
    next(error);
  }
};

/**
 * createItem
 * {IItem} item - model item
 * {Object} fiels - images
 * {Object} next - middleware
 */
export async function createItem(item, fiels, next) {
  try {
    item.isActive = true;
    item.isModerated = false;
    item.images = fiels;

    const newImages = item.images.map(image => {
      return 'https://265pc.sse.codesandbox.io/' + image.path;
    });

    item.images = newImages;

    const createItem = await Items.create(item);

    if (!createItem) {
      return response.notFound;
    }

    const userId = item.authorId;
    const itemId = createItem._id;
    await User.update(
      {_id: userId},
      { $push: {'items.active': itemId} },
      { new: true }
    );

    return createItem;
    // return Items.responseItem();
  } catch (error) {
    next(error);
  }
};
