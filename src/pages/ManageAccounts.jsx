import { Button, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiAccount from "../../utils/api/account";

const tranferDataToTable = (data) => {
  return data.map((item) => {
    return {
      key: item._id,
      id: item._id,
      name: item.fullname,
      email: item.email,
      mssv: item.IDStudent ? item.IDStudent : "",
      status: item.isLocked,
    };
  });
};

export default function ManageAccounts() {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "ID Student",
      dataIndex: "mssv",
      key: "mssv",
      sorter: (a, b) => a.mssv.localeCompare(b.mssv),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <span>{text ? "Locked" : "Active"}</span>,
    },

    {
      title: "Action",
      key: "id",
      dataIndex: "id",
      render: (text) => (
        <Button
          type="primary"
          className="!bg-[#1677ff]"
          onClick={() => navigate(`/detail-user/${text}`)}
        >
          Detail
        </Button>
      ),
    },
  ];

  const [listUsers, setListUsers] = useState([]);
  const [dataResponse, setDataResponse] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  console.log(listUsers);

  const getListUsers = async (currentPage) => {
    setIsLoading(true);
    let response = await ApiAccount.getListUsers(
      `admin/getAllUser?pageNumber=${currentPage}&&pageSize=10`
    );
    setDataResponse(response.data);
    const data = tranferDataToTable(response.data.Userdata);
    setListUsers(data);
    setIsLoading(false);
  };
  useEffect(() => {
    getListUsers(1);
  }, []);

  return (
    <div className="py-6 px-8 flex flex-col w-full">
      <div className="text-2xl font-medium  mb-8">Manage list users</div>
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={listUsers}
          pagination={{
            pageSize: 10,
            position: ["bottomCenter"],
            currentPage: dataResponse?.currentPage,
            total: dataResponse?.totalUsers,
            onChange: (page) => {
              getListUsers(page);
            },
          }}
        />
      </Spin>
    </div>
  );
}
