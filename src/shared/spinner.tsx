import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

function Spinner({ size}: any) {
  return (
    <Spin indicator={<LoadingOutlined style={{color: 'white'}}  spin />} size={size} />
  );
}

export default Spinner;
