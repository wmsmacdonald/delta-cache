'use strict';

const diff_match_patch = require('./diff_match_patch');
const diff = new diff_match_patch.diff_match_patch();
const uuid = require('node-uuid');

/**
 *  Can call as function or use new
 * @returns {TextHistory}
 * @constructor
 */
function TextHistory() {
  if (!(this instanceof TextHistory)){
    return new TextHistory;
  }
  this.originalText = '';
  this.lastVersion = '';
  this.patchesList = [];
  this.idsMappedToIndexes = {};
  return this;
}

/**
 *
 * @param text {string} text to create a version for
 * @returns {string}    id of new version
 */
TextHistory.prototype.addVersion = function(text) {
  let patches = diff.patch_make(this.lastVersion, text);
  this.lastVersion = text;
  let length = this.patchesList.push(patches);
  let id = uuid.v4();
  this.idsMappedToIndexes[id] = length - 1;
  return id;
};

/**
 *
 * @param id {string} version id returned in .addVersion()
 * @returns {string}  text of version with given id
 */
TextHistory.prototype.getVersion = function(id) {
  let index = this.idsMappedToIndexes[id];
  let patchesList = this.patchesList.slice(0, index + 1);
  return patchesList.reduce((text, patches) => diff.patch_apply(patches, text)[0], this.originalText);
};

/**
 *
 * @param id  version id that you want to transform to latest
 * @returns {!Array.<!diff_match_patch.patch_obj>}  patch to transform
 */
TextHistory.prototype.getPatches = function(id) {
  let text = this.getVersion(id);
  return diff.patch_make(text, this.lastVersion);
};

module.exports = TextHistory;