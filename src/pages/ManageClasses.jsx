import { Button, Select, Spin, Table, Tooltip, notification } from "antd";
import { useEffect, useState } from "react";
import ApiClass from "../../utils/api/class";

const tranferDataToTable = (data) => {
  return data.map((item, index) => {
    return {
      key: index,
      id: item._id,
      name: item.title,
      hostName: item.owner.fullname,
      subTitle: item.subTitle,
      status: item.isActived,
      code: item.invitationCode,
    };
  });
};

export default function ManageClasses() {
  const columns = [
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Host Name",
      dataIndex: "hostName",
      key: "hostName",
      sorter: (a, b) => a.hostName.localeCompare(b.hostName),
    },
    {
      title: "Class code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Description",
      dataIndex: "subTitle",
      key: "subTitle",
      ellipsis: {
        showTitle: false,
      },
      render: (subTitle) => (
        <Tooltip placement="topLeft" title={subTitle}>
          {subTitle}
        </Tooltip>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <span>{text ? "Active" : "Inactive"}</span>,
    },

    {
      title: "Action",
      key: "id",
      dataIndex: "id",
      render: (text, record) => (
        <Button
          type="primary"
          className="!bg-[#1677ff]"
          onClick={() => handleActiveClass(text)}
        >
          {record.status ? "Inactive" : "Active"}
        </Button>
      ),
    },
  ];

  const [api, contextHolder] = notification.useNotification();
  const [listClasses, setListClasses] = useState([]);
  const [dataResponse, setDataResponse] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const getListClasses = async (currentPage, status) => {
    setIsLoading(true);
    const params = `pageNumber=${currentPage}&&pageSize=10${
      status ? `&&active=${status}` : ""
    }`;
    let response = await ApiClass.getListClass(`admin/getAllClass?${params}`);
    setDataResponse(response.data);
    const data = tranferDataToTable(response.data.classes);
    setListClasses(data);
    setIsLoading(false);
  };

  const handleActiveClass = async (id) => {
    setIsLoading(true);
    let response = await ApiClass.activeClass(
      `admin/toggle-status-class/${id}`
    );
    if (response.success) {
      const updatedClasses = [...listClasses];
      const index = updatedClasses.findIndex(
        (element) => element.id === response.data._id
      );
      updatedClasses[index] = {
        key: response.data._id,
        id: response.data._id,
        name: response.data.title,
        hostName: response.data.owner.fullname,
        subTitle: response.data.subTitle,
        status: response.data.isActived,
        code: response.data.invitationCode,
      };
      setListClasses(updatedClasses);
      api.success({
        duration: 1.5,
        message: `${
          response.data.isActived ? "Actived class" : "Inactived class"
        }!`,
        placement: "topRight",
      });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getListClasses(1);
  }, []);

  return (
    <div className="py-6 px-8 flex flex-col w-full">
      {contextHolder}
      <div className="text-2xl font-medium  mb-8">Manage list classes</div>
      <Spin spinning={isLoading}>
        <div className="flex mb-4">
          <Select
            className="!h-10"
            placeholder="Select status"
            style={{
              width: 120,
            }}
            onChange={(value) => {
              getListClasses(1, value);
            }}
            options={[
              {
                value: "true",
                label: "Active",
              },
              {
                value: "false",
                label: "Inactive",
              },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={listClasses}
          pagination={{
            pageSize: 10,
            position: ["bottomCenter"],
            currentPage: dataResponse?.currentPage,
            total: dataResponse?.totalUsers,
            onChange: (page) => {
              getListClasses(page);
            },
          }}
        />
      </Spin>
    </div>
  );
}
