import DataTable from "react-data-table-component";
import React from "react";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router";
const numberFormatter = (phoneNumberString) => {
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        let intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
};

const BuyerDataTable = (props) => {
    const columns = [
        {
            name: 'Buyer Name',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.name}</div>{ }</div>
        },
        {
            name: 'Lead Types',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.lead_types.map((lead) => lead.code).join(", ")}</div>{ }</div>
        },
        {
            name: 'Phone',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{numberFormatter(row.phone)}</div>{ }</div>
        },
        // {
        //     name: 'Status',
        //     sortable: true,
        //     cell: row => <div data-tag="allowRowEvents"><div style={{}}>{
        //         row.isActive === 1 ? <Button variant="success" size="sm">Active</Button> :
        //             <Button variant="danger" size="sm">Not Active</Button>
        //     }</div>{ }</div>
        // },
    ];
    if (props.type === "notactive") {
        columns.splice(3, 0, {
            name: 'Quiz Percentage',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.quiz.percentage + "%"}</div>{ }</div>
        });
        columns.splice(3, 0, {
            name: 'Non Quiz Percentage',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.nonQuiz.percentage + "%"}</div>{ }</div>
        });
        // columns.splice(3, 0, {
        //     name: 'Accept Quiz',
        //     sortable: true,
        //     cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.quiz.isEnabled === 1 ? <Button variant="success" size="sm">Yes</Button> :
        //         <Button variant="danger" size="sm">No</Button>}</div>{ }</div>
        // });
        // columns.splice(3, 0, {
        //     name: 'Accept Non Quiz',
        //     selector: 'year',
        //     sortable: true,
        //     cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.nonQuiz.isEnabled === 1 ? <Button variant="success" size="sm">Yes</Button> :
        //         <Button variant="danger" size="sm">No</Button>}</div>{ }</div>
        // });
    }
    if (props.type === "quiz") {
        columns.splice(3, 0, {
            name: 'Quiz Percentage',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.quiz.percentage + "%"}</div>{ }</div>
        })
        columns.splice(3, 0, {
            name: 'Rank',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.rank}</div>{ }</div>
        })
    }

    if (props.type === "nonquiz") {
        columns.splice(3, 0, {
            name: 'Non Quiz Percentage',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.nonQuiz.percentage + "%"}</div>{ }</div>
        })
        columns.splice(3, 0, {
            name: 'Rank',
            sortable: true,
            cell: row => <div data-tag="allowRowEvents"><div style={{}}>{row.rank}</div>{ }</div>
        })
    }
    columns.push({
        name: 'Edit',
        sortable: true,
        cell: row => <div data-tag="allowRowEvents"><div style={{}}>{
            <Button variant="primary" size="sm" onClick={() => {
                props.history.push("/addBuyer", { buyer: row })
            }}>Edit</Button>
        }</div>{ }</div>
    })
    return <DataTable
        columns={columns}
        data={props.buyers}
        striped
    />
}
export default withRouter(BuyerDataTable);
