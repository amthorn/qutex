import classNames from "classnames/dedupe";
import React from "react";
import { v4 } from "uuid";


const TableComponent = ({ component, children, ...props}) =>
    React.createElement(component, { ...props, key: v4() }, children);

const Row = (props) => <TableComponent component="tr" { ...props } />;
const Header = (props) => <TableComponent component="th" { ...props } />;
const Col = (props) => <TableComponent component="td" { ...props } />;


export const Table = ({ data, columns, keys }) => {
    const noContent = (
        <Row className="text-center text-info">
            <Col colSpan={ 4 } className="justify-content-center">
                No Data Found
            </Col>
        </Row>
    );

    const newColumns = (columns !== undefined ? columns : []);
    const newData = (data !== undefined ? data : []);

    const columnContent = newColumns.map(name => <Header key={ name.id }>{ name }</Header>);

    const dataContent = newData.map(row => 
        <Row key={ row.id }>
            { keys.map(key => 
                <Col key={ key.id }>
                    { row[key] }
                </Col>)
            }
        </Row>
    );

    return (
        <div className="table-responsive">
            <table className={ classNames("table", dataContent.length > 0 ? "table-hover" : "") }>
                <thead className="text-primary">
                    <Row>{ columnContent }</Row>
                </thead>
                <tbody>
                    { dataContent.length > 0 ? dataContent : noContent }
                </tbody>
            </table>
        </div>
    );
};