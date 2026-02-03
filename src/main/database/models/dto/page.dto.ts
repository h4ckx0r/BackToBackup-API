export class PageDto<T> {
  readonly data: T[];
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly totalElements: number;
  readonly totalPages: number;

  constructor(data: T[], pageNumber: number, pageSize: number, totalElements: number, totalPages: number) {
    this.data = data;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
}
