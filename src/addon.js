/**
 *
 */
class Addon {
  /**
   *
   * @param {Object} {}
   */
  constructor({
    gameVersionFlavor,
    id,
    name,
    authors,
    fileData,
    downloadUrl,
    date,
    fileName,
    versionName,
  }) {
    this.gameVersionFlavor = gameVersionFlavor;
    this.id = id;
    this.name = name;
    this.authors = authors;
    this.fileData = fileData;
    this.downloadUrl = downloadUrl;
    this.date = new Date(date);
    (this.fileName = fileName), (this.versionName = versionName);
  }

  /**
   *
   * @param {Object} {}
   * @return {Addon}
   */
  static initFromJSON({
    id,
    name,
    authors,
    latestFiles,
    gameVersionLatestFiles,
  }) {
    const fileData = Addon.extractLatestFileData(
      latestFiles,
      gameVersionLatestFiles,
    );
    return new Addon({
      gameVersionFlavor: 'wow_classic',
      id: id,
      name: name,
      authors: authors,
      fileData: fileData,
      downloadUrl: fileData.downloadUrl,
      date: new Date(fileData.fileDate),
      fileName: fileData.fileName,
      versionName: fileData.displayName,
    });
  }

  /**
   *
   * @param {Array} latestFiles
   * @param {Array} gameVersionLatestFiles
   * @return {Object}
   */
  static extractLatestFileData(latestFiles, gameVersionLatestFiles) {
    const gameVersionLatestFileData = gameVersionLatestFiles.find(
      (fileData) => fileData.gameVersionFlavor === 'wow_classic',
    );
    const latestFileData = latestFiles.find(
      (fileData) =>
        fileData.fileName === gameVersionLatestFileData.projectFileName,
    );

    return latestFileData;
  }

  /**
   * @return {Integer}
   */
  getId() {
    return this.id;
  }

  /**
   * @return {String}
   */
  getName() {
    return this.name;
  }

  /**
   * @return {[String]}
   */
  getAuthors() {
    return this.authors;
  }

  /**
   * @return {Object}
   */
  getFileData() {
    return this.fileData;
  }

  /**
   * @return {String}
   */
  getVersionName() {
    return this.versionName;
  }

  /**
   * @return {String}
   */
  getDownloadUrl() {
    return this.downloadUrl;
  }

  /**
   * @return {String}
   */
  getFileName() {
    return this.fileName;
  }

  /**
   * @return {Date}
   */
  getDate() {
    return this.date;
  }
}
module.exports = Addon;
