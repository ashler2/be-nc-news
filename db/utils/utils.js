exports.formatDate = list => {
  return list.map(item => {
    return { ...item, created_at: new Date(item.created_at) };
    // item.created_at = new Date(item.created_at);
  });
};

exports.makeRefObj = (list, idName, rowName) => {
  return list.reduce((refs, row) => {
    refs[row[rowName]] = row[idName];
    return refs;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  const changeKey = function(list, keyToChange, newKey) {
    const newList = [...list];
    newList.forEach(function(item) {
      item[newKey] = item[keyToChange];
      delete item[keyToChange];
    });
    return newList;
  };
  changeKey(comments, "belongs_to", "article_id");
  changeKey(comments, "created_by", "author");

  return comments.map(({ article_id, ...restOfData }) => {
    return { ...restOfData, article_id: articleRef[article_id] };
  });
};
