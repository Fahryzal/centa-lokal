import { Modal as AntModal, ModalProps } from 'antd';

/**
 * Custom Modal wrapper untuk Ant Design.
 * Tujuannya agar mudah diubah saat upgrade/ganti library
 * tanpa ubah semua implementasi di seluruh project.
 */
const Modal = ({ ...rest }: ModalProps) => {
  return (
    <AntModal
      centered
      maskClosable={false}
      destroyOnClose
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        ...rest.style, // biar bisa override style dari luar
      }}
      {...rest}
    />
  );
};

export default Modal;
