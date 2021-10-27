import axios from "axios";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Button, Label } from "reactstrap";
import React, { useState } from "react";

const defaultTotal = 10;
const defaultPerPage = 10;

const compareObjects = (o1, o2, key) => {
    const o12 = (o1[key] || "").toUpperCase();
    const o22 = (o2[key] || "").toUpperCase();

    if (o12 < o22) {
        return -1; // eslint-disable-line no-magic-numbers
    }
    if (o12 > o22) {
        return 1;
    }
    return 0;
};

const isSearchString = (object, queryString) => (
    object &&
    (typeof object === "string" || object instanceof String) &&
    object.toLowerCase().includes(queryString.toLowerCase())
);

/* eslint-disable complexity */
const ServerTable = ({
    columns,
    url,
    options = {},
    hover,
    bordered,
    condensed,
    striped,
    onClick,
    perPage = true,
    searchEnabled = true,
    pagination = true,
    updateUrl = false,
    children
}) => {
    const [options_, setOptions] = useState({
        texts: {
            show: "Show",
            entries: "entries",
            showing: "Showing",
            to: "to",
            of: "of",
            search: "Search",
            empty: "Empty Results",
            ...options?.texts
        }, 
        
        icons: {
            sortBase: "fa fa-sort",
            sortUp: "fa fa-sort-amount-up",
            sortDown: "fa fa-sort-amount-down",
            search: "fa fa-search",
            ...options?.icons
        },

        requestParametersNames: {
            query: "query",
            limit: "limit",
            page: "page",
            orderBy: "orderBy",
            direction: "direction",
            ...options?.requestParametersNames
        },

        headings: options.headings ?? {},
        columnsWidth: options.columnsWidth ?? {},
        sortable: options.sortable ?? [],
        columnsAlign: options.columnsAlign ?? {},
        perPageValues: options.perPageValues ?? [10, 20, 25, 100], // eslint-disable-line no-magic-numbers
        maxHeightTable: options.maxHeightTable ?? "unset",
        perPage: options.perPage ?? defaultPerPage,

        responseAdapter: options.responseAdapter ?? (respData => ({data: respData.data, total: respData.total})),
        
        initialPage: 1,

        orderDirectionValues: {
            ascending: "asc",
            descending: "desc",
        },

        currentPage: 1,
        lastPage: 1,
        from: 1,
        to: 1,

        loading: (
            <div style={ {fontSize: 14, display: "initial"} }><span style={ {fontSize: 18} }
                className="fa fa-spinner fa-spin"/> Loading...
            </div>
        ),
    });
    const [requestData, setRequestData] = useState({
        ...options_.requestParameterNames,
        limit: options_.perPage,
        page: 1,
        query: ''
    });
    const [total, setTotal] = useState(options.total ?? defaultTotal);
    const [isLoading, setIsLoading] = useState(false);
    const [cached, setCached] = useState(options.data);
    const [data, setData] = useState(options.data);
    const emptyOrLoading = (
        <tr className="text-center">
            <td colSpan={ columns.length }>
                { isLoading && (options_.loading) || options_.texts.empty }
            </td>
        </tr>
    );

    const tableClass = classNames(
        "table",
        {"table-hover": hover},
        {"table-bordered": bordered},
        {"table-condensed": condensed},
        {"table-striped": striped},
    );

    const renderData = () => 
        data.data.map((row, rowIndex) => {
            // Passed to children
            row.index = rowIndex; // eslint-disable-line no-param-reassign

            return <tr key={ row.index } onClick={ onClick } data-id={ row.id } >
                {
                    columns.map((column, index) => 
                        <td key={ column + index } className={ `table-${column.replaceAll(" ", "")}-td` }> {/* eslint-disable-line */}
                            { children !== undefined ? children(row, column) : row[column] }
                        </td>
                    )
                }
            </tr>;
        });

    const handleSortColumnClick = (column) => {
        if (options_.sortable.includes(column)) {
            setIsLoading(true);
            if(requestData.orderBy === column){
                // If the column is already being sorted, reverse the order or revert to base, whatever is next
                setRequestData({
                    ...requestData,
                    orderBy: requestData.direction === 1 ? column : undefined,
                    direction: requestData.direction === 1 ? 0 : 1
                })
            }else{
                // if the column is not being sorted, set it to be sorted in direction 0
                setRequestData({
                    orderBy: column,
                    direction: 1
                });
            }
        }
    };

    const renderColumns = columns.map(column => {
        // Determine the table classes
        const thClasses = classNames(
            `table-${column.replaceAll(" ", "")}-th`,
            {"table-sort-th": options_.sortable.includes(column)},
            {[`text-${options_.columnsAlign[column]}`]: column in options_.columnsAlign}
        );

        // Determine the maximum width
        let maxWidth;

        if(column in options_.columnsWidth && Number.isInteger(options_.columnsWidth[column])){
            maxWidth = `${options_.columnsWidth[column]  }%`;
        }else if(column in options_.columnsWidth && !Number.isInteger(options_.columnsWidth[column])){
            maxWidth = options_.columnsWidth[column];
        }else{
            maxWidth = "";
        }

        // Generate the column headings
        let columnHeadings;

        if(column in options_.headings){
            columnHeadings = options_.headings[column];
        }else{
            columnHeadings = column.replace(/^\w/u, col => col.toUpperCase());
        }

        // Generate sortable buttons
        let sortableButtons;

        if(requestData.orderBy !== column){
            sortableButtons = options_.icons.sortBase;
        }else if(requestData.direction === 1){
            sortableButtons = options_.icons.sortUp;
        }else{
            sortableButtons = options_.icons.sortDown;
        }

        return <th
            key={ column }
            className={ thClasses }
            style={ { maxWidth } }
            onClick={ () => handleSortColumnClick(column) }
        >
            <span> { columnHeadings } </span>
            {
                options_.sortable.includes(column) && React.createElement(
                    sortableButtons, 
                    {className: "table-sort-icon pull-right"}
                )
            }
        </th>;
    });

    const search = (rawData) => {
        const ignoredKeys = new Set("id", "_id");
        const matches = [];

        for(const record of rawData.data){
            for(const entry of Object.entries(record)){
                // Ignore ID for searches, they are UUIDs
                if(!ignoredKeys.has(entry[0]) && isSearchString(entry[1], requestData.query)){
                    matches.push(record);
                    break;
                }
            }
        }

        return {
            ...rawData,
            data: matches
        };
    };

    const sort = (rawData) => {
        let sorted = rawData.data.sort((o1, o2) => compareObjects(o1, o2, requestData.orderBy));

        if(requestData.direction === 0){
            sorted = sorted.reverse();
        }

        return {
            ...rawData,
            data: sorted
        };
    };

    const paginate = (rawData) => {
        const start = requestData.limit * (requestData.page - 1);
        return {
            ...rawData,
            data: rawData.data.slice(start, start + requestData.limit)
        };
    };

    const configureOptions = (optns, ttl) => {
        setTotal(ttl);
        if (ttl === 0) {
            return {
                ...optns,
                currentPage: 0,
                lastPage: 0,
                from: 0,
                to: 0,
                ttl
            };
        }
        return {
            ...optns,
            currentPage: requestData.page,
            lastPage: Math.ceil(ttl / requestData.limit),
            from: requestData.limit * (requestData.page - 1) + 1,
            to: optns.lastPage === optns.currentPage ? ttl : requestData.limit * (requestData.page),

        };
    };

    const processData = (optns, dta) => {
        // Search, Sort, and Paginate
        let newData = dta;

        if(requestData.query){
            newData = search(newData);
        }

        // Reset the total value after search is complete
        const newOptions = configureOptions(optns, newData.data.length);

        if(requestData.orderBy || requestData.direction !== undefined){
            newData = sort(newData);
        }

        if(requestData.limit || requestData.page){
            newData = paginate(newData);
        }
        setData(newData);
        setOptions(newOptions);
        setIsLoading(false);
    };

    const handleFetchData = (fresh) => {
        const baseUrl = new URL(url, window.location);

        if (updateUrl) {
            History.replaceState(url, undefined, baseUrl.search);
        }

        if(fresh || data === undefined){
            axios.get(url).then(response => {
                const outAdapter = options_.responseAdapter(response.data);
                const properType = [
                    outAdapter === undefined,
                    !outAdapter,
                    typeof outAdapter !== "object",
                    outAdapter.constructor !== Object,
                    !("data" in outAdapter),
                    !("total" in outAdapter)
                ];
                const containsKeys = [
                    outAdapter.data === undefined,
                    outAdapter.total === undefined
                ];
                
                if (properType.some(x => x)){ // eslint-disable-line
                    throw new Error("You must return 'object' contains 'data' and 'total' attributes");
                } else if(containsKeys.some(x => x)) {
                    throw new Error(
                        "Please check from returned data or your 'responseAdapter'. \n" +
                        " response must have 'data' and 'total' attributes."
                    );
                }else{
                    setCached(outAdapter);
                    processData(configureOptions(options_, outAdapter.total), outAdapter);
                }
            }).catch(alert);
        } else {
            // This function must happen first so that the process function
            // can have access to the options
            processData(configureOptions(options_, data.total), cached);
        }
    };

    const handlePerPageChange = (event) => {
        setIsLoading(true);
        setRequestData({
            ...requestData,
            limit: event.target.value,
            page: 1,
        });
    };

    const handlePageChange = (page) => {
        setIsLoading(true);
        setRequestData({
            ...requestData,
            page
        });
    };

    const renderPagination = () => {
        const firstClasses = classNames(
            "page-item",
            {"disabled": options_.currentPage === 1 || options_.currentPage === 0}
        );

        const commonProps = {
            color: "link",
            className: "page-link"
        };

        const paginationButtons = [
            <li key="first" className={ firstClasses }>
                <Button { ...commonProps } onClick={ () => handlePageChange(1) }>&laquo;</Button>
            </li>
        ];

        for (let ind = 1; ind <= options_.lastPage; ind++) {
            const classes = classNames("page-item", {"active": options_.currentPage === ind});
            paginationButtons.push(
                <li key={ ind } className={ classes }>
                    <Button { ...commonProps } onClick={ () => handlePageChange(ind) }>{ind}</Button>
                </li>
            );
        }

        const classes = classNames("page-item", {"disabled": options_.currentPage === options_.lastPage});
        paginationButtons.push(
            <li key="last" className={ classes }>
                <Button { ...commonProps } onClick={ () => handlePageChange(options_.lastPage) }>&raquo;</Button>
            </li>
        );

        return paginationButtons;
    };

    // React.useEffect(() => {
    //     setIsLoading(true);
    //     handleFetchData();
    // }, []);
    
    React.useEffect(handleFetchData, [requestData]);

    // TODO: improve complexity by making this cleaner and better
    return (
        <div className="card react-strap-table">
            {
                (perPage || searchEnabled) &&

                <div className="card-header text-center">
                    {
                        perPage &&
                        <div className="float-left">
                            <span>{ options_.texts.show } </span>
                            <Label>
                                <select
                                    className="form-control form-control-sm"
                                    onChange={ handlePerPageChange }
                                >
                                    {
                                        options_.perPageValues.map(
                                            value => <option key={ value } value={ value }>{value}</option>
                                        )
                                    }
                                </select>
                            </Label>
                            <span> {options_.texts.entries}</span>
                        </div>
                    }
                    { isLoading && (options_.loading) }

                    {
                        searchEnabled &&
                        <div className="input-icon input-group-sm float-right">
                            <input 
                                type="text"
                                className="form-control"
                                style={ {height: 34} }
                                placeholder={ options_.texts.search }
                                value={ requestData.query }
                                onChange={ event => setRequestData({query: event.target.value}) }
                            />
                            <span className="input-icon-addon"><i className="fe fe-search" /></span>
                        </div>
                    }
                </div>
            }
            <div className="card-body">
                <div className="table-responsive" style={ {maxHeight: options_.maxHeightTable} }>
                    <table className={ tableClass }>
                        <thead>
                            <tr>{ renderColumns }</tr>
                        </thead>
                        <tbody>
                            { total > 0 && data ? renderData() : emptyOrLoading }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card-footer clearfix">
                {
                    pagination ?
                        <div className="float-left">
                            {`${options_.texts.showing  } ${  options_.from  } ${  options_.texts.to  } ${ 
                                options_.to  } ${  options_.texts.of  } ${  total 
                            } ${  options_.texts.entries}`}
                        </div> :
                        <div className="float-left">
                            { `${total} ${options_.texts.entries}` }
                        </div>
                }
                {
                    pagination &&
                    <ul className="pagination m-0 float-right">{ renderPagination() }</ul>
                }
            </div>
        </div>
    );
};
/* eslint-enable complexity */

ServerTable.propTypes = {
    columns: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,

    bordered: PropTypes.bool,
    children: PropTypes.func,
    condensed: PropTypes.bool,
    hover: PropTypes.bool,
    options: PropTypes.object,
    pagination: PropTypes.bool,
    perPage: PropTypes.bool,
    searchEnabled: PropTypes.bool,
    striped: PropTypes.bool,
    updateUrl: PropTypes.bool,
};


export { ServerTable };