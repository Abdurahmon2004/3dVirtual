import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Chip,
  Fab,
} from "@mui/material";
import { Add, Edit, Block, Search, MonetizationOn } from "@mui/icons-material";
import {
  useBlockUser,
  useCreateUser,
  useGetUsers,
  useUpdateUser,
} from "@/hooks/modules/users";
import GlobalPagination from "@/components/dashboard/GlobalPagination";
import { useNavigate } from "react-router";

interface Owner {
  id: number;
  owner_id: number;
  name: string;
  phone: string;
  status: number;
  company: string;
  login: string;
  password?: string;
}

export default function Users() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    company: "",
    login: "",
    password: "",
    status: 1,
    id: 0,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState<any>(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const { data: ownersResponse, isLoading, refetch: getUsers } = useGetUsers({
    page,
    limit,
    search: debouncedSearch,
  });

  const total = ownersResponse?.data?.total || 0;
  const { mutate: createUser, isSuccess: createSuccess } = useCreateUser();
  const { mutate: updateUser, isSuccess: updateSuccess } = useUpdateUser();
  const { mutate: blockUser, isSuccess: blockSuccess } = useBlockUser();

  const handleSave = () => {
    if (editingOwner) {
      updateUser({ ...formData, owner_id: editingOwner.id });
    } else {
      createUser(formData);
    }
  };
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      setOpenDialog(false)
      getUsers()
    }

  }, [createSuccess, updateSuccess])

  const handleBlock = (owner: Owner) => blockUser(owner.id);
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      getUsers();
    }
  }, [debouncedSearch]);

  return (
    <Box p={{ xs: 1, md: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={1.5}
      >
        <TextField
          placeholder="Foydalanuvchi qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Fab
          color="primary"
          size="medium"
          sx={{
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          }}
          onClick={() => {
            setEditingOwner(null);
            setFormData({
              name: "",
              phone: "",
              company: "",
              login: "",
              password: "",
              status: 1,
              id: 0,
            });
            setOpenDialog(true);
          }}
        >
          <Add />
        </Fab>
      </Box>
      {isLoading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow >
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ism</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Kompaniya</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Telefon</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Holat</TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, width: 100, textAlign: "center" }}
                    >
                      Amallar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ownersResponse.data.map((owner: Owner, index: number) => (
                    <TableRow
                      key={owner.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(99,102,241,0.05)",
                        },
                      }}
                    >
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{owner.name}</TableCell>
                      <TableCell>{owner.company}</TableCell>
                      <TableCell>{owner.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            owner.status === 1 ? "Aktiv" : "Bloklangan"
                          }
                          size="small"
                          sx={{
                            bgcolor:
                              owner.status === 1
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(239,68,68,0.1)",
                            color:
                              owner.status === 1
                                ? "rgb(22,163,74)"
                                : "rgb(220,38,38)",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={0.5}>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => { navigate(`/owner-subscription?owner_id=${owner.id}`) }}
                          >
                            <MonetizationOn fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              setEditingOwner(owner);
                              setFormData(owner);
                              setOpenDialog(true);
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleBlock(owner)}
                          >
                            <Block fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}

                  {ownersResponse?.data?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ py: 2, color: "gray" }}
                      >
                        Ma'lumot topilmadi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <GlobalPagination
            page={page}
            perPage={limit}
            total={total}
            //@ts-ignore
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0.5,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 0,
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          {editingOwner ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"}
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 1,
          }}
        >
          <TextField
            label="Ism"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            size="small"
          />
          <TextField
            label="Telefon"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            size="small"
          />
          <TextField
            label="Kompaniya"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            size="small"
          />
          <TextField
            label="Login"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            size="small"
          />
          {!editingOwner && (
            <TextField
              label="Parol"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              size="small"
            />
          )}
          <TextField
            select
            label="Holat"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: Number(e.target.value) })
            }
            size="small"
          >
            <MenuItem value={1}>Aktiv</MenuItem>
            <MenuItem value={0}>Bloklangan</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button
            size="small"
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              background: "linear-gradient(90deg, #6366f1, #3b82f6)",
            }}
          >
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
