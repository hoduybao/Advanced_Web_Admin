import { IoPersonOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";

import { MdOutlineClass } from "react-icons/md";

import { Button, Menu, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Manage Accounts", "1", <IoPersonOutline size={25} />),
  getItem("Manage Classes", "2", <MdOutlineClass size={25} />),
  getItem("Logout", "3", <LuLogOut size={25} />),
];
const SideBar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  return (
    <div className="w-[260px] border-r-[1px] border-[#E5E5E5] h-screen fixed z-10 !text-base">
      <Menu
        onClick={({ key }) => {
          switch (key) {
            case "1":
              navigate("/");
              break;
            case "2":
              navigate("/manage-classes");
              break;
            case "3":
              setOpen(true);
              break;
          }
        }}
        className="text-base font-medium"
        style={{
          itemMarginBlock: 10,
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="light"
        items={items}
      />
      <Modal
        centered
        open={open}
        closable={false}
        footer={null}
        className="w-full md:!w-[494px]"
      >
        <div className="flex flex-col gap-[45px] px-6 pt-[49px] pb-[14px]">
          <div className="text-base font-normal font-pretendard text-grey-13 self-center">
            Do you want to logout?
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
              type="primary"
              onClick={() => {
                window.localStorage.clear();
                window.location.reload();
              }}
              className="!px-[48px] !py-2.5 !h-[46px] !bg-[#1677ff]"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default SideBar;
