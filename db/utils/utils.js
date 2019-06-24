exports.formatDate = list => {
  list.forEach(item => {
    item.created_at = new Date(item.created_at).toString();
  });
  return list;
};

exports.makeRefObj = list => {
  const reference = [];
  list.forEach(item => {
    const ref = { [item.title]: item.article_id };
    console.log(ref);
    reference.push(ref);
  });
  return reference;
};

exports.formatComments = (comments, articleRef) => {};
