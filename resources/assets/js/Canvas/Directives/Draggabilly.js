module.exports = function(canvas)
{
    canvas.directive('draggabilly', [ '$compile', function($compile)
    {
        return {

            restrict: 'AC',
            link: function(scope, element, attrs)
            {
                var draggabilly = scope.$eval(attrs.draggabilly);

                $draggabilly = $(element).draggabilly(draggabilly);
            }
        }
    }]);
};