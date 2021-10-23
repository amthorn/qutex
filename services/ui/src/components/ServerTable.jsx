import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import PropTypes from "prop-types";
import React, {Component} from "react";

class ServerTable extends Component {
    constructor(properties) {
        super(properties);

        if (this.props.columns === undefined || this.props.url === undefined) {
            throw "The prop 'columns' and 'url' is required.";
        }

        const default_texts = Object.assign(ServerTable.defaultProps.options.texts, {});
        const default_icons = Object.assign(ServerTable.defaultProps.options.icons, {});
        const default_parameters_names = Object.assign(ServerTable.defaultProps.options.requestParametersNames, {});

        this.state = {
            options: Object.assign(ServerTable.defaultProps.options, this.props.options),

            requestData: {
                query: "",
                limit: 10,
                page: 1,
                orderBy: "created_at",
                direction: 0,
            },

            data: null,
            isLoading: true,
        };
        this.state.requestData.limit = this.state.options.perPage;
        this.state.options.texts = Object.assign(default_texts, this.props.options.texts);
        this.state.options.icons = Object.assign(default_icons, this.props.options.icons);
        this.state.options.requestParametersNames = Object.assign(default_parameters_names, this.props.options.requestParametersNames);

        
        this.table_search_input = React.createRef();
    }

    shouldComponentUpdate(nextProperties, nextState) {
        if (nextProperties.url !== this.props.url) {
            this.setState({isLoading: true}, () => {
                this.handleFetchData();
            });
        }

        return true;
    }

    componentDidMount() {
        this.handleFetchData();
    }

    tableClass() {
        let classes = "table ";

        classes += this.props.hover ? "table-hover " : "";
        classes += this.props.bordered ? "table-bordered " : "";
        classes += this.props.condensed ? "table-condensed " : "";
        classes += this.props.striped ? "table-striped " : "";

        return classes;
    }

    renderColumns() {
        const columns = [...this.props.columns];
        const {headings} = this.state.options;
        const {options} = this.state;
        const columns_width = this.state.options.columnsWidth;

        return columns.map((column) => (
            <th key={ column }
                className={ `table-${  column  }-th ${  options.sortable.includes(column) ? " table-sort-th " : "" 
                }${options.columnsAlign.hasOwnProperty(column) ? ` text-${  options.columnsAlign[column]}` : ""}` }
                style={ {
                    maxWidth: columns_width.hasOwnProperty(column) ?
                        Number.isInteger(columns_width[column]) ?
                            `${columns_width[column]  }%` :
                            columns_width[column] : ""
                } }
                onClick={ () => this.handleSortColumnClick(column) }>
                <span>{headings.hasOwnProperty(column) ? headings[column] : column.replace(/^\w/, c => c.toUpperCase())}</span>
                {
                    options.sortable.includes(column) && React.createElement(this.state.requestData.orderBy !== column ? options.icons.sortBase : (this.state.requestData.direction === 1 ? options.icons.sortUp : options.icons.sortDown), {"className": "table-sort-icon pull-right"})

                    // Options.sortable.includes(column) && <span
                    //     className={'table-sort-icon pull-right ' + (this.state.requestData.orderBy !== column ? options.icons.sortBase : (this.state.requestData.direction === 1 ? options.icons.sortUp : options.icons.sortDown))}/>
                }
            </th>
        ));
    }

    renderData() {
        const data = [...this.state.data.data];
        const columns = [...this.props.columns];
        const has_children = this.props.children !== undefined;

        const self = this;

        return data.map(function (row, row_index) {
            row.index = row_index;

            return (
                <tr key={ row_index } onClick={ self.props.onClick } data-id={ row.id } >
                    {
                        columns.map((column, index) => (
                            <td key={ column + index } className={ `table-${  column  }-td` }>
                                {has_children ?
                                    self.props.children(row, column) :
                                    row[column]}
                            </td>
                        ))
                    }
                </tr>
            );
        });
    }

    renderPagination() {
        const {options} = this.state;

        const pagination = [];

        pagination.push(
            <li key="first"
                className={ `page-item ${  options.currentPage === 1 || options.currentPage === 0 ? "disabled" : ""}` }>
                <a className="page-link" onClick={ () => this.handlePageChange(1) }>&laquo;</a>
            </li>
        );

        for (let index = 1; index <= options.lastPage; index++) {
            pagination.push(
                <li key={ index } className={ `page-item ${  options.currentPage === index ? "active" : ""}` }>
                    <a className="page-link" onClick={ () => this.handlePageChange(index) }>{index}</a>
                </li>
            );
        }

        pagination.push(
            <li key="last" className={ `page-item ${  options.currentPage === options.lastPage ? "disabled" : ""}` }>
                <a className="page-link" onClick={ () => this.handlePageChange(options.lastPage) }>&raquo;</a>
            </li>
        );

        return pagination;
    }

