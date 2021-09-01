import axios from "axios";
import React, { Component } from "react"
import { Form, Button, Container, Row, Col, ToggleButton, ButtonGroup, Spinner } from "react-bootstrap";
import { withRouter } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import style from './AddBuyer.module.css'
// import TimePicker from 'react-bootstrap-time-picker';
import WorkDay from './WorkDayComponent/WorkDay'
const allStateCodes =
    [
        'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA',
        'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA',
        'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
        'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
        'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
class AddBuyer extends Component {
    getDefaultData = () => {
        const buyer = this.props.location?.state?.buyer
        if (buyer) {
            return buyer
        }
        const newID = uuidv4();
        const defaultData = {
            'id': newID,
            "name": "",
            "lead_types": [],
            "phone": "",
            "handoff_script": "",
            "sell": 0,
            "duration": 0,
            "quiz": {
                "is_enabled": 0,
                "percentage": 100
            },
            "non_quiz": {
                "is_enabled": 0,
                "percentage": 100
            },
            "working_days": {
                "Mon": {
                    "is_open": 1, //indicates if open on that day
                    "Hours": {
                        "open": 9,
                        "close": 5
                    }
                },
                "Tue": {
                    "is_open": 1, //indicates if open on that day
                    "Hours": {
                        "open": 9,
                        "close": 5
                    }
                },
                "Wed": {
                    "is_open": 1, //indicates if open on that day
                    "Hours": {
                        "open": 9,
                        "close": 5
                    }
                },
                "Thu": {
                    "is_open": 1, //indicates if open on that day
                    "Hours": {
                        "open": 9,
                        "close": 5
                    }
                },
                "Fri": {
                    "is_open": 1, //indicates if open on that day
                    "Hours": {
                        "open": 9,
                        "close": 5
                    }
                },
                "Sat": {
                    "is_open": 1, //indicates if open on that day
                    "Hours": {
                        "open": 9,
                        "close": 5
                    }
                },
                "Sun": {
                    "is_open": 0, //indicates if open on that day
                    "Hours": {
                        "open": "",
                        "close": ""
                    }
                },
            },
            "states": [
            ],
            "rank": 0,
            "is_active": 1
        }
        return buyer ? buyer : defaultData;
    }
    state = {
        isLoading: false,
        buyerObject: this.getDefaultData(),
        formData: {
            leadType: "",
            isSubmitted: false
        },
        isAddLeadEnabled: 0
    }
    submitToDataBase = () => {
        this.setState({
            isLoading: true
        })
        if (this.handleValidation()) {
            this.uploadBuyer();
        }
        else {
            this.setState({
                isLoading: false
            })
        }
    }
    handleValidation = () => {
        if (this.state.formData.isSubmitted === false) {
            const formData = this.state.formData;
            formData.isSubmitted = true
            this.setState({
                formData: formData
            });
        }
        let fields = this.state.buyerObject;
        let errors = {};
        let formIsValid = true;
        //Name
        if (typeof fields["name"] !== "undefined" && fields["name"] === "") {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        }
        //Leads
        if (fields.lead_types.length === 0) {
            formIsValid = false;
            errors["leads"] = "You must enter at least one lead";
        }
        //States
        if (fields.states.length === 0) {
            formIsValid = false;
            errors["states"] = "You must enter at least one state";
        }
        //Sell
        if (fields.sell === 0 || fields.sell === "") {
            formIsValid = false;
            errors["sell"] = "You must enter the sell amount";
        }
        //Rank
        if (fields.rank === 0 || fields.rank === "") {
            formIsValid = false;
            errors["rank"] = "You must enter the rank";
        }
        //QUIZ
        // if (fields.quiz.isEnabled === 1) {
        //     if (fields.quiz.percentage === "" || fields.quiz.percentage === 0) {
        //         formIsValid = false;
        //         errors["percentage"] = "You must enter percentage for quiz transfers";
        //     }
        // }
        //NonQuiz
        // if (fields.nonQuiz.isEnabled === 1) {
        //     if (fields.nonQuiz.percentage === "" || fields.nonQuiz.percentage === 0) {
        //         formIsValid = false;
        //         errors["nonquizpercentage"] = "You must enter percentage for non quiz transfers";
        //     }
        // }
        // console.log('', fields.phone);
        if (!fields.phone || fields.phone === ""
            || fields.phone.length < 9) {
            formIsValid = false;
            errors["phone"] = "invalid phone number";
        }
        this.setState({ errors: { ...errors } });
        return formIsValid;
    }

    updateLeadField = (name, e) => {
        const currentLeadType = this.state.buyerObject.lead_types.filter((led) => led.code === e.target.value).length === 0
        // console.log('this is current lead type', currentLeadType);
        const frmData = this.state.formData;
        frmData[name] = e.target.value;
        this.setState({
            formData: frmData
        });
        if (this.state.formData.leadType !== "" && currentLeadType) {
            this.setState({
                isAddLeadEnabled: true,
            });
        }
        else {
            this.setState({
                isAddLeadEnabled: false
            });
        }
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateActiveStatus = (val) => {
        const buyerData = this.state.buyerObject;
        buyerData["is_active"] = parseInt(val, 10);
        this.setState({
            buyerObject: buyerData
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateFormData = (name, e) => {
        const frmData = this.state.formData;
        frmData[name] = e.target.value;
        this.setState({
            formData: frmData
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }
    addNewState = () => {

    }
    updateBuyerObject = (name, e) => {
        const buyer = this.state.buyerObject;
        buyer[name] = e.target.value;
        this.setState({
            buyerObject: buyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    addState = (val) => {
        console.log('this is the val',val);
        const currentState = val;
        if (!this.state.buyerObject.states.map((st) => st.code).includes(currentState)) {
            const oldBuyer = this.state.buyerObject;
            oldBuyer.states.push({ code: currentState, "is_enabled": 1});
            this.setState({
                buyerObject: oldBuyer
            });
        }
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateLeadTypes = () => {
        const oldLeadTypes = this.state.buyerObject.lead_types;
        oldLeadTypes.push({ "code": this.state.formData.leadType.toUpperCase(), "is_enabled": 1 });
        const newBuyerObject = this.state.buyerObject;
        newBuyerObject.lead_types = oldLeadTypes;
        const newFormData = this.state.formData;
        newFormData.leadType = ""
        this.setState({
            buyerObject: newBuyerObject,
            formData: newFormData,
            isAddLeadEnabled: ""
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }


    uploadBuyer = () => {
        axios.post('https://6pd5d2n7g5.execute-api.us-east-1.amazonaws.com/Prod/', JSON.stringify(this.state.buyerObject))
            .then(_ => {
                this.setState({
                    buyer: this.getDefaultData(),
                    isLoading: false
                })
                alert(`buyer was ${this.props.location?.state?.buyer ? "updated" : "added"} successfully`);
                this.props.history.push('/');
            }
            ).catch(err => {
                alert('there was an error', err);
            });
    }

    removeLeadType = (i) => {
        this.state.buyerObject.lead_types.splice(i, 1);
        const newLeadTypes = this.state.buyerObject.lead_types;
        const newBuyerObject = this.state.buyerObject;
        newBuyerObject.lead_types = newLeadTypes;
        this.setState({
            buyerObject: newBuyerObject
        })
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    removeState = (i) => {
        this.state.buyerObject.states.splice(i, 1);
        const newStates = this.state.buyerObject.states;
        const newBuyerObject = this.state.buyerObject;
        newBuyerObject.states = newStates;
        this.setState({
            buyerObject: newBuyerObject
        })
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updaateQuizStatus = (val) => {
        const newBuyer = this.state.buyerObject;
        newBuyer.quiz.is_enabled = parseInt(val, 10);
        this.setState({
            buyerObject: newBuyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updaateNonQuizStatus = (val) => {
        const newBuyer = this.state.buyerObject;
        newBuyer.non_quiz.is_enabled = parseInt(val, 10);
        this.setState({
            buyerObject: newBuyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateQuizLeadsPercentage = (val) => {
        const buyer = this.state.buyerObject;
        buyer.quiz.percentage = parseInt(val);
        this.setState({
            buyerObject: buyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateNonQuizLeadPercentage = (val) => {
        const buyer = this.state.buyerObject;
        buyer.non_quiz.percentage = val;
        this.setState({
            buyerObject: buyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateDay = (dayName, val) => {
        const currentBuyer = this.state.buyerObject;
        currentBuyer.working_days[dayName].is_open = parseInt(val, 10);
        this.setState({
            currentBuyer: currentBuyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateOpenTime = (name, val) => {
        const hour = (parseInt(val, 10) / 3600);
        const currentBuyer = this.state.buyerObject;
        currentBuyer.working_days[name].Hours.open = hour;
        console.log(currentBuyer.working_days[name].Hours.open);
        this.setState({
            currentBuyer: currentBuyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }

    updateCloseTime = (name, val) => {
        const hour = (parseInt(val) / 3600);
        const currentBuyer = this.state.buyerObject;
        currentBuyer.working_days[name].Hours.close = hour;
        // console.log(currentBuyer.working_days[name].Hours.close);
        this.setState({
            currentBuyer: currentBuyer
        });
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }
    updatePhoneNumber = (e) => {
        var phoneRe = /^[0-9]\d{0,9}$/;
        if (e.target.value === '' || phoneRe.test(e.target.value)) {
            const buyerObjcet = this.state.buyerObject;
            buyerObjcet.phone = e.target.value;
            this.setState({ buyerObjcet: buyerObjcet })
        }
        else {
            e.preventDefault();
        }
        if (this.state.formData.isSubmitted) {
            this.handleValidation();
        }
    }
    goBack = () => {
        this.props.history.push("/")
    }
    render() {
        return <>
            <Container>
                <br></br>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                    <div>
                        <Button size="sm" style={{ fontWeight: "bold", fontSize: "14px" }} onClick={this.goBack}>
                            Back
                        </Button>
                    </div>
                    <h2 className="text-center">{this.props.location?.state?.buyer ? "Edit Buyer" : "Add New Buyer"}</h2>
                    <div>
                    </div>
                </div>
                <Row>
                    <Col md={2} xs={0} />
                    <Col md={8} xs={12}>
                        <Form>
                            <Row>
                                <Form.Group className="mb-3" >
                                    <Form.Label className="text-left" >Buyer Name:</Form.Label>
                                    <Form.Control placeholder="Buyer Name" value={this.state.buyerObject.name} onChange={(e) => {
                                        this.updateBuyerObject("name", e);
                                    }} />
                                    <span className={style.helpBlock}>
                                        {this.state.errors?.name}
                                    </span>

                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} xs={9} md={9} className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Lead Types:</Form.Label>
                                    <Form.Control type="text" placeholder="Lead Types" value={this.state.formData.leadType} onChange={(e) => this.updateLeadField("leadType", e)} />
                                </Form.Group>
                                <Form.Group as={Col} xs={3} md={3} className="mb-3" controlId="formBasicPassword">
                                    <br></br>
                                    <Button style={{ width: "100%" }} className="mt-2" onClick={this.updateLeadTypes} disabled={!this.state.isAddLeadEnabled}>Add</Button>
                                </Form.Group>
                                <Form.Group>
                                    {this.state.buyerObject.lead_types.map((leadType, item) => {
                                        return <span key={item} className={style.leadType}> <span style={{ "flex": 1 }}>{leadType.code}</span>
                                            <span className={style.closeButton} onClick={() => {
                                                this.removeLeadType(item)
                                            }}>X</span></span>;
                                    })}
                                </Form.Group>
                                <span className={style.helpBlock}>
                                    {this.state.errors?.leads}
                                </span>

                            </Row>
                            <Row>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Phone:</Form.Label>
                                    <Form.Control type="text" placeholder="Phone" value={this.state.buyerObject.phone} onChange={(e) => this.updatePhoneNumber(e)} />
                                    <span className={style.helpBlock}>{
                                        this.state.errors?.phone
                                    }</span>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} xs={12} className="mb-3">
                                    <Form.Label>States:</Form.Label>
                                    <Form.Select as="select" multiple aria-label="Floating label select example" value={this.state.formData.state} onChange={(e) => this.addState(e.target.value)}>
                                        <option value="1">Select State</option>
                                        {
                                            allStateCodes.map((state, item) => {
                                                return <option key={item} value={state}>{state}</option>
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                                <span className={style.helpBlock}>
                                    {this.state.errors?.states}
                                </span>
                                <Form.Group>
                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                        {this.state.buyerObject.states.map((state, item) => {
                                            return <span key={item} className={style.leadType.concat(" mb-2")}><span style={{ "flex": 1 }}> {state.code} </span><span className={style.closeButton} onClick={() => {
                                                this.removeState(item)
                                            }}>X</span></span>;
                                        })}
                                    </div>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group>
                                    <Form.Label>Sell Amount:</Form.Label>
                                    <Form.Control type="number" placeholder="Sell Amount" value={this.state.buyerObject.sell} onChange={(e) => this.updateBuyerObject("sell", e)} />
                                    <span className={style.helpBlock}>
                                        {this.state.errors?.sell}
                                    </span>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group>
                                    <Form.Label>Duration:</Form.Label>
                                    <Form.Control type="number" placeholder="Duration" value={this.state.buyerObject.duration} onChange={(e) => this.updateBuyerObject("duration", e)} />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group>
                                    <Form.Label>Rank:</Form.Label>
                                    <Form.Control type="number" placeholder="Rank" value={this.state.buyerObject.rank} onChange={(e) => this.updateBuyerObject("rank", e)} />
                                    <span className={style.helpBlock}>
                                        {this.state.errors?.rank}
                                    </span>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} xs={12}>
                                    <br></br>
                                    <Form.Label >Accept Quiz Leads:</Form.Label>
                                    <br>
                                    </br>
                                    <ButtonGroup >
                                        <ToggleButton
                                            id="radio2-0"
                                            type="radio"
                                            variant='outline-success'
                                            name="radioQuiz"
                                            value={1}
                                            checked={this.state.buyerObject.quiz.is_enabled === 1}
                                            onChange={(e) => this.updaateQuizStatus(e.currentTarget.value)}
                                        >
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton
                                            id="radio2-1"
                                            type="radio"
                                            variant='outline-danger'
                                            name="radioQuiz"
                                            value={0}
                                            checked={this.state.buyerObject.quiz.is_enabled === 0}
                                            onChange={(e) => this.updaateQuizStatus(e.currentTarget.value)}
                                        >
                                            No
                                        </ToggleButton>
                                        {
                                            this.state.buyerObject.quiz.is_enabled === 1 ?
                                                <Form.Control className=" ml-2" type="number" placeholder="Percentage" min="1" max="100" value={this.state.buyerObject.quiz.percentage} onChange={(e) => this.updateQuizLeadsPercentage(e.target.value)} /> : ""
                                        }

                                    </ButtonGroup>

                                </Form.Group>
                                <span className={style.helpBlock}>
                                    {this.state.errors?.percentage}
                                </span>
                            </Row>
                            <Row className="mt-2">
                                <Form.Group as={Col} xs={12}>
                                    <Form.Label>Accept Non Quiz Leads:</Form.Label>
                                    <br>
                                    </br>
                                    <ButtonGroup >
                                        <ToggleButton
                                            id="radio3-0"
                                            type="radio"
                                            variant='outline-success'
                                            name="radiononQuiz"
                                            value={1}
                                            checked={this.state.buyerObject.non_quiz.is_enabled === 1}
                                            onChange={(e) => this.updaateNonQuizStatus(e.currentTarget.value)}
                                        >
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton
                                            id="radio3-1"
                                            type="radio"
                                            variant='outline-danger'
                                            name="radiononQuiz"
                                            value={0}
                                            checked={this.state.buyerObject.non_quiz.is_enabled === 0}
                                            onChange={(e) => this.updaateNonQuizStatus(e.currentTarget.value)}
                                        >
                                            No
                                        </ToggleButton>
                                        {
                                            this.state.buyerObject.non_quiz.is_enabled === 1 ?
                                                <Form.Control min="1" value={this.state.buyerObject.non_quiz.percentage} className=" ml-2" type="number" placeholder="Percentage" onChange={(e) => this.updateNonQuizLeadPercentage(e.target.value)} /> : ""
                                        }
                                    </ButtonGroup>
                                </Form.Group>
                                <span className={style.helpBlock}>
                                    {this.state.errors?.nonquizpercentage}
                                </span>
                            </Row>
                            <Row className="mt-2">
                                <Form.Group>
                                    <Form.Label>Active:</Form.Label>
                                    <br>
                                    </br>
                                    <ButtonGroup>
                                        <ToggleButton
                                            id="radio-0"
                                            type="radio"
                                            variant='outline-success'
                                            name="radio"
                                            value="1"
                                            checked={this.state.buyerObject.is_active === 1}
                                            onChange={(e) => this.updateActiveStatus(e.currentTarget.value)}>
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton
                                            id="radio-1"
                                            type="radio"
                                            variant='outline-danger'
                                            name="radio"
                                            value="0"
                                            checked={this.state.buyerObject.is_active === 0}
                                            onChange={(e) => this.updateActiveStatus(e.currentTarget.value)}>
                                            No
                                        </ToggleButton>

                                    </ButtonGroup>

                                </Form.Group>
                            </Row>
                            <hr></hr>
                            <Row className="mt-3">
                                <Form.Label>Working Days:</Form.Label>
                            </Row>
                            <WorkDay day="Monday"
                                id1="mon"
                                id2="mon2"
                                name="Mon"
                                checked={this.state.buyerObject.working_days.Mon.is_open}
                                changeDay={this.updateDay}
                                openValue={this.state.buyerObject.working_days.Mon.Hours.open}
                                closeValue={this.state.buyerObject.working_days.Mon.Hours.close}
                                openTimeChange={this.updateOpenTime}
                                closeTimeChange={this.updateCloseTime}
                            />
                            <br></br>
                            <WorkDay day="Tuesday"
                                name="Tue"
                                id1="tue"
                                id2="tue2"
                                checked={this.state.buyerObject.working_days.Tue.is_open}
                                changeDay={this.updateDay}
                                openValue={this.state.buyerObject.working_days.Tue.Hours.open}
                                closeValue={this.state.buyerObject.working_days.Tue.Hours.close}
                                openTimeChange={this.updateOpenTime}
                                closeTimeChange={this.updateCloseTime}
                            />
                            <br></br>
                            <WorkDay day="Wednesday"
                                name="Wed"
                                id1="wed"
                                id2="wed2"
                                checked={this.state.buyerObject.working_days.Wed.is_open}
                                changeDay={this.updateDay}
                                openValue={this.state.buyerObject.working_days.Wed.Hours.open}
                                closeValue={this.state.buyerObject.working_days.Wed.Hours.close}
                                openTimeChange={this.updateOpenTime}
                                closeTimeChange={this.updateCloseTime}
                            />
                            <br></br>
                            <WorkDay day="Thursday"
                                name="Thu"
                                id1="thu"
                                id2="thu2"
                                checked={this.state.buyerObject.working_days.Thu.is_open}
                                changeDay={this.updateDay}
                                openValue={this.state.buyerObject.working_days.Thu.Hours.open}
                                closeValue={this.state.buyerObject.working_days.Thu.Hours.close}
                                openTimeChange={this.updateOpenTime}
                                closeTimeChange={this.updateCloseTime}
                            />
                            <br></br>
                            <WorkDay day="Friday"
                                name="Fri"
                                id1="fri"
                                id2="fri2"
                                checked={this.state.buyerObject.working_days.Fri.is_open}
                                changeDay={this.updateDay}
                                openValue={this.state.buyerObject.working_days.Fri.Hours.open}
                                closeValue={this.state.buyerObject.working_days.Fri.Hours.close}
                                openTimeChange={this.updateOpenTime}
                                closeTimeChange={this.updateCloseTime}
                            />
                            <br></br>
                            <WorkDay day="Saturday"
                                name="Sat"
                                id1="sat"
                                id2="sat2"
                                checked={this.state.buyerObject.working_days.Sat.is_open}
                                changeDay={this.updateDay}
                                openValue={this.state.buyerObject.working_days.Sat.Hours.open}
                                closeValue={this.state.buyerObject.working_days.Sat.Hours.close}
                                openTimeChange={this.updateOpenTime}
                                closeTimeChange={this.updateCloseTime}
                            />
                            <br></br>
                            <WorkDay day="Sunday"
                                name="Sun"
                                id1="sun"
                                id2="sun2"
                                checked={this.state.buyerObject.working_days.Sun.is_open}
                                changeDay={this.updateDay}
                                openValue={this.state.buyerObject.working_days.Sun.Hours.open}
                                closeValue={this.state.buyerObject.working_days.Sun.Hours.close}
                                openTimeChange={this.updateOpenTime}
                                closeTimeChange={this.updateCloseTime}
                            />
                            <br />
                            <Button onClick={this.submitToDataBase} variant="primary" disabled={this.state.isLoading}>
                                Submit{this.state.isLoading ?
                                    <Spinner animation="border" role="status" size="sm">
                                    </Spinner>
                                    : ""}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    }
}
export default withRouter(AddBuyer);