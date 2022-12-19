import { useEffect, useRef, useState } from 'react';

export default () => {
  const DataChartRef = useRef();
  const [GattConnect, setGattConnect] = useState<any>();
  // const DevDataIndex = useRef({
  //   'b8eaccdb-8188-42a3-a10b-3b49efeb61fd': 0,
  //   'c3d2fa8a-4358-4569-a346-484df10520f5': 1,
  // });

  const [DevDataCount, setDevDataCount] = useState(0);
  const [isCalculate, setIsCalculate] = useState(false);
  const [SPO2, setSPO2] = useState(0);
  const [HEART_RATE, setHEART_RATE] = useState(0);
  const [lastCalculate, setLastCalculate] = useState<any>();
  const [isCalculating, setIsCalculating] = useState(false);
  const LabelVal = {
    'b8eaccdb-8188-42a3-a10b-3b49efeb61fd': 'Red LED',
    // 'c3d2fa8a-4358-4569-a346-484df10520f5': 'IR LED',
  };

  const CHARACTERISTIC_UUID = [
    'b8eaccdb-8188-42a3-a10b-3b49efeb61fd',
    'c3d2fa8a-4358-4569-a346-484df10520f5',
    // 'd711ede2-ff90-4367-baca-be1ac6ddde52',
    // "b2d483b9-64c0-4fb8-bf97-04aa66124bc5"
  ];

  const DeviceMaxLen = 100;
  const DeviceData = useRef({
    RED: [],
    IR: [],
  });
  const [DataChart, setDataChart] = useState({
    RED: [],
    IR: [],
  });
  // new Array(DeviceMaxLen).fill({
  //   Value: 0,
  //   Time: 0,
  // });
  // useEffect(() => {
  //   for (let i = 0; i < DeviceMaxLen; i++) {
  //     if (i % 2 === 0) {
  //       DeviceData[i].category = 'RED LED';
  //     } else {
  //       DeviceData[i].category = 'IR LED';
  //     }
  //   }
  // }, []);
  return {
    GattConnect,
    setGattConnect,
    DeviceData,
    DataChartRef,
    LabelVal,
    // DevDataIndex,
    DeviceMaxLen,
    setDevDataCount,
    DevDataCount,
    DataChart,
    setDataChart,
    CHARACTERISTIC_UUID,
    isCalculate,
    setIsCalculate,
    HEART_RATE,
    setHEART_RATE,
    SPO2,
    setSPO2,
    lastCalculate,
    setLastCalculate,
    isCalculating,
    setIsCalculating,
  };
};
