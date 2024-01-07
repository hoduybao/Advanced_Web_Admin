import { Button, Col, Form, Input, Modal, Row, Spin, notification } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiAccount from "../../utils/api/account";

const convertDate = (time) => {
  var due = new Date(time);
  return due.toISOString().split("T")[0];
};
export default function DetailUser() {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const params = useParams();
  const id = params.id;

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const [detailUser, setDetailUser] = useState(null);
  console.log(detailUser);

  const getDetailUser = async (id) => {
    setIsLoading(true);
    let response = await ApiAccount.getDetailUser(`admin/getDetailUser/${id}`);
    setDetailUser(response.data);
    setIsLoading(false);
  };

  const onFinish = async (values) => {
    setIsLoadingBtn(true);
    let response = await ApiAccount.updateInforUser(
      `admin/update-details-user`,
      {
        userId: id,
        studentId: values.mssv ? values.mssv : "",
      }
    );
    setDetailUser(response.data);
    api.success({
      duration: 1.5,
      message: `Update successfully!`,
      placement: "topRight",
    });
    setIsLoadingBtn(false);
  };
  const handleLockAccount = async () => {
    setIsLoadingBtn(true);
    let response = await ApiAccount.lockAccount(
      `admin/toggle-status-user/${id}`
    );
    setDetailUser(response.data);
    setIsLoadingBtn(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!detailUser) {
      getDetailUser(id);
    } else {
      form.setFieldsValue({
        name: detailUser?.fullname,
        email: detailUser?.email,
        mssv: detailUser?.IDStudent,
        address: detailUser?.address,
        dob: detailUser?.dateofbirth
          ? convertDate(detailUser?.dateofbirth)
          : detailUser?.dateofbirth,
        status: detailUser?.isLocked ? "Locked" : "Active",
      });
    }
  }, [id, detailUser]);

  return (
    <div className="px-14 py-8 flex flex-col w-full">
      {contextHolder}
      <div className="text-2xl font-medium mb-8">User information</div>
      <Spin spinning={isLoading}>
        <Form
          onFinish={onFinish}
          form={form}
          name="invite"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          autoComplete="off"
        >
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                className="font-normal !text-lg"
                name="name"
              >
                <Input className="!h-10 !text-gray-600" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ID Student" name="mssv">
                <Input className="!h-10" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Email"
                className="font-normal !text-lg"
                name="email"
              >
                <Input className="!h-10 !text-gray-600" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Address" name="address">
                <Input className="!h-10 !text-gray-600" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Date of birth"
                className="!h-10 !text-gray-600"
                name="dob"
              >
                <Input className="!h-10" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div className="flex items-end gap-2">
                <Form.Item label="Status" name="status" className="flex-1">
                  <Input className="!h-10 !text-gray-600" disabled />
                </Form.Item>

                <Form.Item>
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    type="primary"
                    danger
                    className="rounded py-[6px] min-h-[38px]  text-base  !border-none"
                  >
                    {detailUser?.isLocked ? "Unlock account" : "Lock account"}
                  </Button>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="flex">
            <Button
              loading={isLoadingBtn}
              htmlType="submit"
              type="primary"
              className="!bg-[#1677ff] rounded py-[6px] min-h-[38px]  text-base  !border-none"
            >
              Save changes
            </Button>
          </div>
        </Form>
      </Spin>
      <Modal
        centered
        open={open}
        closable={false}
        footer={null}
        className="w-full md:!w-[494px]"
      >
        <div className="flex flex-col gap-[45px] px-6 pt-[49px] pb-[14px]">
          <div className="text-base font-normal font-pretendard text-grey-13 self-center">
            {detailUser?.isLocked
              ? "Do you want to unlock this account?"
              : "Do you want to block this account?"}
          </div>

          <div className="self-center flex flex-row gap-4">
            <Button
              onClick={() => {
                setOpen(false);
              }}
              className="!px-[48px] !py-2.5 !h-[46px] !bg-[#F2F2F7] text-base text-[#989CAD] border-none"
            >
              Cancel
            </Button>

            <Button
              loading={isLoadingBtn}
              type="primary"
              danger
              onClick={() => {
                handleLockAccount();
              }}
              className="!px-[48px] !py-2.5 !h-[46px]"
            >
              {detailUser?.isLocked ? "Unlock" : "Lock"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
