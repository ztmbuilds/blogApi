const { Op } = require('sequelize');

const apiFeatures = (queryString) => {
  const { page, pageSize, sort, attributes, ...filters } = queryString;

  //Pagination
  const offset = (page - 1) * pageSize || 0;
  const limit = pageSize * 1 || 100;

  //filtering
  let selectedAttributes;
  if (attributes) {
    selectedAttributes = attributes.split(',');
  }
  //Advanced filtering
  const whereClause = {};
  Object.keys(filters).forEach((key) => {
    const match = key.match(/^(.+?)_(gt|gte|lt|lte)$/);
    if (match) {
      const [matchedString, field, operator] = match;
      whereClause[field] = {
        [Op[operator]]: filters[key],
      };
    }
  });

  //Ordering
  let order = [];
  if (sort) {
    const sortFields = sort.split(',');
    sortFields.forEach((sortField) => {
      const [field, orderType] = sortField.split(':');
      order.push([field, orderType.toUpperCase()]);
    });
  } else {
    order.push(['createdAt', 'DESC']);
  }

  return { whereClause, order, offset, limit, selectedAttributes };
};

module.exports = apiFeatures;
