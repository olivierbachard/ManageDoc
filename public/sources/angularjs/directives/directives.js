
if (sasDirectives === undefined) {
    var sasDirectives = angular.module('sasDirectives', []);
}



/**
* Fades an element in when the model changes (in and out and vice-versa).  Restricted to attributes.
*
* mandatory: attribute sas-fade-toggle on your element with a boolean value
* optional: attribute sas-fade-toggle-duration on your element with either an integer value, or the string 'slow' or 'fast'. integer values are in milliseconds
*
* Usage:
*
* <div sas-fade-toggle="true"/> ==> fadeIn the element
* <div sas-fade-toggle="false"/> ==> fadeOut the element

* <div sas-fade-toggle="true" sas-fade-toggle-duration="1000"/> ==> fadeIn the element with a duration of 1000 milliseconds
* <div sas-fade-toggle="false" sas-fade-toggle-duration="fast"/> ==> fadeOut the element with a fast duration (200 milliseconds)
* 
*/

// sas-fade-in
sasDirectives.directive('sasFadeToggle', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attribs) {
            scope.$watch(attribs.sasFadeToggle, function (value) {
                var duration = attribs.sasFadeToggleDuration;
                if (duration === undefined
                    || (duration != 'slow' && duration != "fast" && Number.NaN == parseInt(duration))) {
                    duration = 400; // default fade effect of 400 msec
                }
                if (value) {
                    element.fadeIn(duration);
                } else {
                    element.fadeOut(duration);
                }
            });
        }
    };
});

// sas-tooltip
sasDirectives.directive('sasTooltip', function () {
    return {
        restrict: 'AC',
        link: function ($scope, $element, attrs) {
            return $scope.$watch(attrs.sasTooltipTitle, function (value) {
                if (value != null) {
                    if (attrs.sasTooltipPosition !== undefined && attrs.sasTooltipPosition != null) {
                        $element.sastooltip({ title: value, position: attrs.sasTooltipPosition });
                    } else {
                        $element.sastooltip({ title: value });
                    }
                }
            }, true);
        }
    };
});


//sas-datetime-picker
sasDirectives.directive("sasDatetimePicker", ["$timeout", function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            options: "&",
            date: "="
        },
        template: '<input type="text" ng-model="date" />',
        link: function ($scope, $element, attr) {
            // Wait for the DOM tobe fully rendered before initializing the datepicker
            $timeout(function () {
                // Get the options of the datepicker
                var datepickerOptions = $scope.options();
                // Add a method on the onSelect event to retrieve the value
                datepickerOptions.onSelect = function (dateText, instance) {
                    $scope.date = dateText;
                    $scope.$parent.$digest();
                }
                // setup the datepicker plugin
                $element.datetimepicker(datepickerOptions);
            });

        }
    }
}]);

//#region sas-label
// Create a button with a 'label' style
sasDirectives.directive("sasLabel", function () {
    return {
        restrict: 'A', // restrict to A and not E because of a bug with ng-transclude in IE8
        scope: {
            clickEvent: "&",    // Function to be called when the user click on the label
            isDisabled: "@",    // Condition to disabled the label
            isActive: "@",      // initialize the state of the label
            customClass: "@"    // Add a custom css class to the label if necessary
        },
        transclude: true,
        replace: true,
        template: "<button type='button' ng-click='doClick()' ng-class='{ active: isActive }' ng-disabled='isDisabled' ><span ng-transclude></span></button>",
        controller: ['$scope', function ($scope) {
            $scope.doClick = function () {
                // Toggle the active state
                $scope.isActive = !$scope.isActive;
                // trigger the click event
                $scope.clickEvent();
            }
        }],
        link: function ($scope, $element, attr) {

            // Set disabled attribute
            attr.$observe('isDisabled', function (value) {
                if (value == "true") {
                    $scope.isDisabled = true;
                } else {
                    $scope.isDisabled = false;
                }
            });

            // Set active attribute
            attr.$observe('isActive', function (value) {
                if (value == "true") {
                    $scope.isActive = true;
                } else {
                    $scope.isActive = false;
                }
            });

            $element.addClass("sas-label");
            // Add the custom class if it is defined
            attr.$observe('customClass', function (value) {
                if (value != undefined && value.length > 0) {
                    $element.addClass(value);
                }
            });

        }
    }
});

//#endregion

//#region Input with delete buttton

sasDirectives.directive("sasInputWithDelete", function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        template: "<span class='sasInputWithDelete'>"
                + "<input type='text' class='sasInputWithDelete_Input' />"
                + "<img src='/gestion/images/icons/fugue/icon/cross_small.png' alt='' class='sasInputWithDelete_Img' />"
                + "</span>",
        link: function ($scope, $element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Get the textbox
            var $myTB = $element.find("input[type=text].sasInputWithDelete_Input").eq(0);
            var $deleteImg = $element.find("img.sasInputWithDelete_Img").eq(0);

            // Called when the UI needs to be updated (model changed)
            ngModel.$render = function () {
                $myTB.val(ngModel.$viewValue || '');
                if (ngModel.$viewValue == undefined) {
                    read();
                }
            };

            // Listen for change events to enable binding
            $myTB.on('blur keyup change', function () {
                toggleDeleteImg();
                $scope.$apply(read);
            });

            // Clear the input value when the user click on delete img
            $element.find('img.sasInputWithDelete_Img').eq(0).on('click', function () {
                $myTB.val("");
                $scope.$apply(read);
                toggleDeleteImg();
            });

            // Write data to the model
            function read() {
                ngModel.$setViewValue($myTB.val());
            }

            function toggleDeleteImg() {
                if ($myTB.val().length > 0) {
                    $deleteImg.css('visibility', 'visible');
                } else {
                    $deleteImg.css('visibility', 'hidden');
                }
            }

            // Set placeholder if there is one
            attrs.$observe('placeholder', function (value) {
                $myTB.attr('placeholder', value);
            });

            // Handle events for css rules
            $myTB.on('focus', function () {
                $element.toggleClass("sasInputWithDelete_focus");
                toggleDeleteImg();
            });

            $myTB.on('blur', function () {
                $element.toggleClass("sasInputWithDelete_focus");
            });
        }
    }
});

//#endregion

//#region nicescroll directive : encapsulate the jquery plugin nicescroll

sasDirectives.directive('nicescroll', ["$timeout", function ($timeout) {
    return {
        restrict: "AEC",
        link: function ($scope, $element, attrs) {

            // Declare the variable containing the scroller object
            var $scroller = null;

            attrs.$observe('nicescrollOptions', function (value) {

                var options = $.parseJSON(value);

                if (value == undefined || $.isEmptyObject(options) || !angular.isObject(options))
                    return;

                // The height is mandatory
                if (options.height == undefined || isNaN(options.height))
                    return;

                // If the scroller is not null, it means it already have been intialized
                if ($scroller != null) {
                    $scroller.resize();
                    return;
                }

                $timeout(function () {
                    // Set the height of the element which hold the scroller
                    $element.css("height", options.height + "px");

                    // Remove the height the value as it is not an option af the nicescroll jquery plugin
                    delete options.height;

                    // Initialize the nicescroll plugin with the options parameter
                    $scroller = $element.niceScroll(options);
                });
            }, true);

            // Listen event triggering the resizing of the scroll bar
            $scope.$on('nicescrollResizeEvent', function () {
                if ($scroller != null) {
                    $scroller.resize();
                }
            });
        }
    }
}]);

//#endregion