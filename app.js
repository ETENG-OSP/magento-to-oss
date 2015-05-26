#!/usr/bin/env node

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    database: 'magento'
  }
});

var tableName = 'catalog_product_entity_text';
var conditions = {
  value_id: 5
};
var columnName = 'value';

var template = 'http://ecpmedia.oss.com/$1';
var filter = /{{media.*url="(.*)"}}/;

module.exports = magentoToOss;

// magentoToOss('catalog_product_entity_text', {
//   value_id: 5
// }, 'value').then(function () {
//   console.log(arguments);
// });

/**
 * 将 magento 中静态块对 media 地址的引用更换为 oss 的地址
 * @param  String  tableName  表名
 * @param  Object  conditions 查询条件
 * @param  String  columnName 修改的字段名
 * @return Promise            当操作完成后的 Promise
 */
function magentoToOss(tableName, conditions, columnName) {

  return knex.select(columnName)
    .from(tableName)
    .where(conditions)
    .then(function (results) {
      console.log(results[0]);
      var newStr = results[0][columnName].replace(filter, template);
      var updateData = {};
      updateData[columnName] = newStr;
      return knex(tableName)
        .where(conditions)
        .update(updateData);
    });
}
