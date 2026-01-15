import { FilePermsDto } from './filePerms.dto';

export class FileDto {
  name: string;
  isDir: boolean;
  isHidden: boolean;
  filePerms: FilePermsDto;

  constructor(name: string, isDir: boolean, isHidden: boolean, filePerms: FilePermsDto) {
    this.name = name;
    this.isDir = isDir;
    this.isHidden = isHidden;
    this.filePerms = filePerms;
  }
}
