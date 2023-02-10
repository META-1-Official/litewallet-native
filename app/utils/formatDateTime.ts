const formatDateTime = (date: string) => {
  const time = new Date(date);
  const year = time.getFullYear();
  const mm = time.getMonth();
  const dd = time.getDay();
  const hh = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();
  return `${year}-${mm}-${dd} ${hh}:${min}:${sec}`;
};

export default formatDateTime;
