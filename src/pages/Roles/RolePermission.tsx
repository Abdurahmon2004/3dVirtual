import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useSearchParams } from "react-router";
import { useCreateRolePermission, useRolePermissions } from "@/hooks/modules/roles";
import { Button } from "@mui/material";

interface Permission {
  id: number;
  name: string;
  status?: number;
  checked?: boolean;
}

interface PermissionGroup {
  group_name: string;
  permissions: Permission[];
}

interface RolePermissionsResponse {
  permissions: PermissionGroup[];
}

export default function RolePermission() {
  const [searchParams] = useSearchParams();
  const role_id = Number(searchParams.get("role_id"));
  const { data, isLoading, error, refetch } = useRolePermissions(role_id);
  const [permissionData, setPermissionData] = useState<PermissionGroup[]>([]);
  const { mutate, isSuccess } = useCreateRolePermission();
  useEffect(() => {
    if (!isLoading && data && permissionData.length === 0) {
      const formatted = (data as RolePermissionsResponse).permissions.map((group) => ({
        ...group,
        permissions: group.permissions.map((p) => ({
          ...p,
          checked: p.status === 1,
        })),
      }));
      setPermissionData(formatted);
    }
  }, [isLoading, data, permissionData.length]);


  if (isLoading) return <p className="p-4 text-gray-500">Yuklanmoqda...</p>;
  if (error) return <p className="p-4 text-red-500">Xatolik yuz berdi.</p>;
  if (!data || !data.permissions.length)
    return <p className="p-4 text-gray-500">Hech qanday ruxsat topilmadi.</p>;

  const toggleItem = (groupIndex: number, permIndex: number) => {
    setPermissionData((prev) =>
      prev.map((group, gIdx) =>
        gIdx === groupIndex
          ? {
            ...group,
            permissions: group.permissions.map((p, pIdx) =>
              pIdx === permIndex ? { ...p, checked: !p.checked } : p
            ),
          }
          : group
      )
    );
  };

  const toggleAll = (groupIndex: number) => {
    setPermissionData((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIndex) return group;
        const allChecked = group.permissions.every((p) => p.checked);
        return {
          ...group,
          permissions: group.permissions.map((p) => ({
            ...p,
            checked: !allChecked,
          })),
        };
      })
    );
  };

  const handleSave = () => {
    const permission_ids = permissionData
      .flatMap((group) => group.permissions)
      .filter((p) => p.checked)
      .map((p) => p.id);
    //@ts-ignore
    mutate({ permission_ids, role_id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {permissionData.map((group, idx) => (
        <PermissionGroupCard
          key={idx}
          group={group}
          groupIndex={idx}
          toggleItem={toggleItem}
          toggleAll={toggleAll}
        />
      ))}
      <div className="flex justify-end pt-3">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 600 }}
        >
          <i className="fa-solid fa-floppy-disk me-1"></i> Saqlash
        </Button>
      </div>
    </div>
  );
}

function PermissionGroupCard({
  group,
  groupIndex,
  toggleItem,
  toggleAll,
}: {
  group: PermissionGroup;
  groupIndex: number;
  toggleItem: (groupIndex: number, permIndex: number) => void;
  toggleAll: (groupIndex: number) => void;
}) {
  const [open, setOpen] = useState(true);

  const checkedCount = useMemo(
    () => group.permissions.filter((p) => p.checked).length,
    [group.permissions]
  );

  return (
    <div className="border rounded-2xl mb-3 shadow-sm ">
      <div
        className="flex items-center justify-between p-3 rounded-2xl cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={checkedCount === group.permissions.length}
            onChange={(e) => {
              e.stopPropagation();
              toggleAll(groupIndex);
            }}
            className="w-5 h-5 accent-blue-600 cursor-pointer"
          />
          <span className="font-semibold text-lg">{group.group_name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-blue-700 px-3 py-1 rounded-full">
            {checkedCount}/{group.permissions.length}
          </span>
          {open ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
      {open && (
        <div className="grid grid-cols-2 gap-3 px-6 py-4 rounded-b-2xl">
          {group.permissions.map((perm, i) => (
            <label
              key={perm.id ?? i}
              className="flex items-center gap-3 font-medium cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!perm.checked}
                onChange={() => toggleItem(groupIndex, i)}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
              {perm.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
