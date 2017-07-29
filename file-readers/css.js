/*
 * Copyright 2017 Elkya <https://elkya.com/>
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by mallanic at 29/7/2017
 */

var _ = require('lodash');

var COMMENT_START = /^\s*\/\*\*/,
        COMMENT_END = /^\s*\*\//;

/**
 * This service reads CSS files and extract jsdoc styles comments.
 * It doesn't parse tags inside comments.
 */
module.exports = function cssFileReader(log) {
    return {
        name: 'cssFileReader',
        defaultPattern: /\.(css|sass|scss|less)$/,
        getDocs: function(fileInfo) {
            var isComment = false;
            var commentLines = String(fileInfo.content)
                    .trim()
                    .replace(/\r\n|\r|\n *\n/g, '\n')
                    .split('\n');

            /**
             * Reduce lines to comment blocks
             */
            fileInfo.comments = _.reduce(commentLines, function (commentBlocks, commentLine) {
                if (COMMENT_START.test(commentLine)) {
                    isComment = true;
                    commentBlocks.push(['*']);
                    return commentBlocks;
                }
                if (isComment) {
                    if (COMMENT_END.test(commentLine)) {
                        commentBlocks[commentBlocks.length - 1].push('*');
                        isComment = false;
                    } else {
                        commentBlocks[commentBlocks.length - 1].push(commentLine);
                    }
                }
                return commentBlocks;
            }, []).map(function (block) {
                return {
                    type: 'Block',
                    value: block.join('\n')
                };
            });

            return [{
                docType: 'css'
            }];
        }
    };
};
