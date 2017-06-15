'use strict';

exports.formatReply = function (reply) {
	var tag = reply[0];
	// req success
	if(tag == '+'){
		return reply.slice(1);
	// req error	
	}else if(tag == '-'){
		return reply.slice(1);
	// reply int
	}else if(tag == ':'){
		return reply.slice(1) - 0;
	// reply singe
	}else if(tag == '$'){
		var n = reply.slice(1) - 0;
		if (n === -1) {// 空结果
      		return null;
        } else {// 否则取后面一行作为结果
      		var line = reply.split('\r\n');
      		var second = line[1];
      		return second;
        }
	// reply multi
	}else if(tag == '*'){
		var n = reply.slice(1) - 0;
		if (n === 0) {

      		return [];
        } else {
      		var lines = reply.split('\r\n');
      		var array = [];

      		for (let i=1; i < lines.length && array.length < n; i+=2) {
	            const a = lines[i];
	            const b = lines[i + 1];
	            if (a.slice(0, 3) === '$-1') {
              		array.push(null);
	            } else if (a[0] === ':') {
              		array.push(Number(a.slice(1)));
	            } else {
              		if (typeof b !== 'undefined') {
        				array.push(b);
                		i++;
              		} else {
                		return popEmpty();
              		}
	            }
          	}
        }
	}
}