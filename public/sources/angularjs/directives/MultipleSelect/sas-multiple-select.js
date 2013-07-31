if (sasDirectives === undefined) {
    var sasDirectives = angular.module('sasDirectives', []);
}

sasDirectives.directive("sasMultipleSelect", ['$rootScope', '$filter', '$timeout', function ($rootScope, $filter, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Admin/libjs/angularjs/directives/MultipleSelect/sas-multiple-select.html',
        scope: {
            options: "=",
            onAddItem: "&",
            onRemoveItem: "&"
        },
        controller: ['$scope', function ($scope) {

            // Update the parent list when the sourceItems array change
            $scope.$watch('options.sourceItems', function (value, oldValue) {

                if (value != undefined && value.length > 0 && value.length > oldValue.length) {
                    // Build the parent list
                    if ($scope.options.groupByParent == true && value[0].parentName != undefined) {
                        var tempList = angular.copy($scope.parentList);
                        for (var i = 0; i < value.length; i++) {
                            var isParentPresent = false;
                            // Add parent if not already added
                            for (var j = 0; j < tempList.length; j++) {
                                if (value[i].parentName == tempList[j].Name) {
                                    isParentPresent = true;
                                    break;
                                }
                            }
                            if (!isParentPresent)
                                tempList.push({ Name: value[i].parentName, expanded: true });
                        }
                        $scope.parentList = tempList.sort();
                        // make a copy because we need to handle the expanded properties separatly
                        $scope.selectedParentList = angular.copy($scope.parentList);
                    }
                }

                $timeout(function () {
                    $rootScope.$broadcast('nicescrollResizeEvent');
                });

            }, true);

            $scope.$watch('options.selectedItems', function (value) {

                // Check if parent list is complete
                for (var i = 0; i < value.length; i++) {
                    var isPresent = false;
                    for (var j = 0; j < $scope.parentList.length; j++) {
                        if (value[i].parentName == $scope.parentList[j].Name) {
                            isPresent = true;
                            break;
                        }
                    }
                    // if the parent is not present in the list
                    if (!isPresent) {
                        // add it
                        $scope.parentList.push({ Name: value[i].parentName, expanded: true });
                    }
                }
                $scope.selectedParentList = angular.copy($scope.parentList);

            }, true);

            $scope.addItem = function (item) {

                var index = getIndex(item.Id, $scope.options.sourceItems);
                if (index < 0)
                    return;

                $scope.options.selectedItems.push(item);
                // Remove the item from the source list
                $scope.options.sourceItems.splice(index, 1);
                // resize the scroll bar
                $rootScope.$broadcast('nicescrollResizeEvent');
                // trigger on item added event
                if ($scope.onAddItem != undefined) {
                    $scope.onAddItem({ item: item });
                }
            };

            $scope.removeItem = function (item) {

                var index = getIndex(item.Id, $scope.options.selectedItems);

                if (index >= 0) {
                    // Remove the item from the selected list
                    $scope.options.selectedItems.splice(index, 1);
                    // Update the source list
                    $scope.options.sourceItems.push(item);
                    // resize the scroll bar
                    $rootScope.$broadcast('nicescrollResizeEvent');

                    // trigger on item removed event
                    if ($scope.onRemoveItem != undefined) {
                        $scope.onRemoveItem({ item: item });
                    }
                }
            };

            $scope.searchValueChange = function () {
                if ($scope.searchValue.length <= 0) {
                    // resize the scroll bar
                    $rootScope.$broadcast('nicescrollResizeEvent');
                }
            }

            $scope.toggleExpand = function (parent) {
                parent.expanded = !parent.expanded;
                // resize the scroll bar
                $rootScope.$broadcast('nicescrollResizeEvent');
            }

            function getIndex(id, items) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].Id == id)
                        return i;
                }
                return -1;
            }
        }],
        link: function ($scope, $element, $attrs) {

            // Declare the list of parents of each items
            $scope.parentList = [];
            $scope.selectedParentList = [];

            $scope.showItemsList = true;

            if ($scope.options.placeholderText == undefined || $scope.options.placeholderText.length <= 0) {
                $scope.options.placeholderText = "Search...";
            }

            if ($scope.options.groupByParent == undefined) {
                $scope.options.groupByParent = false;
            }

            $scope.$on('$destroy', function () {
                // Remove scroll bar from the nicescroll directive
                $element.find('.nicescroll').each(function () {
                    if ($(this).data("__nicescroll") != undefined && $(this).data("__nicescroll").rail != undefined) {
                        $(this).data("__nicescroll").rail.remove();
                    }
                });
            });


        }
    }
}]);