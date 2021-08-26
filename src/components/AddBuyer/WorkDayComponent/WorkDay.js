import React from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import { Form, Row, Col, ToggleButton, ButtonGroup } from "react-bootstrap";
import { Component } from 'react';

class WorkDay extends Component {

    handleDayChange = (val) => {
        this.props.changeDay(this.props.name, val)
    }
    handleOpenTimeChange = (val) => {
        this.props.openTimeChange(this.props.name, val);
    }
    handleCloseTimeChange = (val) => {
        this.props.closeTimeChange(this.props.name, val);
    }
    render() {
        const props = this.props;
        return <Row>
            <Form.Label >
                {props.day}
            </Form.Label>
            <Col>
                <Form.Label>
                    Open
                </Form.Label>
                <br></br>
                <ButtonGroup>
                    <ToggleButton
                        id={props.id1}
                        type="radio"
                        variant='outline-success'
                        name={props.name}
                        value="1"
                        checked={props.checked === 1}
                        onChange={(e) => this.handleDayChange(e.currentTarget.value)}>
                        Yes
                    </ToggleButton>
                    <ToggleButton
                        id={props.id2}
                        type="radio"
                        variant='outline-danger'
                        name={props.name}
                        value="0"
                        checked={props.checked === 0}
                        onChange={(e) => this.handleDayChange(e.currentTarget.value)}>
                        No
                    </ToggleButton>

                </ButtonGroup>
            </Col>
            <Col>
                <Form.Label >
                    From
                </Form.Label>
                <TimePicker value={this.props.openValue * 3600}
                    step={60}
                    disabled={this.props.checked !== 1}
                    onChange={(e) => this.handleOpenTimeChange(e)} />
            </Col>
            <Col>
                <Form.Label >
                    To
                </Form.Label>
                <TimePicker
                    step={60}
                    value={this.props.closeValue * 3600}
                    disabled={this.props.checked !== 1}
                    onChange={(e) => this.handleCloseTimeChange(e)} />
            </Col>
        </Row>

    }
}
export default WorkDay;