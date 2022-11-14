// @ts-nocheck
$(document).ready(function () {
	$('.currency').blur(calculateTotal);
	calculateTotal()

	function calculateTotal() {
		$('.gf-in-16').val(
			getNum($('.gf-in-14').val()) *
			getNum($('.gf-in-15').val()) / 100
		)
		$('.gf-in-19').val(
			getNum($('.gf-in-17').val()) *
			getNum($('.gf-in-18').val()) / 100
		)
		$('.gf-in-22').val(
			getNum($('.gf-in-20').val()) *
			getNum($('.gf-in-21').val()) / 100
		)
		$('.gf-in-31').val(
			getNum($('.gf-in-29').val()) *
			getNum($('.gf-in-30').val()) / 100
		)
		$('.gf-in-34').val(
			getNum($('.gf-in-32').val()) *
			getNum($('.gf-in-33').val()) / 100
		)
		$('.gf-in-37').val(
			getNum($('.gf-in-35').val()) *
			getNum($('.gf-in-36').val()) / 100
		)
		$('.gf-in-40').val(
			getNum($('.gf-in-16').val()) +
			getNum($('.gf-in-19').val()) +
			getNum($('.gf-in-22').val()) +
			getNum($('.gf-in-24').val()) +
			getNum($('.gf-in-26').val()) +
			getNum($('.gf-in-28').val()) +
			getNum($('.gf-in-31').val()) +
			getNum($('.gf-in-34').val()) +
			getNum($('.gf-in-37').val()) +
			getNum($('.gf-in-39').val())
		)
		$('.gf-in-58').val(
			getNum($('.gf-in-42').val()) +
			getNum($('.gf-in-44').val()) +
			getNum($('.gf-in-46').val()) +
			getNum($('.gf-in-48').val()) +
			getNum($('.gf-in-50').val()) +
			getNum($('.gf-in-52').val()) +
			getNum($('.gf-in-54').val()) +
			getNum($('.gf-in-55').val()) +
			getNum($('.gf-in-56').val()) +
			getNum($('.gf-in-57').val())
		)
		$('.gf-in-59').val(
			getNum($('.gf-in-40').val()) -
			getNum($('.gf-in-58').val())
		)
		$('.gf-in-158').val(
			getNum($('.gf-in-59').val()) +
			getNum($('.gf-in-144').val()) +
			getNum($('.gf-in-157').val())
		)
		$('.gf-in-160').val(
			getNum($('.gf-in-158').val()) *
			getNum($('.gf-in-159').val()) / 100
		)
		$('.gf-in-166').val(
			getNum($('.gf-in-160').val()) +
			getNum($('.gf-in-161').val()) -
			getNum($('.gf-in-162').val()) +
			getNum($('.gf-in-165').val())
		)
		$('.gf-in-168').val(
			getNum($('.gf-in-166').val()) -
			getNum($('.gf-in-167').val())
		)
		$('.gf-in-income-pos').val(
			parseFloat($('.gf-in-168').val()) > 0 ? parseFloat($('.gf-in-168').val()) : 0
		)
		$('.gf-in-income-neg').val(
			parseFloat($('.gf-in-168').val()) < 0 ? Math.abs(parseFloat($('.gf-in-168').val())) : 0
		)
		$('.gf-in-income-zero').prop('checked', parseFloat($('.gf-in-168').val()) === 0)
		$('.currency').formatCurrency();
	}

	function getNum(str) {
		return str && parseFloat(str) && !isNaN(parseFloat(str)) ? Number(parseFloat(str).toFixed(2)) : 0
	}

});
$(document).on("wheel", "input[type=number]", function (e) {
	$(this).blur();
});

