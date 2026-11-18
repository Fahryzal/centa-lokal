import React, { useState } from 'react';
import { Collapse, Checkbox, Divider } from 'antd';

const { Panel } = Collapse;

interface MenuItem {
  id: number;
  name: string;
  children?: MenuItem[];
}
interface Props {
  data: MenuItem[];
  rolePermissions: Permission[];
  setRolePermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  dataDefault?: any;
}

interface Permission {
  menuId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

const permissionOptions = ['canView', 'canAdd', 'canEdit', 'canDelete', 'canApprove'] as const;
type PermissionKey = (typeof permissionOptions)[number];
const MenuPermissions: React.FC<Props> = ({ data, rolePermissions, setRolePermissions }) => {
  const [parentChecked, setParentChecked] = useState<Record<number, boolean>>({});

  React.useEffect(() => {
    if (data && rolePermissions.length > 0) {
      const newParentChecked: Record<number, boolean> = {};
      data.forEach((menu) => {
        if (menu.children) {
          const hasPermission = menu.children.some((child) =>
            rolePermissions.some((p) => p.menuId === child.id)
          );
          if (hasPermission) {
            newParentChecked[menu.id] = true;
          }
        }
      });
      setParentChecked((prev) => ({ ...prev, ...newParentChecked }));
    }
  }, [data, rolePermissions]);

  const toggleParent = (menuId: number, checked: boolean, children?: MenuItem[]) => {
    setParentChecked((prev) => ({ ...prev, [menuId]: checked }));
    if (children) {
      if (checked) {
        const newPermissions = children.map((child) => ({
          menuId: child.id,
          canView: true,
          canAdd: true,
          canEdit: true,
          canDelete: true,
          canApprove: true,
        }));
        setRolePermissions((prev) => [
          ...prev.filter((p) => !children.some((c) => c.id === p.menuId)),
          ...newPermissions,
        ]);
      } else {
        setRolePermissions((prev) => prev.filter((p) => !children.some((c) => c.id === p.menuId)));
      }
    }
  };

  const togglePermission = (menuId: number, perm: PermissionKey, checked: boolean) => {
    setRolePermissions((prev) => {
      const existing = prev.find((p) => p.menuId === menuId);
      if (
        !checked &&
        existing &&
        permissionOptions.every((key) => key === perm || !existing[key])
      ) {
        return prev.filter((p) => p.menuId !== menuId);
      }

      if (existing) {
        return prev.map((p) => (p.menuId === menuId ? { ...p, [perm]: checked } : p));
      }

      return [
        ...prev,
        {
          menuId,
          canView: perm === 'canView',
          canAdd: perm === 'canAdd',
          canEdit: perm === 'canEdit',
          canDelete: perm === 'canDelete',
          canApprove: perm === 'canApprove',
        },
      ];
    });
  };

  const isChecked = (menuId: number, perm: PermissionKey) => {
    return !!rolePermissions.find((p) => p.menuId === menuId && p[perm]);
  };
  return (
    <Collapse defaultActiveKey={[1]}>
      {data.map((menu) => (
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox
                checked={parentChecked[menu.id] || false}
                onChange={(e) => {
                  toggleParent(menu.id, e.target.checked, menu.children);
                  togglePermission(menu.id, 'canView', e.target.checked);
                }}
              >
                {menu.name}
              </Checkbox>
            </div>
          }
          key={menu.id}
        >
          {menu.children?.map((child) => (
            <div key={child.id} style={{ marginLeft: 24, marginBottom: 12 }}>
              <strong>{child.name}</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                {permissionOptions.map((perm) => (
                  <Checkbox
                    key={perm}
                    checked={isChecked(child.id, perm)}
                    onChange={(e) => togglePermission(child.id, perm, e.target.checked)}
                    disabled={!parentChecked[menu.id]}
                  >
                    {perm.replace('can', '')}
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}
          <Divider style={{ margin: '12px 0' }} />
        </Panel>
      ))}
    </Collapse>
  );
};

export default MenuPermissions;
