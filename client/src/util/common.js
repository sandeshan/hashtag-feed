exports.getMaxID = next_results_str => {
  let regex = /(max_id)=(\d+)/g;
  let max_id;
  next_results_str.replace(regex, (match, code, id) => {
    max_id = id;
  });
  return max_id;
};
