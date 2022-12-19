import React, { Component } from "react";
import { CheckOutlined, InfoCircleOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, message, Progress, Row, Space, Spin, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
// import { useState } from 'react';
import { useModel } from 'umi';
import ActiveChart from './components/ActiveChart';
// import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";
import { ChartCard, Field } from "./components/Charts";

const optionalServices = "6f576859-4372-45ff-b05b-7527a51f6867" // Required to access service later.
import styles from './style.less';

// interface CConfigLEDsType
// {
//   id:String,
//   name: String,
//   data: any[],
//   colors: String[],
//   text: String
// }
const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  style: { marginBottom: 24 },
};

export default () => {
  const {GattConnect, setGattConnect, 
        DeviceData, LabelVal, DeviceMaxLen, 
        DevDataCount, setDevDataCount, 
        DataChart, setDataChart, 
        CHARACTERISTIC_UUID,
        isCalculate, setIsCalculate,
        HEART_RATE,
        setHEART_RATE,
        SPO2, setSPO2,
        lastCalculate, setLastCalculate,
        isCalculating, setIsCalculating
        } = useModel('deviceData');
  
    const CConfig = {
        options: {
            chart: {
                id: 'LEDs value',
                animations: {
                  enabled: true,
                  easing: 'linear',
                  dynamicAnimation: {
                    speed: 500
                  }
                },
                toolbar: {
                  show: false
                },
                zoom: {
                  enabled: false
                },
                type: 'line',
                height: 160,
                stacked: false
            },
            dataLabels: {
                enabled: false
              },
            stroke: {
                curve: 'smooth'
            },
            markers: {
                size: 0
            },
            plotOptions: {
              bar: {
                columnWidth: "20%"
              }
            },
            xaxis:{

            },
            yaxis: {
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                // color: "#FF1654"
              },
            },
          
          colors: ["#FF1654", "#247BA0"],
          tooltip: {
            shared: false,
            intersect: true,
            x: {
              show: false
            }
          },
          legend: {
            horizontalAlign: "left",
            // offsetX: 40
          }
      },
      series: [
        {
          name: "RED",
          data: DataChart.RED
        },
        {
          name: "IR",
          data: DataChart.IR
        }
      ]}
    const CHARACTERISTICVALUECHANGED = [handleCharacteristicValueChanged, handleStartCalculateValueChanged]
    
    async function handleCharacteristicValueChanged(event:any){
        const {value} = event.target;
        const {buffer} = value;

        // console.log(buffer);
        //
        // const RED_VAL = new Uint32Array(buffer.slice(0, 3 + 1))[0];
        // const IR_VAL = new Uint32Array(buffer.slice(4, 7 + 1))[0];
        // const SPO2_VAL = new Int32Array(buffer.slice(8, 11 + 1))[0];
        // const HEAR_RATE_VAL = new Int32Array(buffer.slice(12, 15 + 1))[0];
        const RED_BUF = new Uint16Array(buffer.slice(0, 199 + 1));
        const IR_BUF = new Uint16Array(buffer.slice(200, 399 + 1));
        const _SPO2 = new Uint32Array(buffer.slice(400, 403 + 1))[0];
        const _HR = new Uint32Array(buffer.slice(404, 407 + 1))[0];
        // console.log(SPO2, HR);
        // console.log(Array.from(RED_BUF), Array.from(IR_BUF));
        // // console.log(SPO2_VAL, HEAR_RATE_VAL);

        // //
        // DeviceData.current.RED.push(RED_VAL);
        // DeviceData.current.IR.push(IR_VAL);
        
        // //
        // if( DeviceData.current.IR.length > DeviceMaxLen)
        // {
        //     DeviceData.current.RED.shift();
        //     DeviceData.current.IR.shift();
        // }        

        // // setDevDataCount((preDevDataCount:any) => preDevDataCount + 1);
        setSPO2(_SPO2);
        setHEART_RATE(_HR);
        setDataChart({
            RED: Array.from(RED_BUF),
            IR: Array.from(IR_BUF)
          });
        setLastCalculate(new Date().toLocaleString())

        if(!isCalculate)
          setIsCalculating(false);
        // setIsCalculate(false);
        // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
    }

    function handleStartCalculateValueChanged(event:any) {

    }


    //
    async function onDisconnected(event:any) {
      // presets
      //
      setGattConnect(undefined);
      for await(let value of Object.keys(DeviceData.current))
      {
        // console.log(value);
        while(DeviceData.current[value].length)
          DeviceData.current[value].pop();

      }
      setIsCalculate(false);
    }

    const ConnectOnClick = async () => {
        
            if('bluetooth' in navigator)
            {
              // console.log(navigator.bluetooth);
              await navigator.bluetooth.requestDevice({ 
                      // acceptAllDevices: true,
                      // optionalServices: [optionalServices] 
                      filters: [{ services: [optionalServices] }] 
                  })
                  .then((device:any)=> {
                    // Set up event listener for when device gets disconnected.
                    device.addEventListener('gattserverdisconnected', onDisconnected);

                    // Attempts to connect to remote GATT Server.
                    return device.gatt.connect()
                  })
                  .then(async (server:any) => {
                          await setGattConnect(server);
                          return server.getPrimaryService(optionalServices)
                      })
                      .then(async (service:any) => {
                              let i = 0;
                              for await (let characteristic of CHARACTERISTIC_UUID)
                              {
                                      await service.getCharacteristic(characteristic).then((characteristic:any) => characteristic.startNotifications())
                                      .then((characteristic:any) => {
                                      characteristic.addEventListener('characteristicvaluechanged',
                                                                      CHARACTERISTICVALUECHANGED[i++]);
                                      // console.log('Notifications have been started.');
                  })
                  .catch((error:any) => { 
                    console.error(error); 
                    message.error("Pairing Error!");
                  });
                              }
          });
      // con
      // await setGattConnect(gattconnect);
      }

    }

    const DisconnectOnClick = async () => {
        if(GattConnect)
          GattConnect.disconnect();
    }

    const StartToCalculating = () => {
      setIsCalculate((prevState:any) => !prevState);
      GattConnect.getPrimaryService(optionalServices)
      .then((service:any) => service.getCharacteristic(CHARACTERISTIC_UUID[1]))
      .then((characteristic:any) => {
        // Writing 1 is the signal to start calculating
        const startToCalculate = Uint8Array.of(!isCalculate);
        return characteristic.writeValue(startToCalculate);
      })
      .then((_: any) => {
        !isCalculate ? message.success('Calculating has been started.') :
        message.success('Calculating has been stopped.');

        if(!isCalculate)
          setIsCalculating(true);
      })
      .catch((error:any) => { 
        console.error(error); 
        setIsCalculate(false);
      });

    }
    
    const BUTTON = GattConnect == undefined ? 
                <Button type="primary" icon={<PlayCircleOutlined />} size="large" onClick={ConnectOnClick}>
                Connect
                </Button>:
                <Space>
                  <Button type="primary" icon={isCalculate ? <PauseCircleOutlined /> : <PlayCircleOutlined />} size="large" onClick={StartToCalculating}>
                    {isCalculate ? "Stop calculating" : "Start to calculate"}  
                  </Button>
                  <Button type="primary" icon={<PauseCircleOutlined />} size="large" onClick={DisconnectOnClick}>
                      Disconnect
                  </Button>
                </Space>
                ;
    return <PageContainer>
        <Card title="Biomedical Electronics" extra={BUTTON}>
            {GattConnect &&
            <>
                <Row gutter={24}>
                  {/* <Col {...topColResponsiveProps}>
                    <Card title="STATUS">
                      {`${SPO2} %`}
                    </Card>
                 </Col>
                 <Col {...topColResponsiveProps}>
                  <Card title="SPO2">
                    {`${SPO2} %`}
                  </Card>
                 </Col>
                 <Col {...topColResponsiveProps}>
                  <Card title="Heart Rate">
                    {`${HEART_RATE} beat/min`}
                  </Card>
                 </Col> */}
                 <Col {...topColResponsiveProps}>
                  <ChartCard
                      bordered={true}
                      title="STATUS"
                      action={
                        <Tooltip title="Statuses">
                          <InfoCircleOutlined />
                        </Tooltip>
                      }
                      // loading={loading}
                      total={() => isCalculating ? "Calculating" : 'Stop calculating'}
                      footer={<Field label="Last calculating" value={(lastCalculate && isCalculating) ? <>{lastCalculate} <Spin/></> : 
                                                                        (!lastCalculate && isCalculating) ? <>{"Unknown"} <Spin/></> :
                                                                        lastCalculate && !isCalculating ? <>{lastCalculate} <CheckOutlined /></> : 
                                                                        "Unknown"} />}
                      contentHeight={46}
                    >
                      <Field label="SPO2" value={`${SPO2} %`} />
                      <Field label="HEART RATE" value={`${HEART_RATE} beat/min`} />
                    </ChartCard>

                 </Col>
                </Row>
                <Row gutter={24}>
                 <Col span={24}>
                    <Chart
                        options={CConfig.options}
                        series={CConfig.series}
                        type="line"
                        height={600}
                    />
                 
                 </Col>
                </Row>
                
            </>
            }  
        </Card>
    </PageContainer>
}