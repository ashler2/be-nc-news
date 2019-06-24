exports.formatDate = list => {
  list.forEach(item => {
    item.created_at = new Date(item.created_at).toString();
  });
  return list;
};

exports.makeRefObj = list => {
  return rows.reduce((refs, row) => {
    refs[row[rowName]] = row[idName];
    return refs;
  }, {});
};

exports.formatComments = (comments, articleRef) => {};
