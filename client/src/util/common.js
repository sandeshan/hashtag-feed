// utility function to parse Twitter's 'next_results_str' and extract 'max_id"
export function getMaxID(next_results_str) {
  let regex = /(max_id)=(\d+)/g;
  let max_id;
  next_results_str.replace(regex, (match, code, id) => {
    max_id = id;
  });
  return max_id;
}
