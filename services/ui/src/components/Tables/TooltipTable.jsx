import classNames from "classnames/dedupe";
import React from "react";
import { Table } from "reactstrap";
import {
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";

export const TooltipTable = ({ title, columns, data, ...props}) =>
    <Table responsive={ true } { ...props }>
        <thead className="text-primary">
            <tr>
                { columns.map(index => <th key={ index } className="text-center">{ index }</th>) }
            </tr>
        </thead>
        <tbody>
            {
                data.map(row => (
                    <tr key={ row.id }>{ row.map(col => ( col.tip ? (
                        <OverlayTrigger
                            key={ title }
                            id={ title }
                            delay={ { show: 250, hide: 400 } }
                            overlay={
                                <Tooltip>
                                    { col.tip }
                                </Tooltip>
                            }
                        >
                            <td
                                key={ col.value }
                                className={ classNames("text-center", col.className) }
                                style={ { "cursor": "pointer" } }
                            >
                                { col.value }
                            </td>
                        </OverlayTrigger>
                    ) : (
                        <td key={ col.value } className={ classNames("text-center", col.className) }>{ col.value }</td>
                    )
                    )) }</tr>
                ))
            }
        </tbody>
    </Table>;
