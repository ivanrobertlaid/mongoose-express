export const response = {
  notFound: {
    success: false,
    items: []
  },
  success: (items) => success(items)
};

function success(items) {
  return {
    items,
    success: true
  }
}