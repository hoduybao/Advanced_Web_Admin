import { Button, Spin, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiAccount from "../../utils/api/account";
import ApiClass from "../../utils/api/class";

const tranferDataToTable = (data) => {
  return data.map((item) => {
    return {
      key: item._id,
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
  const navigate = useNavigate();
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
      render: (text) => (
        <Button
          type="primary"
          className="!bg-[#1677ff]"
          onClick={() => navigate(`/detail-class/${text}`)}
        >
          Detail
        </Button>
      ),
    },
  ];

  const [listClasses, setListClasses] = useState([]);
  const [dataResponse, setDataResponse] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  console.log(listClasses);

  const getListClasses = async (currentPage,status) => {
    setIsLoading(true);
    let response = await ApiClass.getListClass(
      `admin/getAllClass?pageNumber=${currentPage}&&pageSize=10`
    );
    setDataResponse(response.data);
    const data = tranferDataToTable(response.data.classes);
    setListClasses(data);
    setIsLoading(false);
  };
  useEffect(() => {
    getListClasses(1);
  }, []);

  return (
    <div className="py-6 px-8 flex flex-col w-full">
      <div className="text-2xl font-medium  mb-8">Manage list classes</div>
      <Spin spinning={isLoading}>
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
