function range(length: number, from = 1) {
  return Array.from({ length }, (_, i) => i + from);
}

export function pager(page: number, totalPage: number) {
  if (totalPage < 9) {
    return range(totalPage);
  } else if (page < 5) {
    return [1, 2, 3, 4, 5, 6, 7, null, totalPage];
  } else if (page > 4 && page < totalPage - 4) {
    return [
      1,
      null,
      page - 2,
      page - 1,
      page,
      page + 1,
      page + 2,
      null,
      totalPage,
    ];
  } else {
    return [
      1,
      null,
      totalPage - 6,
      totalPage - 5,
      totalPage - 4,
      totalPage - 3,
      totalPage - 2,
      totalPage - 1,
      totalPage,
    ];
  }
}
