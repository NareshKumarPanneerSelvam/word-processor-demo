import React from 'react';
import styles from './Spinner.module.css'


const Spinner = () => {
  return (
    <div className={styles['spinner-container']}>
        <div className={styles['dot-spinner']}>
            <div className={styles['dot']} />
            <div className={styles['dot']} />
            <div className={styles['dot']} />
            <div className={styles['dot']} />
        </div>
    </div>
  );
};

export default Spinner;