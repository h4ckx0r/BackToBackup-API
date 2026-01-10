export class FilePermsDto {
  canRead: boolean;
  canWrite: boolean;
  canExecute: boolean;

  constructor(canRead: boolean, canWrite: boolean, canExecute: boolean) {
    this.canRead = canRead;
    this.canWrite = canWrite;
    this.canExecute = canExecute;
  }
}
