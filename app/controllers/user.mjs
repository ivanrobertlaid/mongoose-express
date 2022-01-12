import User from '../models/user';
import Items from '../models/items';
import uniqid from 'uniqid';
import passport from 'passport';
import jwt from 'jsonwebtoken';

export async function signUp(user, next) {
  let userInstanse = new User();

  userInstanse.email = user.email;
  userInstanse.setPassword(user.password);
  userInstanse.username = `user ${user.email}`;
  userInstanse.avatar = 'https://static.productionready.io/images/smiley-cyrus.jpg';
  userInstanse.phone = null;
  userInstanse.items = {
    active: [],
    closed: [] 
  };

  try {
    const newUser = await userInstanse.save();

    return {
      user: newUser.toAuthJSON(),
      success: true
    };
  } catch (error) {
    next(error);
  }
};

export async function getInfo(username, next) {
  try {
    const user = await User.findOne({username});

    if (!user) {
      return new Error(401);
    };

    const findedActiveItems = await Items.find(
      {_id: user.items.active, isModerated: true}
    );
    const findedClosedItems = await Items.find(
      {_id: user.items.closed, isModerated: true}
    );
    const activeItems = findedActiveItems.map(item => item.isActive = true);
    const closedItems = findedClosedItems.map(item => item.isActive = false);

    user.items.active = activeItems;
    user.items.closed = closedItems;

    return {
      user: user.toAuthJSON(),
      success: true
    };
  } catch (error) {
    next(error);
  }
};

export async function update(data, next) {

  try {
    const user = await User.findById(data._id);

    if (!user) {
      return new Error(401);
    };

    if (data.username) {
      user.username = data.username;
    }
    if (data.password) {
      user.setPassword(data.password);
    }
    if (data.avatar) {
      user.avatar = data.avatar;
    }
    if (data.items) {
      user.items.active = data.items.active;
      user.items.closed = data.items.closed;
    }

    user.save();

    // get items on ids
    const findedActiveItems = await Items.find(
      {_id: user.items.active, isModerated: true}
    );
    const findedClosedItems = await Items.find(
      {_id: user.items.closed, isModerated: true}
    );
    const activeItems = findedActiveItems.map(item => item.isActive = true);
    const closedItems = findedClosedItems.map(item => item.isActive = false);

    user.items.active = activeItems;
    user.items.closed = closedItems;
    
    return {
      user: user.toAuthJSON(),
      success: true
    };
  } catch (error) {
    next(error);
  }
};