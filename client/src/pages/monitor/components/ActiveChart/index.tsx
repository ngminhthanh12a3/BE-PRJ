import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import { Area } from '@ant-design/charts';
import {  Line } from '@ant-design/plots';
import { Statistic } from 'antd';
import { useModel } from 'umi';

import styles from './index.less';



export default () => {
  const {DataChartRef, DataChart} = useModel('deviceData');
  // const activeData = [
  //   264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
  // ];
  // console.log(DeviceData);
//   const config = {
//   data: [],
//   padding: 'auto',
//   xField: 'Time',
//   yField: 'Value',
//   xAxis: {
//     range: [0, 1],
//   },
//   seriesField: 'category',
// };
  const config = {
    autoFit: true,
    height: 500,
    data: DataChart,
    // meta: {
    //   cpu: {
    //     time: {
    //       type: 'cat',
    //     },
    //     max: 100,
    //     min: 0,
    //   },
    // },
    xField: 'Time',
    yField: 'Value',
    seriesField: 'category',
    tooltip: {
      showMarkers: false,
    },
    // point: {
    //   shape: 'breath-point',
    // },
  };
const activeData = [0];
    return <div className={styles.activeChart} key={`1-`}>
        <Statistic title="MAX30102 Values" value="Expected" key={`Statistic-`}/>
        <div style={{ marginTop: 32 }} key={`2-`}>
          {/* <Area {...config} chartRef={DataChartRef}/> */}
          <Line {...config} chartRef={DataChartRef} yAxis={{minLimit:200000, maxLimit:250000}}/>
        </div>
        {activeData && (
          <div key={`3-`}>
            <div className={styles.activeChartGrid} key={`4-`}>
              <p key={`5-`}></p>
              <p></p>
            </div>
            <div className={styles.dashedLine} key={`6-`}>
              <div className={styles.line} key={`7-`}/>
            </div>
            <div className={styles.dashedLine} key={`8-`}>
              <div className={styles.line} key={`9-`}/>
            </div>
          </div>
        )}
        {activeData && (
          <div className={styles.activeChartLegend} key={`10-`}>
            <span>0</span>
            <span>{activeData[Math.floor(activeData.length / 2)]}</span>
            <span>{activeData.length}</span>
          </div>
        )}
      </div>
  // })
  
};