(function ($) {

	$.formatCurrency = {};

	$.formatCurrency.regions = [];

	// default Region is en
	$.formatCurrency.regions[''] = {
		symbol: '',
		positiveFormat: '%s%n',
		negativeFormat: '-%s%n',
		decimalSymbol: '.',
		digitGroupSymbol: '',
		groupDigits: false
	};

	$.fn.formatCurrency = function (destination, settings) {

		if (arguments.length == 1 && typeof destination !== "string") {
			settings = destination;
			destination = false;
		}

		// initialize defaults
		var defaults = {
			name: "formatCurrency",
			colorize: false,
			region: '',
			global: true,
			roundToDecimalPlace: 2, // roundToDecimalPlace: -1; for no rounding; 0 to round to the dollar; 1 for one digit cents; 2 for two digit cents; 3 for three digit cents; ...
			eventOnDecimalsEntered: false
		};
		// initialize default region
		defaults = $.extend(defaults, $.formatCurrency.regions['']);
		// override defaults with settings passed in
		settings = $.extend(defaults, settings);

		// check for region setting
		if (settings.region.length > 0) {
			settings = $.extend(settings, getRegionOrCulture(settings.region));
		}
		settings.regex = generateRegex(settings);

		return this.each(function () {
			$this = $(this);

			// get number
			var num = '0';
			num = $this[$this.is('input, select, textarea') ? 'val' : 'html']();

			//identify '(123)' as a negative number
			if (num.search('\\(') >= 0) {
				num = '-' + num;
			}

			if (num === '' || (num === '-' && settings.roundToDecimalPlace === -1)) {
				return;
			}

			// if the number is valid use it, otherwise clean it
			if (isNaN(num)) {
				// clean number
				num = num.replace(settings.regex, '');

				if (num === '' || (num === '-' && settings.roundToDecimalPlace === -1)) {
					return;
				}

				if (settings.decimalSymbol != '.') {
					num = num.replace(settings.decimalSymbol, '.');  // reset to US decimal for arithmetic
				}
				if (isNaN(num)) {
					num = '0';
				}
			}

			// evalutate number input
			var numParts = String(num).split('.');
			var isPositive = (num == Math.abs(num));
			var hasDecimals = (numParts.length > 1);
			var decimals = (hasDecimals ? numParts[1].toString() : '0');
			var originalDecimals = decimals;

			// format number
			num = Math.abs(numParts[0]);
			num = isNaN(num) ? 0 : num;
			if (settings.roundToDecimalPlace >= 0) {
				decimals = parseFloat('1.' + decimals); // prepend "0."; (IE does NOT round 0.50.toFixed(0) up, but (1+0.50).toFixed(0)-1
				decimals = decimals.toFixed(settings.roundToDecimalPlace); // round
				if (decimals.substring(0, 1) == '2') {
					num = Number(num) + 1;
				}
				decimals = decimals.substring(2); // remove "0."
			}
			num = String(num);
			if (settings.groupDigits) {
				for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
					num = num.substring(0, num.length - (4 * i + 3)) + settings.digitGroupSymbol + num.substring(num.length - (4 * i + 3));
				}
			}

			if ((hasDecimals && settings.roundToDecimalPlace == -1) || settings.roundToDecimalPlace > 0) {
				num += settings.decimalSymbol + decimals;
			}
			// format symbol/negative
			var format = isPositive ? settings.positiveFormat : settings.negativeFormat;
			var money = format.replace(/%s/g, settings.symbol);
			money = money.replace(/%n/g, num);

			// setup destination
			var $destination = $([]);
			if (!destination) {
				$destination = $this;
			} else {
				$destination = $(destination);
			}
			// set destination
			$destination[$destination.is('input, select, textarea') ? 'val' : 'html'](money);

			if (
				hasDecimals &&
				settings.eventOnDecimalsEntered &&
				originalDecimals.length > settings.roundToDecimalPlace
			) {
				$destination.trigger('decimalsEntered', originalDecimals);
			}

			// colorize
			if (settings.colorize) {
				$destination.css('color', isPositive ? 'black' : 'red');
			}
		});
	};

	// Remove all non numbers from text
	$.fn.toNumber = function (settings) {
		var defaults = $.extend({
			name: "toNumber",
			region: '',
			global: true
		}, $.formatCurrency.regions['']);

		settings = jQuery.extend(defaults, settings);
		if (settings.region.length > 0) {
			settings = $.extend(settings, getRegionOrCulture(settings.region));
		}
		settings.regex = generateRegex(settings);

		return this.each(function () {
			var method = $(this).is('input, select, textarea') ? 'val' : 'html';
			$(this)[method]($(this)[method]().replace('(', '(-').replace(settings.regex, ''));
		});
	};

	// returns the value from the first element as a number
	$.fn.asNumber = function (settings) {
		var defaults = $.extend({
			name: "asNumber",
			region: '',
			parse: true,
			parseType: 'Float',
			global: true
		}, $.formatCurrency.regions['']);
		settings = jQuery.extend(defaults, settings);
		if (settings.region.length > 0) {
			settings = $.extend(settings, getRegionOrCulture(settings.region));
		}
		settings.regex = generateRegex(settings);
		settings.parseType = validateParseType(settings.parseType);

		var method = $(this).is('input, select, textarea') ? 'val' : 'html';
		var num = $(this)[method]();
		num = num ? num : "";
		num = num.replace('(', '(-');
		num = num.replace(settings.regex, '');
		if (!settings.parse) {
			return num;
		}

		if (num.length == 0) {
			num = '0';
		}

		if (settings.decimalSymbol != '.') {
			num = num.replace(settings.decimalSymbol, '.');  // reset to US decimal for arthmetic
		}

		return window['parse' + settings.parseType](num);
	};

	function getRegionOrCulture(region) {
		var regionInfo = $.formatCurrency.regions[region];
		if (regionInfo) {
			return regionInfo;
		}
		else {
			if (/(\w+)-(\w+)/g.test(region)) {
				var culture = region.replace(/(\w+)-(\w+)/g, "$1");
				return $.formatCurrency.regions[culture];
			}
		}
		// fallback to extend(null) (i.e. nothing)
		return null;
	}

	function validateParseType(parseType) {
		switch (parseType.toLowerCase()) {
			case 'int':
				return 'Int';
			case 'float':
				return 'Float';
			default:
				throw 'invalid parseType';
		}
	}

	function generateRegex(settings) {
		if (settings.symbol === '') {
			return new RegExp("[^\\d" + settings.decimalSymbol + "-]", "g");
		}
		else {
			var symbol = settings.symbol.replace('$', '\\$').replace('.', '\\.');
			return new RegExp(symbol + "|[^\\d" + settings.decimalSymbol + "-]", "g");
		}
	}

})(jQuery);