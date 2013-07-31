

if (sasDirectives === undefined) {
    var sasDirectives = angular.module('sasDirectives', []);
}


// Create an angularjs directive which encapsulate the jquery ui slider
sasDirectives.directive('sasSliderSdk', ['$timeout', function ($timeout) {

    function sliderSdkControler($scope, $element, $attrs) {

        var sliderValues = $scope.values();

        $scope.$watch('minValue', function (val) {
            $timeout(function () {
                $element.find(".slider").slider("option", "values", [sliderValues.indexOf(val), sliderValues.indexOf($scope.maxValue)]);
            });
        });

        $scope.$watch('maxValue', function (val) {
            $timeout(function () {
                $element.find(".slider").slider("option", "values", [sliderValues.indexOf($scope.minValue), sliderValues.indexOf(val)]);
            });
        });
    }

    sliderSdkControler.$inject = ['$scope', '$element', '$attrs'];


    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Admin/libjs/angularjs/directives/sas-slider-sdk.html',
        scope: {
            titles: '&',
            values: '&',
            minValue: "=",
            maxValue: "=",
            width: '@'
        },
        controller: sliderSdkControler,
        link: function ($scope, $element, $attrs) {
            // Initialize the repeater with the titles
            $scope.titles = $scope.titles();
            var sliderValues = $scope.values();
            // Get the width of the slider
            var width = parseInt($attrs.width);
            // Compute the width of the titles bar
            //var wrapperWidth = width / sliderValues.length + width;
            var sliderWidth = width * (sliderValues.length / (1 + sliderValues.length));
            $element.css({
                width: width + 'px'
            });
            var $table = $element.find('table');
            $table.css({
                width: width + 'px',
                tableLayout: 'fixed',
                textAlign: 'center'
            });

            var $slider = $element.find('.slider');
            $slider.css({
                width: sliderWidth + 'px',
                margin: 'auto'
            });
            // Wait for the DOM tobe fully rendered before initializing the slider
            $timeout(function () {
                var $tds = $table.find('td');
                $tds.css({ padding: 0, margin: 0 });
                $slider.slider({
                    range: true,
                    min: 0,
                    max: sliderValues.length - 1,
                    values: [0, sliderValues.length - 1],
                    create: function (event, ui) {
                        $tds.eq(0).css({ fontWeight: 'bold' });
                        $tds.eq(sliderValues.length - 1).css({ fontWeight: 'bold' });
                    },
                    slide: function (event, ui) {
                        $scope.minValue = sliderValues[ui.values[0]];
                        $scope.maxValue = sliderValues[ui.values[1]];
                        $tds.css({ fontWeight: 'normal' });
                        $tds.eq(ui.values[0]).css({ fontWeight: 'bold' });
                        $tds.eq(ui.values[1]).css({ fontWeight: 'bold' });
                        $scope.$parent.$digest();
                    },
                    change: function (event, ui) {
                        $scope.minValue = sliderValues[ui.values[0]];
                        $scope.maxValue = sliderValues[ui.values[1]];
                        $tds.css({ fontWeight: 'normal' });
                        $tds.eq(ui.values[0]).css({ fontWeight: 'bold' });
                        $tds.eq(ui.values[1]).css({ fontWeight: 'bold' });
                    }
                });

            });



        }
    }
} ]);