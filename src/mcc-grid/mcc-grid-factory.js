var mccGridModule = angular.module('mcc.directives.grid');

mccGridModule.factory('CellModel', function(){
    /**
     * Wraps a row's rendered field in a cell model for
     * binding purposes and to preserve state outside of
     * the visible DOM.
     *
     * @param field
     * @param value
     * @constructor
     */
    function Cell(field, value) {
        this.field = field;
        this.value = value;
    }

    return Cell;
});

mccGridModule.factory('RowModel', ['CellModel', function(Cell){
    /**
     * Wraps the raw data of a row in a row object model for binding
     * purposes and also to preserve state outside of
     * the rendered DOM.
     *
     * @param rowData - The raw data for the row.
     * @param columnOrdering - An array of field orders.
     * @param rowConfig - The configuration for this row.
     * @constructor
     */
    function Row(rowData, columnOrdering, rowConfig) {
        this.data_ = rowData;
        this.cells_ = [];

        for (var i= 0, length=columnOrdering.length; i< length; i++) {
            var field = columnOrdering[i];

            if (typeof field === 'string') {
                this.cells_.push(new Cell(field, rowData[field]));
            } else if (typeof field === 'object') {
                this.cells_.push(new Cell(field.key, field.getter(rowData)));
            }
        }

        // Passing canEdit from the application to the model.
        if (rowConfig.canEdit) {
            this.canEdit = rowConfig.canEdit;
        }

        // Passing delete handler from the application to the model.
        if (rowConfig.deleteHandler) {
            this.deleteSelf = rowConfig.deleteHandler;
        }
    }

    /**
     * Gets the rows cell object models.
     * @returns {Array}
     */
    Row.prototype.getCells = function() {
        return this.cells_;
    };

    /**
     * Gets the the orginal dataset this model is wrapping.
     * @returns {Object}
     */
    Row.prototype.getData = function() {
        return this.data_;
    };

    return Row;
}]);