    handleSortColumnClick(column) {
        if (this.state.options.sortable.includes(column)) {
            const request_data = this.state.requestData;

            if (request_data.orderBy === column) {
                request_data.direction = request_data.direction === 1 ? 0 : 1;
            } else {
                request_data.orderBy = column;
                request_data.direction = 1;
            }

            this.setState({requestData: request_data, isLoading: true}, () => {
                this.handleFetchData();
            });
        }
    }

    refreshData() {
        this.setState({isLoading: true}, () => {
            this.handleFetchData({fresh: true});
        });
    }

    mapRequestData() {
        const parametersNames = this.state.options.requestParametersNames;
        const directionValues = Object.assign(this.props.options.orderDirectionValues || {}, ServerTable.defaultProps.options.orderDirectionValues);
        const {requestData} = this.state;

        return {
            [parametersNames.query]: requestData.query,
            [parametersNames.limit]: requestData.page * requestData.limit,

            // [parametersNames.page]: requestData.page * requestData.limit,
            "start": (requestData.page * requestData.limit) - requestData.limit + 1,
            "order_by": requestData.orderBy,
            [parametersNames.direction]: requestData.direction === 1 ? directionValues.ascending : directionValues.descending,
        };
    }

    handleFetchData(fresh=false) {
        const {url} = this.props;

        const options = { ...this.state.options};
        const requestData = { ...this.state.requestData};

        const urlParameters = new URLSearchParams(this.mapRequestData());

        const baseUrl = new URL(url, window.location);

        const com = baseUrl.search.length > 0 ? "&" : "?";

        if (this.props.updateUrl) {
            // History.replaceState(url, null, baseUrl.search + com + urlParams.toString());
            History.replaceState(url, null, baseUrl.search);
        }

        if(fresh || this.state.data === null){
            axios.get(url).then((response) => {
                const response_data = response.data;

                const out_adapter = this.state.options.responseAdapter(response_data);

                if (out_adapter === undefined || !out_adapter ||
                    typeof out_adapter !== "object" || out_adapter.constructor !== Object ||
                    !out_adapter.hasOwnProperty("data") || !out_adapter.hasOwnProperty("total")) {
                    throw "You must return 'object' contains 'data' and 'total' attributes";
                } else if (out_adapter.data === undefined || out_adapter.total === undefined) {
                    throw "Please check from returned data or your 'responseAdapter'. \n response must have 'data' and 'total' attributes.";
                }

                this.setState({cached: out_adapter});
                this.setState({
                    ...this.process(this.configureOptions(this.state.options, this.state.cached.total)),
                    isLoading: false
                });
            });
        } else {
            // This function must happen first so that the process function
            // can have access to the options
            this.setState({
                ...this.process(this.configureOptions(options, this.state.cached.total)),
                isLoading: false
            });
        }
    }

    process(options){
        // Search, Sort, and Paginate
        let data = cloneDeep(this.state.cached);

        data = this.search(data);

        // Reset the total value after search is complete
        options = this.configureOptions(this.state.options, data.data.length);

        if(this.state.requestData.orderBy || this.state.requestData.direction){
            data = this.sort(data);
        }

        if(this.state.requestData.limit || this.state.requestData.page){
            data = this.paginate(data);
        }
        
        return {
            data, 
            options
        };
    }

    isString(o){
        return typeof o === "string" || o instanceof String;
    }

    search(data){
        if(this.state.requestData.query){
            data = cloneDeep(data);

            const matches = [];

            for(const record of data.data){
                for(const entry of Object.entries(record)){
                    // Ignore ID for searches, they are UUIDs
                    if(entry[0] != "id" && entry[1] && this.isString(entry[1]) && entry[1].toLowerCase().includes(this.state.requestData.query.toLowerCase())){
                        matches.push(record);

                        break;
                    }
                }
            }

            return {
                ...data,
                data: matches
            };
        }

        return data;
    }

    sort(data){
        function _compareObjects(object1, object2, key) {
            const object1_ = (object1[key] || "").toUpperCase();
            const object2_ = (object2[key] || "").toUpperCase();

            if (object1_ < object2_) {
                return -1;
            }

            if (object1_ > object2_) {
                return 1;
            }

            return 0;
        }

        let sorted = data.data.sort((object1, object2) => _compareObjects(object1, object2, this.state.requestData.orderBy));

        if(this.state.requestData.direction === 0){
            sorted = sorted.reverse();
        }

        return {
            ...data,
            "data": sorted
        };
    }

    paginate(data){
        const start = this.state.requestData.limit * (this.state.requestData.page - 1);

        return {
            ...data,
            "data": data.data.slice(start, start + this.state.requestData.limit)
        };
    }

    configureOptions(options, total){
        options = options;
        options.total = total;

        if (total === 0) {
            options.currentPage = 0;
            options.lastPage = 0;
            options.from = 0;
            options.to = 0;
        } else {
            options.currentPage = this.state.requestData.page;
            options.lastPage = Math.ceil(total / this.state.requestData.limit);
            options.from = this.state.requestData.limit * (this.state.requestData.page - 1) + 1;
            options.to = options.lastPage === options.currentPage ? options.total : this.state.requestData.limit * (this.state.requestData.page);
        }

        return options;
    }

