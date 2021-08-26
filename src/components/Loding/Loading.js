import React from 'react';
import { Spinner } from 'react-bootstrap';

import styles from './loading.module.css';
function Loading() {
    return <div className={styles.LoaderContainer}>
        <Spinner className={styles.spinnyspin} animation="border" role="status">
        </Spinner>
        <span>Loading...</span>
    </div>

}

export default Loading;
