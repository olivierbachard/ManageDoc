if (sasFilters === undefined) {
    var sasFilters = angular.module('sasFilters', []);
}


// *** startFrom Filter **//
// Return a subset of the input, starting at the specified index until the end of the input
// NOTE: this filter is the opposite of the "limitTo" filter from AngularJS
sasFilters.filter('startFrom', function () {
    return function (input, start) {
        if (input != undefined && input.length > 0) {
            start = +start; //parse to int
            return input.slice(start);
        }
    }
});

// *** betwwen Filter *** //
// Combination of startFrom and limitTo filters
sasFilters.filter('between', function () {
    return function (input, start, end) {
        if (input != undefined && input.length > 0) {
            start = +start; //parse to int
            end = +end;
            return input.slice(start, end);
        }
    }
});


// *** range Filter *** //
// Alow to make loop in angular view
// Example: <div ng-repeat="n in [] | range:100">
//              do something
//          </div>
sasFilters.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});

/**
 * Filters out objects that are not equal for the specified (key, value) pairs.
 * @param [obj] { key: value, key: value, ... }
 * if the param is empty, no filtering will be performed
 * @return {array}
 */
sasFilters.filter('exactMatch', function () {
    return function (items, obj) {
        if (!angular.isArray(items) || !angular.isObject(obj))
            return items;
        if ($.isEmptyObject(obj) == true)
            return items;

        var filtered = [];
        angular.forEach(items, function (item) {
            if (!angular.isObject(item)) return;
            for (var key in obj) {
                if (!angular.equals(item[key], obj[key])) return;
            }
            filtered.push(item);
            return;
        });
        return filtered;
    };
});