    handlePerPageChange = (event) => {
        const {name, value} = event.target;

        const options = { ...this.state.options};
        const requestData = { ...this.state.requestData};

        options.perPage = value;
        requestData.limit = event.target.value;
        requestData.page = 1;

        this.setState({requestData, options, isLoading: true}, () => {
            this.handleFetchData();
        });
    }

    handlePageChange(page) {
        const requestData = { ...this.state.requestData};

        requestData.page = page;

        this.setState({requestData, isLoading: true}, () => {
            this.handleFetchData();
        });
    }

    handleSearchClick() {
        const query = this.table_search_input.current.value;
        const requestData = { ...this.state.requestData};

        requestData.query = query;
        requestData.page = 1;

        this.setState({requestData, isLoading: true}, () => {
            this.handleFetchData();
        });
    }

    render() {
        return (
            <div className="card react-strap-table">
                {
                    (this.props.perPage || this.props.search) &&

                    <div className="card-header text-center">
                        {
                            this.props.perPage &&
                            <div className="float-left">
    <span>{this.state.options.texts.show} </span>
    <label>
    <select className="form-control form-control-sm"
                                        onChange={ this.handlePerPageChange }>
    {this.state.options.perPageValues.map(value => (
    <option key={ value } value={ value }>{value}</option>
                                        ))}
                                    </select>
                                </label>
    <span> {this.state.options.texts.entries}</span>
                            </div>
                        }

                        {this.state.isLoading && (this.state.options.loading)}

                        {
                            this.props.search &&
                            <div className="input-icon input-group-sm float-right">
    <input type="text" className="form-control" style={ {height: 34} }
                                    placeholder={ this.state.options.texts.search } ref={ this.table_search_input }
                                    onKeyUp={ () => this.handleSearchClick() }/>

    <span className="input-icon-addon"><i className="fe fe-search" /></span>
                            </div>
                        }
                    </div>
                }
                <div className="card-body">
                    <div className="table-responsive" style={ {maxHeight: this.props.options.maxHeightTable} }>
                        <table className={ this.tableClass() }>
                            <thead>
                                <tr>
                                    {this.renderColumns()}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.options.total > 0 && this.state.data !== null ?
                                        this.renderData() :
                                        <tr className="text-center">
                                            <td colSpan={ this.props.columns.length }>{this.state.isLoading && (this.state.options.loading) || this.state.options.texts.empty}</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer clearfix">
                    {
                        this.props.pagination ?
                            <div className="float-left">
                                {`${this.state.options.texts.showing  } ${  this.state.options.from  } ${  this.state.options.texts.to  } ${ 
                                    this.state.options.to  } ${  this.state.options.texts.of  } ${  this.state.options.total 
                                } ${  this.state.options.texts.entries}`}
                            </div> :
                            <div className="float-left">
                                {
                                    `${this.state.options.total  } ${  this.state.options.texts.entries}`
                                }
                            </div>
                    }
                    {
                        this.props.pagination &&
                        <ul className="pagination m-0 float-right">
                            {this.renderPagination()}
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

ServerTable.defaultProps = {
    options: {
        headings: {},
        sortable: [],
        columnsWidth: {},
        columnsAlign: {},
        initialPage: 1,
        perPage: 10,
        perPageValues: [10, 20, 25, 100],

        icons: {
            sortBase: "fa fa-sort",
            sortUp: "fa fa-sort-amount-up",
            sortDown: "fa fa-sort-amount-down",
            search: "fa fa-search"
        },

        texts: {
            show: "Show",
            entries: "entries",
            showing: "Showing",
            to: "to",
            of: "of",
            search: "Search",
            empty: "Empty Results"
        },

        requestParametersNames: {
            query: "query",
            limit: "limit",
            page: "page",
            orderBy: "orderBy",
            direction: "direction",
        },

        orderDirectionValues: {
            ascending: "asc",
            descending: "desc",
        },

        total: 10,
        currentPage: 1,
        lastPage: 1,
        from: 1,
        to: 1,

        loading: (
            <div style={ {fontSize: 14, display: "initial"} }><span style={ {fontSize: 18} }
                className="fa fa-spinner fa-spin"/> Loading...
            </div>),

        responseAdapter (resp_data) {
            return {data: resp_data.data, total: resp_data.total};
        },

        maxHeightTable: "unset"
    },

    perPage: true,
    search: true,
    pagination: true,
    updateUrl: false,
};

ServerTable.propTypes = {
    id: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,

    hover: PropTypes.bool,
    bordered: PropTypes.bool,
    condensed: PropTypes.bool,
    striped: PropTypes.bool,
    perPage: PropTypes.bool,
    search: PropTypes.bool,
    pagination: PropTypes.bool,
    updateUrl: PropTypes.bool,

    options: PropTypes.object,
    children: PropTypes.func,
};


export default ServerTable;