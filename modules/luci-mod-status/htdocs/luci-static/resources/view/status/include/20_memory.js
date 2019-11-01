'use strict';
'require rpc';

var callSystemInfo = rpc.declare({
	object: 'system',
	method: 'info'
});

function progressbar(value, max, byte) {
	var vn = parseInt(value) || 0,
	    mn = parseInt(max) || 100,
	    fv = byte ? String.format('%1024.2mB', value) : value,
	    fm = byte ? String.format('%1024.2mB', max) : max,
	    pc = Math.floor((100 / mn) * vn);

	return E('div', {
		'class': 'cbi-progressbar',
		'title': '%s / %s (%d%%)'.format(fv, fm, pc)
	}, E('div', { 'style': 'width:%.2f%%'.format(pc) }));
}

return L.Class.extend({
	title: _('Memory'),

	load: function() {
		return L.resolveDefault(callSystemInfo(), {});
	},

	render: function(systeminfo) {
		var mem = L.isObject(systeminfo.memory) ? systeminfo.memory : {},
		    swap = L.isObject(systeminfo.swap) ? systeminfo.swap : {};

		var fields = [
			_('Total Available'), (mem.total && mem.free && mem.buffered) ? mem.free + mem.buffered : null,
			_('Free'),            (mem.total && mem.free) ? mem.free : null,
			_('Buffered'),        (mem.total && mem.buffered) ? mem.buffered : null
		];

		if (swap.total > 0)
			fields.push(_('Swap free'), swap.free);

		var table = E('div', { 'class': 'table' });

		for (var i = 0; i < fields.length; i += 2) {
			table.appendChild(E('div', { 'class': 'tr' }, [
				E('div', { 'class': 'td left', 'width': '33%' }, [ fields[i] ]),
				E('div', { 'class': 'td left' }, [
					(fields[i + 1] != null) ? progressbar(fields[i + 1], mem.total, true) : '?'
				])
			]));
		}

		return table;
	}
});