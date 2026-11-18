import { useRef, useState } from 'react';
import { Layout, Menu, Breadcrumb, Drawer, Button, Dropdown } from 'antd';
import { MenuOutlined, PieChartOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router-dom';
import * as helperGlobal from '@/utils/helper';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import logoCompany from '@/assets/image-logo/logo-company-removebg-preview.png';
import { useAccess } from '@/contexts/AccessContext';

const menu = (
  <Menu>
    {/* <Menu.Item key="1" onClick={() => console.log('ok')}>
      Profile
    </Menu.Item> */}
    <Menu.Item key="2" onClick={() => helperGlobal.logout()}>
      Log Out
    </Menu.Item>
    {/* Tambahkan item lain jika perlu */}
  </Menu>
);

const MainLayout = () => {
  const location = useLocation();

  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(250); // Lebar default

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setWidth(collapsed ? 250 : 0); // Ganti dengan lebar yang diinginkan saat menyempit
  };

  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  // Ambil user dari cookie, asumsi ada format { role: "admin" } misalnya
  // const token = getAccessToken();
  // const decodeToken: InterfacesLayout.InterfacesLayoutType = jwtDecode(token || '');
  // Fungsi cek apakah role user termasuk di allowedRoles
  // const canAccess = (allowedRoles: string[]) => {
  //   console.log('allowedRoles', allowedRoles);
  //   return true
  //   return decodeToken?.roles?.some((role) => allowedRoles.includes(role));
  // };

  const { access, user } = useAccess();

  // Menu Items (Untuk Sidebar & Drawer agar tidak duplikasi)
  const menuItems = (
    <>
      <Menu.Item key="/" icon={<PieChartOutlined />}>
        <NavLink to="/">Dashboard</NavLink>
      </Menu.Item>

      {access?.map((items) => {
        return (
          <SubMenu key={items.menu} icon={<UserOutlined />} title={items.menu}>
            {items?.children?.map((childs) => {
              return (
                <Menu.Item key={childs.path}>
                  <NavLink to={childs.path}>{childs.menu}</NavLink>
                </Menu.Item>
              );
            })}
          </SubMenu>
        );
      })}
    </>
  );

  const isResizing = useRef(false);

  const startResize = () => {
    isResizing.current = true;
    document.body.classList.add('resizing'); // disable text select
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = Math.min(Math.max(e.clientX, 100), 500); // Min 100px, Max 500px
      setWidth(newWidth);
    }
  };

  const stopResize = () => {
    isResizing.current = false;
    document.body.classList.remove('resizing'); // re-enable text select
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar untuk layar besar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        width={width}
        style={{
          display: 'block',
          position: 'relative',
          background: '#001529',
          transition: 'width 0.2s ease', // smooth effect
        }}
      >
        <div
          className="logo"
          style={{
            gap: 0,
            padding: 16,
            textAlign: 'center',
            color: 'white',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <img
            src={logoCompany}
            alt="ikn-logo"
            style={{
              width: 40,
              height: 40,
            }}
          />
          <span
            style={{
              fontSize: 20,
            }}
          >
            {collapsed ? 'M' : 'PT IKN'}
          </span>
        </div>
        <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">
          {menuItems}
        </Menu>
        {/* Custom Resizer */}
        <div
          className="resizer"
          onMouseDown={startResize}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 5,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 1,
          }}
        />
      </Sider>

      {/* Drawer untuk tampilan Mobile */}
      <Drawer title="Dashboard Menu" placement="left" closable onClose={closeDrawer} open={visible}>
        <Menu defaultSelectedKeys={[location.pathname]} mode="inline">
          {menuItems}
        </Menu>
      </Drawer>

      {/* Layout utama */}
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#001529',
            color: 'white',
          }}
        >
          {/* Tombol untuk membuka drawer di mobile */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: 'white', fontSize: '18px' }} />}
            onClick={showDrawer}
          />
          <div
            style={{
              display: 'flex',
              gap: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, color: 'white' }}>{user?.name}</h2>

            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                type="text"
                icon={<LoginOutlined style={{ color: 'white', fontSize: '18px' }} />}
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '16px',
            background: 'white',
            padding: 20,
            borderRadius: 20,
          }}
        >
          <div
            style={{
              margin: '16px 0',
              padding: '10px 16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Breadcrumb>
              <Breadcrumb.Item>
                <NavLink to="/">Home</NavLink>
              </Breadcrumb.Item>

              {pathSnippets
                .filter(
                  (snippet, index) =>
                    !(index === pathSnippets.length - 1 && helperGlobal.isUUID(snippet))
                ) // Filter ID di posisi terakhir
                .map((snippet, index) => {
                  const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                  return (
                    <Breadcrumb.Item key={url}>
                      <NavLink to={url}>
                        <b style={{ color: 'black' }}>
                          {snippet.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </b>
                      </NavLink>
                    </Breadcrumb.Item>
                  );
                })}
            </Breadcrumb>
          </div>

          <div
            style={{
              overflowY: 'auto',
              height: '100vh',
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Dashboard ©2025 Created by IKN</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
