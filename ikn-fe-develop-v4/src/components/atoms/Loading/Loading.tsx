import { Spin } from 'antd';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Spin size="large" />
      Loading.....
    </div>
  );
};

export default Loading;
