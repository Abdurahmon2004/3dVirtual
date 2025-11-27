import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Paper,
  Tooltip,
  Fade,
  Chip,
  Fab,
} from "@mui/material";
import { Add, Edit, Delete, Shield, People } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { openModal, editModal } from "@/store/features/roleSlice";
import { RootState } from "@/store";
import { useRoles, useDeleteRole } from "@/hooks/modules/roles";
import RoleModal from "@/components/dashboard/Role/RoleModal";
import GlobalPagination from "@/components/dashboard/GlobalPagination";
import { Link } from "react-router";

interface Role {
  id: number;
  name: string;
  is_active: number;
  created_at: string;
}

export default function Roles() {
  const [page, setPage] = useState(1);
  const { data: roles, isLoading, refetch } = useRoles(page);
  const { mutate: deleteRole, isSuccess } = useDeleteRole();

  const dispatch = useDispatch();
  const open = useSelector((store: RootState) => store.role.open);
  useEffect(() => {
    if (!open || isSuccess) {
      refetch();
    }
  }, [open, isSuccess]);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleDelete = (id: number) => {
    deleteRole(id);
  };

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Shield color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Rollar
          </Typography>
        </Stack>

        <Fab
          color="primary"
          size="medium"
          sx={{
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          }}
          onClick={() => dispatch(openModal())}
        >
          <Add />
        </Fab>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        {isLoading ? (
          <Box textAlign="center" p={5}>
            <CircularProgress />
          </Box>
        ) : roles?.data?.length === 0 ? (
          <Box textAlign="center" py={5}>
            <Typography variant="body1" color="text.secondary">
              Rollar mavjud emas!
            </Typography>
          </Box>
        ) : (
          <>
            <Fade in>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nomi</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Holat</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Yaratilgan sana</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                      Amallar
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {roles?.data?.map((item: Role, idx: number) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "#f9fafb" },
                        transition: "0.2s",
                      }}
                    >
                      <TableCell>
                        {idx + 1 + (page - 1) * roles.per_page}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.is_active ? (
                          <Chip
                            label="Faol"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label="Faol emas"
                            color="default"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString("uz-UZ")}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ruxsatlar">
                          <Link to={`/settings/role-permission?role_id=${item.id}`} 
                          >
                            <People fontSize="small" />
                          </Link>
                        </Tooltip>
                        <Tooltip title="Tahrirlash">
                          <IconButton
                            color="primary"
                            onClick={() => dispatch(editModal(item))}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="O‘chirish">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Fade>
            <GlobalPagination
              page={page}
              perPage={roles.per_page}
              total={roles.total}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Paper>
      <RoleModal />
    </div>
  );
}
