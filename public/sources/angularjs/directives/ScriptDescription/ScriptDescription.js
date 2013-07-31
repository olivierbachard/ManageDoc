var scriptDescription = angular.module('scriptDescription', []);


var descDirective = function ($http, $timeout) {

    function descController($scope, $element, $attrs) {


        $scope.GetScriptType = function (typeID) {
            switch (typeID) {
                case 1:
                    return "XML";
                case 2:
                    return "Javascript";
                case 3:
                    return "HTML";
            }
        };

        $scope.GetStarColor = function (isFavorite) {
            if (isFavorite)
                return "Jaune";
            else
                return "";
        };

        // Format the version id to a string representing the sdk version
        $scope.DisplaySDKVersion = function (versionId) {
            versionId = versionId.toString();
            // Get the three last digit
            if (versionId.length >= 4) {
                versionId = versionId.substr(1);
            }
            if (versionId == "999") {
                if ($scope.trads != undefined) {
                    return $scope.trads.Next;
                }
                return "Next";
            }
            var v1 = parseInt(versionId.substr(0, 2));
            var v2 = parseInt(versionId.substr(2));
            return "SDK" + v1.toString() + "." + v2.toString();
        };

        $scope.$watch('script', function (newScript) {

            if ($.isEmptyObject(newScript) == false) {
                $scope.currentScript = newScript;

                //#region set the custom scroll for the description
                $timeout(function () {

                    //#region change the width of the description div
                    var wrapperWidth = $("#templateDescWrapper").width();
                    var middleWidth = $("#propertiesContainer").width() + $(".thumbnailContainer").width();
                    if ($("#sdkVersionsContainer").css("display") != "none") {
                        middleWidth += $("#sdkVersionsContainer").width();
                    }
                    $("#templateDescContainer").css('maxWidth', (wrapperWidth - middleWidth - 150) + 'px');
                    //#endregion

                    if (slider === undefined) {
                        var slider = $element.find(".descriptionDiv").niceScroll({ cursorcolor: "#616161", railalign: "left" });
                    }
                    slider.resize();
                }, 800);
                //#endregion

                $scope.hlTechSpec = "http://help.smartadserver.com/specifications/#WebSpecifications.htm";
                if ($scope.isMobile())
                    $scope.hlTechSpec = "http://manage.smartadserver.com/admin/help/EN/Publisher/Content/Specifications/MobileSpecifications/MobileAppSpecs.aspx";

                if ($scope.trads !== undefined) {
                    if ($scope.currentScript.IsDraft) {
                        $scope.currentScript.Status = $scope.trads.Draft;
                    }
                    else if ($scope.currentScript.Deprecated) {
                        $scope.currentScript.Status = $scope.trads.Deprecated;
                    }
                }
            }

        }, true);

        $scope.thumbImageClick = function () {
            $scope.imgClick();
        };
    }

    descController.$inject = ['$scope', '$element', '$attrs'];

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Admin/libjs/angularjs/directives/ScriptDescription/ScriptDescription.html',
        scope: {
            currentPage: '@',
            script: '=',
            isMobile: '&',
            imgClick: '&',
            usePublishedClick: '&',
            useDraftClick: '&'
        },
        controller: descController,
        link: function ($scope, $element, $attrs) {

            //#region canvas for the line separators

            var ls = $(".lineSeparator");
            var ctx;
            var canvasOk = true;

            for (var i = 0; i < ls.length; i++) {
                if (Modernizr.canvas) {
                    ctx = ls[i].getContext("2d");
                    var grd = ctx.createLinearGradient(0, 0, 0, 60);
                    grd.addColorStop(0, "rgba(0, 0, 0, 0)");
                    grd.addColorStop("0.5", "rgba(142, 172, 192, 0.5)");
                    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.fillStyle = grd;
                    ctx.fillRect(0, 0, 1, 60);
                }
            }

            // for ie <= 8 because it doesnt know the html5 canvas
            if (!Modernizr.canvas) {
                $("#propertiesContainer").css('borderLeft', '1px solid #bbb');
                $("#sdkVersionsContainer").css({ borderLeft: '1px solid #bbb', paddingLeft: '20px' });
            }

            //#endregion

            //#region glass effect on the thumb image

            var c = document.getElementById("thumbImageCanvas");

            if (Modernizr.canvas) {
                ctx = c.getContext("2d");
                var canvaWidth = 106;
                var canvaHeight = 85;
                ctx.beginPath();
                ctx.moveTo(50, 0);
                ctx.lineTo(canvaWidth, 85);
                ctx.lineTo(canvaWidth, 3);
                ctx.lineTo(canvaWidth - 3, 0);
                var grd = ctx.createLinearGradient(canvaWidth, 0, canvaWidth, 85);
                grd.addColorStop(0, "rgba(255, 255, 255, 0.5)");
                grd.addColorStop("0.85", "rgba(255, 255, 255, 0)");
                ctx.fillStyle = grd;
                ctx.fill();
            }
            else {
                $(".thumbnail").css({ border: 'none' });
            }

            //#endregion

            //#region set width of the description


            //endregion

            //#region get the translations from a webservice

            $http.post("/Admin/libjs/Translations/ResxToJS.asmx/GetTrads_ScriptDescription", {})
            .success(function (data) {
                $scope.trads = $.parseJSON(data.d);
            });

            // Update translations for the script if necessary 
            $scope.$watch('trads', function (value) {

                if ($scope.currentScript !== undefined && $scope.trads !== undefined) {
                    if ($scope.currentScript.IsDraft) {
                        $scope.currentScript.Status = $scope.trads.Draft;
                    }
                    else if ($scope.currentScript.Deprecated) {
                        $scope.currentScript.Status = $scope.trads.Deprecated;
                    }
                }
            });

            //#endregion

        }

    }
};

// Dependency injection of $hhtp service into the directive
descDirective.$inject = ['$http', '$timeout'];
// Add the directive to the module
scriptDescription.directive('sasScriptDescription', descDirective);