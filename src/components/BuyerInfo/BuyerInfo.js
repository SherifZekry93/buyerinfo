import React from 'react';
import styles from './info.module.css'; // Import css modules stylesheet as styles
import axios from 'axios';
import Loading from '../Loding/Loading';
import BuyerDataTable from '../BuyersDataTable/BuyersDataTable'
import { Button, Container, Row, Col } from 'react-bootstrap/';
import { withRouter } from 'react-router';
import { Fragment } from 'react';
class BuyerAllInfo extends React.Component {
    state = {
        hasErrorLodingData: false,
        isLoading: false,
        buyers: [],
        quiz: [],
        nonquiz: [],
        notactive: []
    }
    getData() {
        this.setState({
            isLoading: true
        })
        axios.get(`https://6pd5d2n7g5.execute-api.us-east-1.amazonaws.com/Prod/`)
            .then(res => {
                const buyers = res.data;
                const quiz = buyers.filter((buyer) => {
                    return buyer.quiz.is_enabled === 1 && buyer.is_active === 1
                }).sort((x, y) => {
                    return x.quiz.rank - y.quiz.rank
                });
                const nonquiz = buyers.filter((buyer) => {
                    return buyer.non_quiz.is_enabled === 1 && buyer.is_active === 1
                }).sort((x, y) => {
                    return x.non_quiz.rank - y.non_quiz.rank;
                });
                const notactive = buyers.filter((buyer) => {
                    return buyer.is_active === 0
                });
                this.setState({ notactive, nonquiz: nonquiz, quiz: quiz, isLoading: false });
            }).catch((err) => {
                console.log('this is the error', err);
                this.setState({
                    isLoading: false,
                    hasErrorLodingData: true
                })
            })
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }
        if (this.state.hasErrorLodingData) {
            return 'Error Loading Data';
        }
        let componentsToRender = [];
        if (this.state.quiz.length > 0) {
            componentsToRender.push(
                <Fragment key="firstComponent">
                    <Row>
                        <Col>
                            <h3 className="text-left graytext">Accept Quiz Leads</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <BuyerDataTable noHeader={true} fixedHeader={false} buyers={this.state.quiz} type="quiz" />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={9}></Col>
                        {/* <Col xs={3}>
                            <Button onClick={() => {
                                this.props.history.push("addBuyer")
                            }} variant="primary" className={styles.fullWidth.concat(" mt-2")}>
                                Add Buyer
                            </Button>
                        </Col> */}
                    </Row>
                </Fragment>
            )
        }
        if (this.state.nonquiz.length > 0) {
            componentsToRender.push(<Fragment key="secondComponent">
                <Row className="mt-5">
                    <Col>
                        <h3 className="text-left graytext">Accept NonQuiz Leads</h3>
                    </Col>
                </Row>
                <Row>
                    <BuyerDataTable noHeader={true} fixedHeader={false} buyers={this.state.nonquiz} type="nonquiz" />
                </Row>
                <Row>
                    <Col xs={9}>

                    </Col>
                </Row>
            </Fragment>)
        }
        if (this.state.notactive.length > 0) {
            componentsToRender.push(<Fragment key="thirdComponent">
                <Row className="mt-5">
                    <Col>
                        <h3 className="text-left graytext">Inactive Buyers</h3>
                    </Col>
                </Row>
                <Row>
                    <BuyerDataTable noHeader={true} fixedHeader={false} buyers={this.state.notactive} type="notactive" />
                </Row>
                <Row>
                    <Col xs={9}>

                    </Col>
                </Row>
            </Fragment>)
        }
        componentsToRender.push(
            <Row className="mt-5" key="fourthComponent">
                <Col xs={9} md={10} lg={11}>
                </Col>
                <Col xs={3} md={2} lg={1}>
                    <Button size="sm" onClick={() => {
                        this.props.history.push("addBuyer")
                    }} variant="primary" className={styles.fullWidth.concat(" mt-3")}>
                        Add Buyer
                    </Button>
                </Col>
            </Row>
        )
        return <Container>{componentsToRender}</Container>;
    }
}

export default withRouter(BuyerAllInfo);