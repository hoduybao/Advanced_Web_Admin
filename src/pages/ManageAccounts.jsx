import { Button, Spin, Table, notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiAccount from "../../utils/api/account";
import Papa from "papaparse";

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
  const [api, contextHolder] = notification.useNotification();

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
  const handleExportUsers = () => {
    const users = [];
    for (let i = 0; i < listUsers?.length; i++) {
      users.push({
        Email: listUsers[i].email,
        "Student ID": listUsers[i].mssv,
      });
    }
    const csv = Papa.unparse(users, {
      quotes: true,
    });

    // Tạo một Blob từ chuỗi CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Tạo một đường dẫn URL cho Blob
    const url = URL.createObjectURL(blob);

    // Tạo một thẻ a để tạo và tải tệp CSV
    const a = document.createElement("a");
    a.href = url;
    a.download = `List users.csv`;
    a.click();

    // Giải phóng URL đối tượng
    URL.revokeObjectURL(url);
  };
  const handleChangeUploadGrade = (event) => {
    const file = event.target.files[0];

    var formdata = new FormData();
    formdata.append("file", file);

    const fetch = async () => {
      setIsLoading(true);

      await ApiAccount.uploadIds(`admin/upload-map-studentId`, formdata).then(
        (response) => {
          setDataResponse(response.data);
          const data = tranferDataToTable(response.data.Userdata);
          setListUsers(data);
          api.success({
            duration: 1.5,
            message: `Map students ids successfully!`,
            placement: "topRight",
          });
           
        }
      );
      setIsLoading(false);
    };
    fetch();
  };

  useEffect(() => {
    getListUsers(1);
  }, []);

  return (
    <div className="py-6 px-8 flex flex-col w-full">
    {contextHolder}
      <div className="text-2xl font-medium  mb-8">Manage list users</div>
      <div className="flex gap-4 mb-4 justify-end">
        <Button
          onClick={handleExportUsers}
          className="border-[#355ED4] text-[#355ED4] text-base font-medium h-10"
        >
          Export list users
        </Button>

        <input
          id="mapIds"
          type="file"
          accept=".csv"
          onChange={handleChangeUploadGrade}
          hidden
          name="fileUpload"
        />
        <Button className="border-[#355ED4] text-[#355ED4] text-base font-medium h-10">
          <label className="h-full w-full" htmlFor={"mapIds"}>
            Map stundent ids
          </label>
        </Button>
      </div>
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
